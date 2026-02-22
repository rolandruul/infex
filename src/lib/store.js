import { supabase } from './supabase';

// --- Image-to-Profile importer (global_identities + user_saved_profiles) ---

/** Hash image bytes (SHA-256) for deduplication. Returns hex string. */
export async function hashImageBytes(arrayBuffer) {
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/** Call Edge Function to extract name, city, notes from image via GPT-4o Vision. */
export async function extractProfileFromImage(imageBase64) {
  const { data, error } = await supabase.functions.invoke('extract-profile-from-image', {
    body: { image: imageBase64 },
  });
  if (error) throw error;
  if (data?.error) throw new Error(data.error);
  return {
    name: data.name ?? 'Unknown',
    city: data.city ?? '',
    extracted_notes: data.extracted_notes ?? undefined,
  };
}

/** Find existing global_identity by photo_hash or by name+city. */
export async function findExistingGlobalIdentity(photoHash, name, city) {
  if (!name && !city && !photoHash) return null;
  let query = supabase.from('global_identities').select('id, name, city').limit(1);
  if (photoHash) {
    const { data } = await query.eq('photo_hash', photoHash).maybeSingle();
    if (data) return data;
  }
  const n = (name || '').trim();
  const c = (city || '').trim();
  if (n) {
    const { data } = await supabase
      .from('global_identities')
      .select('id, name, city')
      .ilike('name', n)
      .ilike('city', c)
      .limit(1)
      .maybeSingle();
    if (data) return data;
  }
  return null;
}

/** Create global_identity and link to current user. Returns the saved profile row (for UI). */
export async function importProfileFromImage({ name, city, extracted_notes, photo_hash, original_photo_url }) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const existing = await findExistingGlobalIdentity(photo_hash, name, city);
  let globalId;

  if (existing) {
    globalId = existing.id;
  } else {
    const { data: inserted, error: insertError } = await supabase
      .from('global_identities')
      .insert({
        name: name || 'Unknown',
        city: city || '',
        photo_hash: photo_hash || null,
        original_photo_url: original_photo_url || null,
        extracted_notes: extracted_notes || null,
      })
      .select('id')
      .single();
    if (insertError) throw insertError;
    globalId = inserted.id;
  }

  const { data: link, error: linkError } = await supabase
    .from('user_saved_profiles')
    .insert({ user_id: user.id, global_id: globalId })
    .select('id, global_id, added_at')
    .single();
  if (linkError) {
    if (linkError.code === '23505') return { id: link?.id, globalId, alreadySaved: true };
    throw linkError;
  }
  return { id: link.id, globalId, alreadySaved: false };
}

/** Get saved profiles (user_saved_profiles joined with global_identities) for current user. */
export async function getSavedProfiles() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  const { data: links, error: linkError } = await supabase
    .from('user_saved_profiles')
    .select('id, global_id, added_at')
    .eq('user_id', user.id)
    .order('added_at', { ascending: false });
  if (linkError) throw linkError;
  if (!links?.length) return [];

  const globalIds = [...new Set(links.map((l) => l.global_id))];
  const { data: identities, error: identError } = await supabase
    .from('global_identities')
    .select('id, name, city, photo_hash, original_photo_url, extracted_notes, conditions, updated_at, created_at, instagram')
    .in('id', globalIds);
  if (identError) throw identError;
  const byId = Object.fromEntries((identities || []).map((i) => [i.id, i]));

  return links.map((l) => {
    const g = byId[l.global_id];
    if (!g) return null;
    return {
      id: l.id,
      globalId: g.id,
      name: g.name,
      city: g.city || '',
      photo: g.original_photo_url || (g.photo_hash ? 'hash' : ''),
      conditions: g.conditions || [],
      notes: g.extracted_notes || '',
      addedAt: l.added_at,
      lastConditionAt: g.updated_at ?? g.created_at ?? null,
      instagram: g.instagram || '',
    };
  }).filter(Boolean);
}

/** Remove a saved profile (unlink from user). */
export async function deleteSavedProfile(linkId) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  const { error } = await supabase
    .from('user_saved_profiles')
    .delete()
    .eq('id', linkId)
    .eq('user_id', user.id);
  if (error) throw error;
}

