'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';

export default function TeamPage() {
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTeamName, setNewTeamName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('editor');
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [members, setMembers] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const loadTeams = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data } = await supabase
          .from('teams')
          .select('*')
          .eq('owner_id', user.id);

        setTeams(data || []);
      }
      setLoading(false);
    };

    loadTeams();
  }, [supabase]);

  useEffect(() => {
    if (!selectedTeam) return;

    const loadMembers = async () => {
      const { data } = await supabase
        .from('team_members')
        .select('*')
        .eq('team_id', selectedTeam);

      setMembers(data || []);
    };

    loadMembers();
  }, [selectedTeam, supabase]);

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from('teams')
      .insert({ owner_id: user.id, name: newTeamName })
      .select()
      .single();

    if (data) {
      setTeams([...teams, data]);
      setNewTeamName('');
    }
  };

  const handleInviteMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeam) return;

    const token = Math.random().toString(36).substring(7);
    const { error } = await supabase.from('team_invites').insert({
      team_id: selectedTeam,
      invited_email: inviteEmail,
      role: inviteRole,
      token,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    if (!error) {
      setInviteEmail('');
      alert('Invite sent to ' + inviteEmail);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Team Management</h1>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Create New Team</h2>
        <form onSubmit={handleCreateTeam} className="space-y-4">
          <input
            type="text"
            placeholder="Team name"
            value={newTeamName}
            onChange={(e) => setNewTeamName(e.target.value)}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Create Team
          </button>
        </form>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Your Teams</h2>
        {teams.length === 0 ? (
          <p className="text-gray-500">No teams yet. Create one above!</p>
        ) : (
          teams.map((team) => (
            <div key={team.id} className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold">{team.name}</h3>
              <p className="text-gray-600 text-sm">Plan: {team.billing_plan}</p>
              <button
                onClick={() => setSelectedTeam(team.id)}
                className="mt-4 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                Manage
              </button>
            </div>
          ))
        )}
      </div>

      {selectedTeam && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Team Members</h2>
            <div className="space-y-2">
              {members.length === 0 ? (
                <p className="text-gray-500">No members yet</p>
              ) : (
                members.map((member) => (
                  <div key={member.id} className="flex justify-between items-center border-b pb-2">
                    <span>{member.role}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Invite Member</h2>
            <form onSubmit={handleInviteMember} className="space-y-4">
              <input
                type="email"
                placeholder="Member email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value)}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="editor">Editor</option>
                <option value="viewer">Viewer</option>
              </select>
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
              >
                Send Invite
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
