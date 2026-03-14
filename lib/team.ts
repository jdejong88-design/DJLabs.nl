import { createClient } from '@/lib/supabase';

export async function getUserTeams(userId: string) {
  const supabase = createClient();

  const { data } = await supabase
    .from('teams')
    .select('*')
    .eq('owner_id', userId);

  return data || [];
}

export async function createTeam(ownerId: string, name: string) {
  const supabase = createClient();

  const { data } = await supabase
    .from('teams')
    .insert({ owner_id: ownerId, name })
    .select()
    .single();

  return data;
}

export async function inviteTeamMember(
  teamId: string,
  email: string,
  role: string
) {
  const supabase = createClient();
  const token = Math.random().toString(36).substring(7);

  const { data } = await supabase
    .from('team_invites')
    .insert({
      team_id: teamId,
      invited_email: email,
      role,
      token,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    })
    .select()
    .single();

  return data;
}

export async function getTeamMembers(teamId: string) {
  const supabase = createClient();

  const { data } = await supabase
    .from('team_members')
    .select('*')
    .eq('team_id', teamId);

  return data || [];
}
