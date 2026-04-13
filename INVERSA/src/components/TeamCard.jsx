import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUsers, FiFolder, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { getTeamProjects } from '../utils/dataManager/teamManager';

const TeamCard = ({ team, onDelete, isOwner = false }) => {
  const navigate = useNavigate();
  const [projectCount, setProjectCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjectCount();
  }, [team.id]);

  const loadProjectCount = async () => {
    try {
      const projects = await getTeamProjects(team.id);
      setProjectCount(projects.length);
    } catch (error) {
      console.error('Error loading project count:', error);
    } finally {
      setLoading(false);
    }
  };

  const memberCount = team.collaborators?.length || 0;

  return (
    <div className="card p-4 hover:shadow-lg transition-shadow">
      {/* Team Image */}
      {team.backgroundImage && (
        <div
          className="w-full h-32 rounded-lg mb-3 bg-cover bg-center"
          style={{ backgroundImage: `url(${team.backgroundImage})` }}
        />
      )}

      {/* Team Info */}
      <h3 className="font-semibold text-light-primary dark:text-dark-primary mb-1 truncate">
        {team.title}
      </h3>

      <p className="text-sm text-light-secondary dark:text-dark-secondary mb-4 line-clamp-2">
        {team.description}
      </p>

      {/* Stats */}
      <div className="flex gap-4 text-xs text-light-secondary dark:text-dark-secondary mb-4">
        <div className="flex items-center gap-1">
          <FiUsers className="w-4 h-4" />
          <span>{memberCount} members</span>
        </div>
        <div className="flex items-center gap-1">
          <FiFolder className="w-4 h-4" />
          <span>{loading ? '-' : projectCount} projects</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={() => navigate(`/team/${team.id}`)}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-light-accent/10 dark:bg-dark-accent/10 text-light-accent dark:text-dark-accent rounded hover:bg-light-accent/20 dark:hover:bg-dark-accent/20 transition text-sm font-medium"
        >
          <FiEdit2 className="w-4 h-4" />
          View Team
        </button>

        {isOwner && (
          <button
            onClick={() => onDelete?.(team.id)}
            className="px-3 py-2 bg-red-500/10 text-red-500 rounded hover:bg-red-500/20 transition"
          >
            <FiTrash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default TeamCard;
