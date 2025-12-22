import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, ArrowLeft, Copy, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getTeam, updateTeam, getPlayersByTeam } from '../services/firestore';
import { Team } from '../types/firebase';

export const TeamManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const { userData } = useAuth();
  const [team, setTeam] = useState<Team | null>(null);
  const [teamName, setTeamName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [studentCount, setStudentCount] = useState(0);

  useEffect(() => {
    if (userData?.teamId && userData?.role === 'coach') {
      loadTeam();
    } else {
      setLoading(false);
    }
  }, [userData]);

  const loadTeam = async () => {
    if (!userData?.teamId) return;
    
    try {
      setLoading(true);
      const teamData = await getTeam(userData.teamId);
      if (teamData) {
        setTeam(teamData);
        setTeamName(teamData.name);
      }
      
      // Load student count
      const players = await getPlayersByTeam(userData.teamId);
      setStudentCount(players.length);
    } catch (error) {
      console.error('Error loading team:', error);
      alert('Failed to load team information');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!userData?.teamId || !teamName.trim()) {
      alert('Team name cannot be empty');
      return;
    }

    try {
      setSaving(true);
      await updateTeam(userData.teamId, { name: teamName.trim() });
      await loadTeam();
      alert('Team name updated successfully!');
    } catch (error) {
      console.error('Error saving team:', error);
      alert('Failed to save team name');
    } finally {
      setSaving(false);
    }
  };

  const handleCopyTeamId = () => {
    if (userData?.teamId) {
      navigator.clipboard.writeText(userData.teamId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div 
        className="min-h-screen w-full relative bg-cover bg-center bg-no-repeat flex items-center justify-center"
        style={{
          backgroundImage: 'url(/Environments/Coach%20Panel.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="text-white text-2xl">Loading team information...</div>
      </div>
    );
  }

  if (!userData?.teamId || userData?.role !== 'coach') {
    return (
      <div 
        className="min-h-screen w-full relative bg-cover bg-center bg-no-repeat flex items-center justify-center"
        style={{
          backgroundImage: 'url(/Environments/Coach%20Panel.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="bg-red-500 text-white p-6 rounded-xl">
          You must be a coach with a team to access this page.
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen w-full relative bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: 'url(/Environments/Coach%20Panel.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay interactive elements on top of background */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4 overflow-auto">
        {/* Back button */}
        <button
          onClick={() => navigate('/coach-dashboard')}
          className="absolute top-4 left-4 p-2 bg-yellow-500 hover:bg-orange-500 rounded-full transition-colors z-20 shadow-lg"
        >
          <ArrowLeft className="w-6 h-6 text-black" />
        </button>

        <div className="bg-purple-900 border-4 border-cyan-400 rounded-3xl p-12 max-w-2xl w-full">
          <div className="flex items-center mb-8 border-b border-cyan-400/30 pb-6">
            <Users className="text-cyan-400 mr-4" size={48} />
            <h1 className="text-4xl font-black text-white">TEAM MANAGEMENT</h1>
          </div>

          {/* Team ID Section */}
          <div className="bg-purple-950 rounded-xl p-6 mb-6 border-2 border-cyan-400/30">
            <label className="block text-cyan-400 text-sm font-bold uppercase mb-2">
              Team ID (Share this with students)
            </label>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-purple-900 text-white p-4 rounded-lg border-2 border-cyan-400/30 font-mono text-2xl font-black text-center">
                {userData.teamId}
              </div>
              <button
                onClick={handleCopyTeamId}
                className="bg-cyan-500 hover:bg-cyan-400 text-white p-4 rounded-lg transition-colors flex items-center gap-2"
                title="Copy Team ID"
              >
                {copied ? (
                  <>
                    <Check className="w-5 h-5" />
                    <span className="font-bold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5" />
                    <span className="font-bold">Copy</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-white/70 text-sm mt-3 italic">
              Students will need this Team ID to join your team. They will see your Team Name after entering this ID.
            </p>
          </div>

          {/* Team Name Section */}
          <div className="bg-purple-950 rounded-xl p-6 mb-6 border-2 border-cyan-400/30">
            <label className="block text-cyan-400 text-sm font-bold uppercase mb-2">
              Team Name
            </label>
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="Enter team name"
              className="w-full bg-purple-900 text-white p-4 rounded-lg border-2 border-cyan-400/30 text-xl font-bold"
              maxLength={50}
            />
            <p className="text-white/70 text-sm mt-3">
              This name will be displayed to students after they enter your Team ID.
            </p>
          </div>

          {/* Team Stats */}
          <div className="bg-purple-950 rounded-xl p-6 mb-6 border-2 border-cyan-400/30">
            <h3 className="text-cyan-400 font-bold uppercase mb-4">Team Statistics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-purple-900 rounded-lg p-4 text-center">
                <div className="text-white/70 text-sm uppercase mb-1">Total Students</div>
                <div className="text-3xl font-black text-cyan-400">{studentCount}</div>
              </div>
              <div className="bg-purple-900 rounded-lg p-4 text-center">
                <div className="text-white/70 text-sm uppercase mb-1">Team Status</div>
                <div className="text-3xl font-black text-green-400">Active</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6 border-t border-cyan-400/30">
            <button
              onClick={() => navigate('/coach-dashboard')}
              className="flex-1 bg-purple-950 text-white/70 hover:text-white font-bold py-3 rounded-xl border-2 border-white/20"
            >
              CANCEL
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !teamName.trim()}
              className="flex-1 bg-yellow-500 hover:bg-orange-500 text-black font-black py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'SAVING...' : 'SAVE CHANGES'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