/** Get a global identity by id (for profile view). */
export async function getGlobalIdentity(globalId) {
  const { data, error } = await supabase
    .from('global_identities')
    .select('id, name, city, original_photo_url, extracted_notes, conditions, instagram')
    .eq('id', globalId)
    .single();
  if (error || !data) return null;
  return {
    id: data.id,
    name: data.name,
    city: data.city || '',
    photo: data.original_photo_url || '',
    notes: data.extracted_notes || '',
    conditions: data.conditions || [],
    instagram: data.instagram || '',
  };
}

/** Update a global identity (e.g. instagram). Authenticated users can update. */
export async function updateGlobalIdentity(globalId, updates) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  const set = {};
  if (updates.instagram !== undefined) set.instagram = (updates.instagram || '').trim().replace(/^@/, '');
  if (Object.keys(set).length === 0) return null;
  const { data, error } = await supabase
    .from('global_identities')
    .update(set)
    .eq('id', globalId)
    .select()
    .single();
  if (error) throw error;
  return data ? { instagram: data.instagram || '' } : null;
}

/** Add a condition to a global identity. All users who have this identity saved get a notification (via Edge Function). Falls back to DB update + notify current user if the function is unreachable. */
export async function addGlobalIdentityCondition(globalId, condition) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  const value = (condition || '').trim();
  if (!value) return { conditions: [] };

  const { data, error } = await supabase.functions.invoke('add-global-identity-condition', {
    body: { globalId, condition: value },
  });

  const isFetchError = error?.name === 'FunctionsFetchError' || error?.message?.includes('Failed to send');
  if (isFetchError) {
    const { data: row, error: fetchErr } = await supabase
      .from('global_identities')
      .select('conditions')
      .eq('id', globalId)
      .single();
    if (fetchErr || !row) throw new Error('Profile not found');
    const next = [...(row.conditions || []), value];
    const { error: updateErr } = await supabase
      .from('global_identities')
      .update({ conditions: next })
      .eq('id', globalId);
    if (updateErr) throw updateErr;
    return { conditions: next };
  }

  if (error) throw error;
  if (data?.error) throw new Error(data.error);
  return { conditions: data?.conditions ?? [] };
}

/** Get the current user's link id for a global identity (for Remove from list). */
export async function getSavedProfileLinkId(globalId) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase
    .from('user_saved_profiles')
    .select('id')
    .eq('user_id', user.id)
    .eq('global_id', globalId)
    .maybeSingle();
  return data?.id ?? null;
}

// --- Auth (used via Supabase client; session from supabase.auth.getSession()) ---

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signUp(email, password) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getSessionAsync() {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

// --- Profiles ---

export async function getProfiles() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []).map((row) => ({
    id: row.id,
    name: row.name,
    city: row.city || '',
    photo: row.photo || '',
    conditions: row.conditions || [],
    notes: row.notes || '',
    lastConditionAt: row.updated_at ?? row.created_at,
    instagram: row.instagram || '',
  }));
}

export async function getProfile(id) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();
  if (error || !data) return null;
  return {
    id: data.id,
    name: data.name,
    city: data.city || '',
    photo: data.photo || '',
    conditions: data.conditions || [],
    notes: data.notes || '',
    instagram: data.instagram || '',
  };
}

const PROFILE_PHOTOS_BUCKET = 'profile-photos';

/** Upload a profile photo to storage; returns the public URL. Create bucket "profile-photos" (public) in Dashboard if needed. */
export async function uploadProfilePhoto(file) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '');
  const path = `${user.id}/${Date.now()}.${ext || 'jpg'}`;
  const { error } = await supabase.storage.from(PROFILE_PHOTOS_BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  });
  if (error) throw error;
  const { data: { publicUrl } } = supabase.storage.from(PROFILE_PHOTOS_BUCKET).getPublicUrl(path);
  return publicUrl;
}

/** Add a partner: match by name+city to existing global_identity (then link user) or create new. Conditions notify all linked users. */
export async function addProfile(profile) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  const name = (profile.name || '').trim();
  const city = (profile.city || '').trim();
  if (!name) throw new Error('Name is required');

  const existing = await findExistingGlobalIdentity(null, name, city);
  let globalId;

  if (existing) {
    globalId = existing.id;
    const { error: linkError } = await supabase
      .from('user_saved_profiles')
      .insert({ user_id: user.id, global_id: globalId })
      .select('id')
      .single();
    if (linkError && linkError.code !== '23505') throw linkError; // 23505 = already linked
  } else {
    const { data: inserted, error: insertError } = await supabase
      .from('global_identities')
      .insert({
        name,
        city,
        photo_hash: null,
        original_photo_url: profile.photoUrl || null,
        extracted_notes: (profile.notes || '').trim() || null,
        conditions: [],
      })
      .select('id')
      .single();
    if (insertError) throw insertError;
    globalId = inserted.id;
    await supabase
      .from('user_saved_profiles')
      .insert({ user_id: user.id, global_id: globalId });
  }

  if (profile.condition && (profile.condition = (profile.condition || '').trim())) {
    await addGlobalIdentityCondition(globalId, profile.condition);
  }

  return { globalId, name, city };
}

