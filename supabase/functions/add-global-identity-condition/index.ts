// Add a condition to a global identity and notify all users who have that identity saved.
// Uses service role so notifications can be inserted for any user (RLS bypass).
import "jsr:@supabase/functions-js@2/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.45.0";

const cors = { "Access-Control-Allow-Origin": "*" };

Deno.serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: cors });
  }
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers: { ...cors, "Content-Type": "application/json" } });
  }

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return new Response(JSON.stringify({ error: "Missing Authorization" }), { status: 401, headers: { ...cors, "Content-Type": "application/json" } });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

  const token = authHeader.replace("Bearer ", "");
  const { data: { user }, error: authError } = await createClient(supabaseUrl, anonKey).auth.getUser(token);
  if (authError || !user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...cors, "Content-Type": "application/json" } });
  }

  let body: { globalId?: string; condition?: string };
  try {
    body = (await req.json()) as { globalId?: string; condition?: string };
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400, headers: { ...cors, "Content-Type": "application/json" } });
  }

  const globalId = body?.globalId;
  const condition = typeof body?.condition === "string" ? body.condition.trim() : "";
  if (!globalId || !condition) {
    return new Response(JSON.stringify({ error: "Missing globalId or condition" }), { status: 400, headers: { ...cors, "Content-Type": "application/json" } });
  }

  const { data: row, error: fetchError } = await supabaseAdmin
    .from("global_identities")
    .select("id, name, conditions")
    .eq("id", globalId)
    .single();

  if (fetchError || !row) {
    return new Response(JSON.stringify({ error: "Profile not found" }), { status: 404, headers: { ...cors, "Content-Type": "application/json" } });
  }

  const prev = (row.conditions as string[]) || [];
  const next = [...prev, condition];

  const { error: updateError } = await supabaseAdmin
    .from("global_identities")
    .update({ conditions: next })
    .eq("id", globalId);

  if (updateError) {
    return new Response(JSON.stringify({ error: updateError.message }), { status: 502, headers: { ...cors, "Content-Type": "application/json" } });
  }

  const { data: links, error: linksError } = await supabaseAdmin
    .from("user_saved_profiles")
    .select("user_id")
    .eq("global_id", globalId);

  if (linksError) {
    return new Response(JSON.stringify({ error: linksError.message }), { status: 502, headers: { ...cors, "Content-Type": "application/json" } });
  }

  const userIds = [...new Set((links || []).map((r: { user_id: string }) => r.user_id))];
  const profileName = row.name || "Unknown";
  const message = `New condition reported: ${condition}`;

  for (const uid of userIds) {
    await supabaseAdmin.from("notifications").insert({
      user_id: uid,
      profile_id: null,
      profile_global_id: globalId,
      profile_name: profileName,
      message,
      read: false,
    });
  }

  return new Response(JSON.stringify({ conditions: next }), {
    headers: { ...cors, "Content-Type": "application/json" },
  });
});
