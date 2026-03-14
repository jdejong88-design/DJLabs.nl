import { createClient } from '@/lib/supabase';
import { RealtimeChannel } from '@supabase/supabase-js';

export function subscribeToProjectUpdates(
  projectId: string,
  callback: (payload: any) => void
): RealtimeChannel {
  const supabase = createClient();

  const subscription = supabase
    .channel(`project:${projectId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'saved_outputs',
        filter: `project_id=eq.${projectId}`,
      },
      (payload) => callback(payload)
    )
    .subscribe();

  return subscription;
}

export function subscribeToTeamActivity(
  teamId: string,
  callback: (payload: any) => void
): RealtimeChannel {
  const supabase = createClient();

  const subscription = supabase
    .channel(`team:${teamId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'saved_outputs',
        filter: `project_id=in.(SELECT id FROM projects WHERE team_id = '${teamId}')`,
      },
      (payload) => callback(payload)
    )
    .subscribe();

  return subscription;
}

export function subscribeToTeamMembers(
  teamId: string,
  callback: (payload: any) => void
): RealtimeChannel {
  const supabase = createClient();

  const subscription = supabase
    .channel(`members:${teamId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'team_members',
        filter: `team_id=eq.${teamId}`,
      },
      (payload) => callback(payload)
    )
    .subscribe();

  return subscription;
}
