import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FiUsers } from 'react-icons/fi';
import TeamCard from '../../components/TeamCard';
import { loadTeams, deleteTeam } from '../../utils/dataManager/teamManager';

const MyTeamsSection = ({ projects }) => {
  const { user } = useAuth();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMyTeams();
  }, [user?.id]);

  const loadMyTeams = async () => {
    setLoading(true);
    try {
      const allTeams = await loadTeams(user?.id);
      setTeams(allTeams);
    } catch (error) {
      console.error('Error loading teams:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTeam = async (teamId) => {
    if (window.confirm('Are you sure you want to delete this team?')) {
      try {
        await deleteTeam(teamId);
        await loadMyTeams();
      } catch (error) {
        console.error('Error deleting team:', error);
        alert('Failed to delete team');
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-light-secondary dark:text-dark-secondary">
          Loading teams...
        </p>
      </div>
    );
  }

  if (teams.length === 0) {
    return (
      <div className="text-center py-12">
        <FiUsers className="w-12 h-12 mx-auto text-light-secondary dark:text-dark-secondary mb-3 opacity-50" />
        <p className="text-light-secondary dark:text-dark-secondary">
          You're not part of any teams yet
        </p>
        <p className="text-sm text-light-secondary dark:text-dark-secondary mt-2">
          Create a new team or join an existing one
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {teams.map(team => (
        <TeamCard
          key={team.id}
          team={team}
          onDelete={handleDeleteTeam}
          isOwner={team.initiatorId === user?.id}
        />
      ))}
    </div>
  );
};

export default MyTeamsSection;
