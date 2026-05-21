import React, {
  useEffect,
  useState,
} from 'react';

import {
  FiUsers,
  FiArrowRight,
} from 'react-icons/fi';

import {
  apiClient,
} from '../api/client';

import TeamCard
  from '../components/TeamCard';

import { useNavigate } from 'react-router-dom';

const TeamsExplorer = () => {
  const navigate = useNavigate();

  /*
  =========================
  STATES
  =========================
  */

  const [teams, setTeams] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  /*
  =========================
  LOAD TEAMS
  =========================
  */

  useEffect(() => {

    loadTeams();

  }, []);

  const loadTeams =
    async () => {

      setLoading(true);

      try {

        const response =
          await apiClient.teams.getAll();

        setTeams(
          response.data || []
        );

      } catch (error) {

        console.error(
          'Error loading teams:',
          error
        );

      } finally {

        setLoading(false);
      }
    };

  /*
  =========================
  LOADING
  =========================
  */

  if (loading) {

    return (

      <div className="py-16 sm:py-20 md:py-24 text-center">

        <p
          className="
            text-light-secondary
            dark:text-dark-secondary
          "
        >
          Loading teams...
        </p>

      </div>
    );
  }

  /*
  =========================
  EMPTY
  =========================
  */

  if (teams.length === 0) {

    return (

      <div className="py-16 sm:py-20 md:py-24 text-center">

        <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-light-accent/10 dark:bg-dark-accent/10 mx-auto mb-4">
          <FiUsers
            className="
              w-8 h-8 sm:w-10 sm:h-10
              text-light-secondary
              dark:text-dark-secondary
              opacity-60
            "
          />
        </div>

        <p
          className="
            text-light-primary
            dark:text-dark-primary
            font-medium text-base sm:text-lg
          "
        >
          No public teams yet.
        </p>

        <p
          className="
            mt-2 text-sm sm:text-base
            text-light-secondary
            dark:text-dark-secondary
          "
        >
          Check back soon for new creative teams
        </p>

      </div>
    );
  }

  /*
  =========================
  RENDER
  =========================
  */

  return (

    <div className="space-y-8 sm:space-y-10 md:space-y-12">

      {/* HEADER */}

      <div>

        <div
          className="
            inline-flex items-center gap-2

            rounded-full

            bg-light-accent/10
            dark:bg-dark-accent/10

            px-4 py-2

            text-sm font-medium

            text-light-accent
            dark:text-dark-accent

            mb-5
          "
        >

          <FiUsers className="w-4 h-4" />

          Creative Ecosystems

        </div>

        <h2
          className="
            text-2xl sm:text-3xl font-bold

            text-light-primary
            dark:text-dark-primary
          "
        >
          Explore Teams
        </h2>

        <p
          className="
            mt-3

            max-w-2xl

            text-sm sm:text-base
            text-light-secondary
            dark:text-dark-secondary
          "
        >
          Discover collaborative universes,
          writing studios, and creative teams.
        </p>

      </div>

      {/* GRID */}

      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          lg:grid-cols-3

          gap-4 sm:gap-5 md:gap-6
        "
      >

        {teams.map(
          (team) => (

            <TeamCard
              key={team.id}
              team={team}
            />

          )
        )}

      </div>

    </div>
  );
};

export default TeamsExplorer;