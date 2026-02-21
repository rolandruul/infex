import { supabase } from './supabase';

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
  };
}

export async function addProfile(profile) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  const conditions = profile.condition ? [profile.condition] : [];
  const { data: inserted, error: insertError } = await supabase
    .from('profiles')
    .insert({
      user_id: user.id,
      name: profile.name || '',
      city: profile.city || '',
      photo: profile.photo || '',
      conditions,
      notes: profile.notes || '',
    })
    .select()
    .single();
  if (insertError) throw insertError;
  if (profile.condition) {
    await supabase.from('notifications').insert({
      user_id: user.id,
      profile_id: inserted.id,
      profile_name: inserted.name,
      message: `New condition reported: ${profile.condition}`,
      read: false,
    });
  }
  return {
    id: inserted.id,
    name: inserted.name,
    city: inserted.city || '',
    photo: inserted.photo || '',
    conditions: inserted.conditions || [],
    notes: inserted.notes || '',
  };
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
  return (data || []).map((row) => ({
    id: row.id,
    profileId: row.profile_id,
    profileName: row.profile_name,
    message: row.message,
    read: row.read ?? false,
  }));
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
