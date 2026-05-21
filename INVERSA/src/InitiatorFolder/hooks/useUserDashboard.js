import { useState, useEffect } from "react";

import { apiClient }
  from "../../api/client";

const useUserDashboard = (
  user
) => {

  /*
  =========================
  STATES
  =========================
  */

  const [
    myProjects,
    setMyProjects,
  ] = useState([]);

  const [
    teamProjects,
    setTeamProjects,
  ] = useState([]);

  const [
    myTeams,
    setMyTeams,
  ] = useState([]);

  const [
    teamRequests,
    setTeamRequests,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  /*
  =========================
  INITIAL LOAD
  =========================
  */

  useEffect(() => {

    if (user?.id) {
      loadData();
    }

  }, [user?.id]);

  /*
  =========================
  LOAD DATA
  =========================
  */

  const loadData = async () => {

    setLoading(true);

    try {

      /*
      =========================
      LOAD PROJECTS
      =========================
      */

      const projectsResponse =
        await apiClient.projects.getAll();

      const allProjects =
        projectsResponse.data || [];

      /*
      =========================
      MY PROJECTS
      =========================
      */

      const myProj =
        allProjects.filter((project) => 
          Number(project.initiator_id) ===
          Number(user?.id) && !project.team_id
        );

      setMyProjects(myProj);

      /*
      =========================
      TEMPORARY DISABLE TEAM SYSTEM
      =========================
      */

      /*
=========================
LOAD TEAMS
=========================
*/

      const teamsResponse =
        await apiClient
          .teams
          .getUserTeams(
            user.id
          );

      const teams =
        teamsResponse.data || [];

      setMyTeams(
        teams
      );

      /*
      =========================
      LOAD TEAM PROJECTS
      =========================
      */

      let allTeamProjects = [];

      for (
        const team of teams
      ) {

        const projectsResponse =
          await apiClient
            .teams
            .getProjects(
              team.id
            );

        const projects =
          projectsResponse.data || [];

        allTeamProjects.push(
          ...projects
        );
      }

      setTeamProjects(
        allTeamProjects
      );

    } catch (error) {

      console.error(
        "Error loading dashboard data:",
        error
      );

    } finally {

      setLoading(false);
    }
  };

  /*
  =========================
  CREATE PROJECT
  =========================
  */

  const createProject =
    async (data) => {

      try {

        const response =
          await apiClient.projects.create({

            title:
              data.title,

            description:
              data.description,

            category_id:
              data.category_id ||
              data.category,

            genre_id:
              data.genre_id ||
              data.genre,

            background_image:
              data.backgroundImage,

            initiator_id:
              user.id,

            is_team_project:
              false,
          });

        if (response.success) {

          await loadData();
        }

      } catch (error) {

        console.error(
          "Error creating project:",
          error
        );

        throw error;
      }
    };

  /*
  =========================
  REMOVE PROJECT
  =========================
  */

  const removeProject =
    async (id) => {

      try {

        const response =
          await apiClient.projects.delete(id);

        if (response.success) {

          await loadData();
        }

      } catch (error) {

        console.error(
          "Error removing project:",
          error
        );

        throw error;
      }
    };

  /*
  =========================
  TEAM REQUESTS
  TEMPORARILY DISABLED
  =========================
  */

  const approveTeamRequest =
    async () => {

      console.warn(
        "Team system temporarily disabled"
      );
    };

  const rejectTeamRequest =
    async () => {

      console.warn(
        "Team system temporarily disabled"
      );
    };

  /*
  =========================
  RETURN
  =========================
  */

  return {

    myProjects,

    teamProjects,

    myTeams,

    teamRequests,

    loading,

    createProject,

    removeProject,

    approveTeamRequest,

    rejectTeamRequest,
  };
};

export default useUserDashboard;