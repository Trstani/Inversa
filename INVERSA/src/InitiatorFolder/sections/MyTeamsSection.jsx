import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FiUsers, FiPlus } from 'react-icons/fi';
import TeamCard from '../../components/TeamCard';
import { apiClient } from '../../api/client';

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
      const response = await apiClient.teams.getUserTeams(user?.id);
      setTeams(response.data || []);
    } catch (error) {
      console.error('Error loading teams:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTeam = async (teamId) => {
    if (window.confirm('Are you sure you want to delete this team?')) {
      try {
        await apiClient.teams.delete(teamId);
        await loadMyTeams();
      } catch (error) {
        console.error('Error deleting team:', error);
        alert('Failed to delete team');
      }
    }
  };

  if (loading) {
    return (
      <div className="py-12 sm:py-16 md:py-20 text-center">
        <p className="text-light-secondary dark:text-dark-secondary">
          Loading teams...
        </p>
      </div>
    );
  }

  if (teams.length === 0) {
    return (
      <div className="py-12 sm:py-16 md:py-20 text-center">
        <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-light-accent/10 dark:bg-dark-accent/10 mx-auto mb-4">
          <FiUsers className="w-8 h-8 sm:w-10 sm:h-10 text-light-secondary dark:text-dark-secondary opacity-60" />
        </div>
        <p className="text-light-primary dark:text-dark-primary font-medium text-base sm:text-lg">
          You're not part of any teams yet
        </p>
        <p className="text-sm sm:text-base text-light-secondary dark:text-dark-secondary mt-2">
          Create a new team or join an existing one to collaborate
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
      {teams.map(team => (
        <TeamCard
          key={team.id}
          team={team}
          onDelete={handleDeleteTeam}
          isOwner={team.initiator_id === user?.id}
        />
      ))}
    </div>
  );
};

export default MyTeamsSection;