export async function deleteProfile(id) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  const { error } = await supabase
    .from('profiles')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);
  if (error) throw error;
}

export async function updateProfile(id, updates) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  const { data: prev } = await supabase
    .from('profiles')
    .select('name, conditions')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();
  if (!prev) return null;
  const prevConditions = prev.conditions || [];
  const nextConditions = updates.conditions !== undefined ? updates.conditions : prevConditions;
  const added =
    updates.conditions !== undefined
      ? updates.conditions.filter((c) => !prevConditions.includes(c))
      : [];
  const { data: updated, error } = await supabase
    .from('profiles')
    .update({
      ...(updates.name !== undefined && { name: updates.name }),
      ...(updates.city !== undefined && { city: updates.city }),
      ...(updates.photo !== undefined && { photo: updates.photo }),
      ...(updates.conditions !== undefined && { conditions: updates.conditions }),
      ...(updates.notes !== undefined && { notes: updates.notes }),
      ...(updates.instagram !== undefined && { instagram: updates.instagram }),
    })
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();
  if (error) throw error;
  const nextName = updated.name || prev.name;
  for (const condition of added) {
    await supabase.from('notifications').insert({
      user_id: user.id,
      profile_id: id,
      profile_name: nextName,
      message: `New condition reported: ${condition}`,
      read: false,
    });
  }
  return {
    id: updated.id,
    name: updated.name,
    city: updated.city || '',
    photo: updated.photo || '',
    conditions: updated.conditions || [],
    notes: updated.notes || '',
    instagram: updated.instagram || '',
  };
}

// --- Notifications ---

export async function getNotifications() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });
  if (error) throw error;
  const list = (data || []).map((row) => ({
    id: row.id,
    profileId: row.profile_id,
    profileGlobalId: row.profile_global_id ?? null,
    profileName: row.profile_name,
    message: row.message,
    read: row.read ?? false,
    createdAt: row.created_at,
  }));

  const globalIds = [...new Set(list.map((n) => n.profileGlobalId).filter(Boolean))];
  const profileIds = [...new Set(list.map((n) => n.profileId).filter(Boolean))];
  const photoByGlobal = {};
  const photoByProfile = {};
  const conditionCountByGlobal = {};
  const conditionCountByProfile = {};

  if (globalIds.length > 0) {
    const { data: identities } = await supabase
      .from('global_identities')
      .select('id, original_photo_url, conditions')
      .in('id', globalIds);
    (identities || []).forEach((i) => {
      photoByGlobal[i.id] = i.original_photo_url || null;
      conditionCountByGlobal[i.id] = (i.conditions || []).length;
    });
  }
  if (profileIds.length > 0) {
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, photo, conditions')
      .in('id', profileIds)
      .eq('user_id', user.id);
    (profiles || []).forEach((p) => {
      photoByProfile[p.id] = p.photo || null;
      conditionCountByProfile[p.id] = (p.conditions || []).length;
    });
  }

  return list.map((n) => {
    const conditionCount = (n.profileGlobalId && conditionCountByGlobal[n.profileGlobalId]) ?? (n.profileId && conditionCountByProfile[n.profileId]) ?? 0;
    return {
      ...n,
      photo: (n.profileGlobalId && photoByGlobal[n.profileGlobalId]) || (n.profileId && photoByProfile[n.profileId]) || null,
      isBiohazard: conditionCount > 1,
    };
  });
}

export async function addNotification(notification) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from('notifications').insert({
    user_id: user.id,
    profile_id: notification.profileId || null,
    profile_name: notification.profileName || '',
    message: notification.message || '',
    read: notification.read ?? false,
  });
}

export async function markNotificationRead(id) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', id)
    .eq('user_id', user.id);
}

export async function deleteNotification(id) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  const { error } = await supabase
    .from('notifications')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);
  if (error) throw error;
}
