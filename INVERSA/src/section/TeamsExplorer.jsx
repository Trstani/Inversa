import React, { useEffect, useState, useMemo } from 'react';
import { FiUsers, FiSearch } from 'react-icons/fi';
import { apiClient } from '../api/client';
import TeamCard from '../components/TeamCard';

const TeamsExplorer = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => { loadTeams(); }, []);

  const loadTeams = async () => {
    setLoading(true);
    try {
      const response = await apiClient.teams.getAll();
      setTeams(response.data || []);
    } catch (error) {
      console.error('Error loading teams:', error);
    } finally { setLoading(false); }
  };

  const filteredTeams = useMemo(() => {
    return teams.filter(team => {
      const matchesSearch =
        (team.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (team.description || '').toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [teams, searchQuery]);

  if (loading) {
    return (
      <div className="py-16 sm:py-20 md:py-24 text-center">
        <p className="text-light-secondary dark:text-dark-secondary">Loading teams...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 sm:space-y-10 md:space-y-12">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 rounded-full bg-light-accent/10 dark:bg-dark-accent/10 px-4 py-2 text-sm font-medium text-light-accent dark:text-dark-accent mb-5">
          <FiUsers className="w-4 h-4" /> Creative Ecosystems
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-light-primary dark:text-dark-primary">Explore Teams</h2>
        <p className="mt-3 max-w-2xl text-sm sm:text-base text-light-secondary dark:text-dark-secondary">
          Discover collaborative universes, writing studios, and creative teams.
        </p>
      </div>

      {/* Search */}
      <div>
        <div className="relative flex">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-light-secondary dark:text-dark-secondary pointer-events-none" />
          <input
            type="text"
            placeholder="Search team name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-2xl border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface pl-12 pr-5 py-3 text-light-primary dark:text-dark-primary placeholder-light-secondary dark:placeholder-dark-secondary outline-none focus:border-light-accent/50 dark:focus:border-dark-accent/50 focus:shadow-lg"
          />
        </div>
        <p className="mt-3 text-sm text-light-secondary dark:text-dark-secondary">
          {filteredTeams.length} {filteredTeams.length !== 1 ? 'teams' : 'team'} found
        </p>
      </div>

      {/* Grid */}
      {filteredTeams.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          {filteredTeams.map(team => <TeamCard key={team.id} team={team} />)}
        </div>
      ) : (
        <div className="rounded-2xl border-2 border-dashed border-light-border dark:border-dark-border py-20 text-center">
          <FiUsers className="w-12 h-12 mx-auto mb-4 opacity-40 text-light-secondary dark:text-dark-secondary" />
          <p className="text-light-secondary dark:text-dark-secondary">No teams found</p>
          <p className="mt-2 text-sm opacity-70 text-light-secondary dark:text-dark-secondary">Try another keyword</p>
        </div>
      )}
    </div>
  );
};

export default TeamsExplorer;