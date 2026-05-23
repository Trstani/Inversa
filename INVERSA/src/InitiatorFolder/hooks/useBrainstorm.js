import {
  useState,
  useEffect,
} from 'react';

import {
  apiClient,
} from '../../api/client';

const useBrainstorm = (
  projectId
) => {

  /*
  =========================
  STATES
  =========================
  */

  const [
    session,
    setSession,
  ] = useState(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  /*
  =========================
  LOAD SESSION
  =========================
  */

  useEffect(() => {

    if (!projectId) {
      return;
    }

    loadSession();

  }, [projectId]);

  const loadSession =
    async () => {

      try {

        setLoading(true);

        const [
          sessionResponse,
          ideasResponse,
          tasksResponse,
          discussionsResponse,
          notesResponse,
        ] = await Promise.all([

          apiClient
            .brainstorm
            .getSession(
              projectId
            ),

          apiClient
            .brainstorm
            .getIdeas(
              projectId
            ),

          apiClient
            .brainstorm
            .getTasks(
              projectId
            ),

          apiClient
            .brainstorm
            .getDiscussions(
              projectId
            ),

          apiClient
            .brainstorm
            .getNotes(
              projectId
            ),
        ]);

        setSession({

          ...sessionResponse.data,

          ideas:
            ideasResponse.data || [],

          tasks:
            tasksResponse.data || [],

          discussions:
            discussionsResponse.data || [],

          notes:
            notesResponse.data || [],
        });

      } catch (error) {

        console.error(
          'Error loading brainstorm:',
          error
        );

      } finally {

        setLoading(false);
      }
    };

  /*
=========================
RELOAD SESSION
=========================
*/

  const reloadSession =
    async () => {

      await loadSession();

    };

  /*
  =========================
  IDEAS
  =========================
  */

  const addNewIdea =
    async (
      userId,
      userName,
      content,
      chapterReference = null
    ) => {

      try {

        const response =
          await apiClient
            .brainstorm
            .addIdea(
              projectId,
              {
                user_id:
                  userId,

                user_name:
                  userName,

                title:
                  content,

                chapter_id:
                  chapterReference,
              }
            );

        setSession(prev => ({

          ...prev,

          ideas: [
            response.data,
            ...(prev?.ideas || []),
          ],

        }));

        return response.data;

      } catch (error) {

        console.error(
          'Error adding idea:',
          error
        );

        throw error;
      }
    };

  const removeIdea =
    async (ideaId) => {

      try {

        await apiClient
          .brainstorm
          .deleteIdea(
            projectId,
            ideaId
          );

        setSession(prev => ({

          ...prev,

          ideas:
            prev.ideas.filter(
              idea =>
                idea.id !== ideaId
            ),

        }));

      } catch (error) {

        console.error(
          'Error deleting idea:',
          error
        );

        throw error;
      }
    };

  const vote =
  async (ideaId) => {

    try {

      setSession(prev => ({

        ...prev,

        ideas:
          prev.ideas.map(idea =>

            idea.id === ideaId

              ? {
                  ...idea,

                  has_voted:
                    !idea.has_voted,

                  votes:
                    idea.has_voted
                      ? Math.max(
                          0,
                          idea.votes - 1
                        )
                      : idea.votes + 1,
                }

              : idea
          ),

      }));

      await apiClient
        .brainstorm
        .voteIdea(
          projectId,
          ideaId
        );

    } catch (error) {

      console.error(
        'Error voting:',
        error
      );

      throw error;
    }
  };
  /*
  =========================
  TASKS
  =========================
  */

  const createTask =
    async (taskData) => {

      try {

        const response =
          await apiClient
            .brainstorm
            .addTask(
              projectId,
              {
                title:
                  taskData.title,

                description:
                  taskData.description,

                assigned_to:
                  taskData.assigned_to,

                chapter_id:
                  taskData.chapter_id,

                section_id:
                  taskData.section_id,

                status:
                  taskData.status ||
                  'pending',
              }
            );

        setSession(prev => ({

          ...prev,

          tasks: [
            response.data,
            ...(prev?.tasks || []),
          ],

        }));

        return response.data;

      } catch (error) {

        console.error(
          'Error creating task:',
          error
        );

        throw error;
      }
    };

  const updateTaskStatus =
    async (
      taskId,
      updates
    ) => {

      try {

        const response =
          await apiClient
            .brainstorm
            .updateTask(
              projectId,
              taskId,
              {
                status:
                  updates.status,
              }
            );

        setSession(prev => ({

          ...prev,

          tasks:
            prev.tasks.map(task =>

              task.id === taskId
                ? response.data
                : task
            ),

        }));

        return response.data;

      } catch (error) {

        console.error(
          'Error updating task:',
          error
        );

        throw error;
      }
    };

  const removeTask =
    async (taskId) => {

      try {

        await apiClient
          .brainstorm
          .deleteTask(
            projectId,
            taskId
          );

        setSession(prev => ({

          ...prev,

          tasks:
            prev.tasks.filter(
              task =>
                task.id !== taskId
            ),

        }));

      } catch (error) {

        console.error(
          'Error deleting task:',
          error
        );

        throw error;
      }
    };

  /*
  =========================
  DISCUSSIONS
  =========================
  */

  const addDiscussion =
    async (message) => {

      try {

        const response =
          await apiClient
            .brainstorm
            .addDiscussion(
              projectId,
              { message }
            );

        setSession(prev => ({

          ...prev,

          discussions: [
            response.data,
            ...(prev?.discussions || []),
          ],

        }));

        return response.data;

      } catch (error) {

        console.error(
          'Error adding discussion:',
          error
        );

        throw error;
      }
    };

  /*
  =========================
  NOTES
  =========================
  */

  const addNote =
    async (content) => {

      try {

        const response =
          await apiClient
            .brainstorm
            .addNote(
              projectId,
              { content }
            );

        setSession(prev => ({

          ...prev,

          notes: [
            response.data,
            ...(prev?.notes || []),
          ],

        }));

        return response.data;

      } catch (error) {

        console.error(
          'Error adding note:',
          error
        );

        throw error;
      }
    };

  /*
  =========================
  RETURN
  =========================
  */

  return {

    session,

    loading,

    loadSession,
    reloadSession,

    addNewIdea,
    removeIdea,
    vote,

    createTask,
    updateTaskStatus,
    removeTask,

    addDiscussion,
    addNote,
  };
};

export default useBrainstorm;