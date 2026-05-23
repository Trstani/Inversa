import { useState, useEffect } from 'react';

import { FiZap, FiCheck } from 'react-icons/fi';
import {
  joinBrainstormRoom,
  leaveBrainstormRoom,
  emitIdeaAdded,
  onIdeaAdded,
  offIdeaAdded,
  emitIdeaDeleted,
  onIdeaDeleted,
  offIdeaDeleted,
  emitIdeaVoted,
  onIdeaVoted,
  offIdeaVoted,
  emitDiscussionAdded,
  onDiscussionAdded,
  offDiscussionAdded,
  emitDiscussionDeleted,
  onDiscussionDeleted,
  offDiscussionDeleted,
  emitNoteAdded,
  onNoteAdded,
  offNoteAdded,
  emitNoteDeleted,
  onNoteDeleted,
  offNoteDeleted,
  emitTaskAdded,
  onTaskAdded,
  offTaskAdded,
  emitTaskUpdated,
  onTaskUpdated,
  offTaskUpdated,
  emitTaskDeleted,
  onTaskDeleted,
  offTaskDeleted,
} from '../../socket/socket';

import DiscussionPanel from './components/DiscussionPanel';
import NotesPanel from './components/NotesPanel';
import ContributionPanel from './components/ContributionPanel';
import StoryIdeaSection from './components/StoryIdeaSection';
import TaskManagerSection from './components/TaskManagerSection';

import useBrainstorm from '../../InitiatorFolder/hooks/useBrainstorm';

import { apiClient } from '../../api/client';

const BrainstormGridLayout = ({
  projectId,
  onUpdate,
  user,
}) => {

  /*
  =========================
  STATES
  =========================
  */

  const [activeView, setActiveView] = useState('brainstorm');

  const [chapters, setChapters] = useState([]);
  const [sections, setSections] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [project, setProject] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [filterChapter, setFilterChapter] = useState(null);

  const [newIdeaInput, setNewIdeaInput] = useState('');
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    chapterReference: null,
    sectionReference: null,
    assignedTo: null,
    dueDate:'',
  });

  /*
  =========================
  HOOK
  =========================
  */

  const {
    session,
    setSession,
    loading,

    addNewIdea,
    removeIdea,
    vote,

    createTask,
    updateTaskStatus,
    removeTask,


  } = useBrainstorm(projectId);

  /*
  =========================
  LOAD DATA
  =========================
  */

  useEffect(() => {
    loadChapters();
    loadTeamMembers();
  }, [projectId]);

  useEffect(()=>{

const chapterId=
newTask.chapterReference;

if(!chapterId){

setSections([]);
return;

}

loadSections(
chapterId
);

},[
newTask.chapterReference
]);

const loadSections=
async(
chapterId
)=>{

try{

const response=
await apiClient
.sections
.getByChapter(
chapterId
);

setSections(
response.data||[]
);

}
catch(error){

console.error(error);

}

};
  /*
=========================
SOCKET.IO SETUP
=========================
*/

  useEffect(() => { 
    if(
    !projectId ||
    !user?.id
  ) return;

    joinBrainstormRoom(
      projectId,
      user?.id
    );

    const append = (
      key,
      data
    ) => {

      setSession(prev => ({

        ...prev,

        [key]: [

          data,

          ...(prev?.[key] || [])
            .filter(
              item =>
                item.id !== data.id
            )

        ]

      }));

    };

    const ideaAdded =
      ({ idea }) =>
        append(
          'ideas',
          idea
        );

    const discussionAdded =
      ({ discussion }) =>
        append(
          'discussions',
          discussion
        );

    const noteAdded =
      ({ note }) =>
        append(
          'notes',
          note
        );

    const taskAdded =
      ({ task }) =>
        append(
          'tasks',
          task
        );

    const ideaDeleted =
      ({ ideaId }) => {

        setSession(prev => ({

          ...prev,

          ideas:
            prev?.ideas?.filter(
              i =>
                i.id !==
                ideaId
            ) || []

        }));

      };

    const discussionDeleted =
      ({ discussionId }) => {

        setSession(prev => ({

          ...prev,

          discussions:
            prev?.discussions?.filter(
              d =>
                d.id !==
                discussionId
            ) || []

        }));

      };

    const noteDeleted =
      ({ noteId }) => {

        setSession(prev => ({

          ...prev,

          notes:
            prev?.notes?.filter(
              n =>
                n.id !==
                noteId
            ) || []

        }));

      };

    const taskDeleted =
      ({ taskId }) => {

        setSession(prev => ({

          ...prev,

          tasks:
            prev?.tasks?.filter(
              t =>
                t.id !==
                taskId
            ) || []

        }));

      };

    const ideaVoted =
      ({
        ideaId,
        userId,
        voted
      }) => {

        setSession(prev => ({

          ...prev,

          ideas:
            prev?.ideas?.map(

              idea => {

                if (
                  idea.id !== ideaId
                ) {
                  return idea;
                }

                const voters =
                  idea.voters || [];

                if (voted) {

                  return {

                    ...idea,

                    voters:
                      voters.includes(userId)
                        ? voters
                        : [...voters, userId],

                    votes:
                      (idea.votes || 0) +
                      (
                        voters.includes(userId)
                          ? 0
                          : 1
                      )

                  };

                }

                return {

                  ...idea,

                  voters:
                    voters.filter(
                      id => id !== userId
                    ),

                  votes:
                    Math.max(
                      (idea.votes || 0) - 1,
                      0
                    )

                };

              }

            ) || []

        }));

      };

    const taskUpdated =
      ({
        taskId,
        updates
      }) => {

        setSession(prev => ({

          ...prev,

          tasks:
            prev?.tasks?.map(

              task =>

                task.id === taskId
                  ? {
                    ...task,
                    ...updates
                  }
                  : task

            ) || []

        }));

      };

    onIdeaAdded(ideaAdded);

    onDiscussionAdded(discussionAdded);

    onNoteAdded(noteAdded);

    onTaskAdded(taskAdded);

    onIdeaDeleted(ideaDeleted);

    onDiscussionDeleted(discussionDeleted);

    onNoteDeleted(noteDeleted);

    onTaskDeleted(taskDeleted);

    onIdeaVoted(ideaVoted);

    onTaskUpdated(taskUpdated);

    return () => {

      offIdeaAdded(
        ideaAdded
      );

      offDiscussionAdded(
        discussionAdded
      );

      offNoteAdded(
        noteAdded
      );

      offTaskAdded(
        taskAdded
      );

      offIdeaDeleted(
        ideaDeleted
      );

      offDiscussionDeleted(
        discussionDeleted
      );

      offNoteDeleted(
        noteDeleted
      );

      offTaskDeleted(
        taskDeleted
      );

      offTaskUpdated(
        taskUpdated
      );

      offIdeaVoted(ideaVoted);

      leaveBrainstormRoom(
        projectId
      );

    };

  }, [
    projectId,
    user?.id
  ]);

  /*
  =========================
  CHAPTERS
  =========================
  */

  const loadChapters = async () => {

    try {

      const response =
        await apiClient.chapters.getByProject(projectId);

      setChapters(response.data || []);

    } catch (error) {

      console.error(error);
    }
  };

  /*
  =========================
  TEAM MEMBERS
  =========================
  */

  const loadTeamMembers = async () => {

    try {

      const projectResponse =
        await apiClient.projects.getById(projectId);

      const project =
        projectResponse.data;

      setProject(project);

      if (!project?.team_id) return;

      const teamResponse =
        await apiClient.teams.getById(project.team_id);

      setTeamMembers(
        teamResponse.data?.members || []
      );

    } catch (error) {

      console.error(error);
    }
  };

  /*
  =========================
  IDEA ACTIONS
  =========================
  */

  const handleAddIdea =
    async () => {

      if (!newIdeaInput.trim())
        return;

      try {

        const savedIdea =
          await addNewIdea(

            user?.id,
            user?.name,
            newIdeaInput,
            selectedChapter

          );

        emitIdeaAdded(
          projectId,
          savedIdea
        );

        setNewIdeaInput('');

        setSelectedChapter(
          null
        );

      }
      catch (error) {

        console.error(
          error
        );

      }

    };

  const handleDeleteIdea = async (ideaId) => {

    await removeIdea(ideaId);

    emitIdeaDeleted(projectId, ideaId);

  };

  const handleVoteIdea =
    async (ideaId) => {

      try {
        const result = await vote(ideaId);

        emitIdeaVoted(projectId, ideaId, user?.id, result.voted);



      } catch (error) {

        console.error(error);
      }
    };

  /*
  =========================
  TASK ACTIONS
  =========================
  */

  const handleAddTask =
    async () => {

      if (
        !newTask.title.trim()
      )
        return;

      try {

        const savedTask =
          await createTask({

            title:
              newTask.title,

            description:
              newTask.description,

            assigned_to:
              newTask.assignedTo,

            chapter_id:
              newTask.chapterReference,

            section_id:
              newTask.sectionReference,

            due_date:
              newTask.dueDate || null,

            status:
              'pending'

          });

        emitTaskAdded(
          projectId,
          savedTask
        );

        setNewTask({

          title: '',
          description: '',

          chapterReference: null,
          sectionReference: null,

          assignedTo: null,
          dueDate: ''

        });

        setSections([]);

      }
      catch (error) {

        console.error(
          error
        );

      }

    };

  const handleUpdateTask = async (taskId, updates) => {

    await updateTaskStatus(taskId, updates);

    
    emitTaskUpdated(projectId, taskId, updates);

  };

  const handleDeleteTask = async (taskId) => {

    await removeTask(taskId);

    emitTaskDeleted(projectId, taskId);

  };

  /*
  =========================
  TASK STATUS
  =========================
  */

  const normalizeStatus = (status) => {
    if (!status) return 'pending';
    return status;
  };

  const tasksByStatus = {

    pending:
      session?.tasks?.filter(
        t => normalizeStatus(t.status) === 'pending'
      ) || [],

    'in-progress':
      session?.tasks?.filter(
        t => normalizeStatus(t.status) === 'in-progress'
      ) || [],

    completed:
      session?.tasks?.filter(
        t => normalizeStatus(t.status) === 'completed'
      ) || [],
  };

  /*
  =========================
  CHAPTER TITLE
  =========================
  */

  const getChapterTitle = (chapterId) => {

    const chapter =
      chapters.find(
        c => Number(c.id) === Number(chapterId)
      );

    if (!chapter) return 'Unknown Chapter';

    return `Chapter ${chapter.chapter_number ||
      chapter.chapterNumber ||
      chapter.id
      }: ${chapter.title}`;
  };

  /*
  =========================
  LOADING
  =========================
  */

  if (loading) {

    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-light-secondary dark:text-dark-secondary">
          Loading brainstorm...
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

    <div className="min-h-screen bg-light-background dark:bg-dark-background">

      {/* TOP NAV */}

      <div className="sticky top-0 z-10 bg-light-background dark:bg-dark-background px-4 py-4">

        <div className="max-w-7xl mx-auto">

          <div className="flex gap-1 p-1 rounded-2xl bg-white/20 dark:bg-black/20 backdrop-blur-md border border-white/20">

            <button
              onClick={() => setActiveView('brainstorm')}
              className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-medium transition ${activeView === 'brainstorm'
                  ? 'bg-white/60 dark:bg-dark-surface/80 text-light-primary dark:text-dark-primary shadow-md'
                  : 'text-light-text/70 dark:text-dark-text/70 hover:bg-white/30'
                }`}
            >
              <FiZap className="w-4 h-4" />
              Vote Idea
            </button>

            <button
              onClick={() => setActiveView('tasks')}
              className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-medium transition ${activeView === 'tasks'
                  ? 'bg-white/60 dark:bg-dark-surface/80 text-light-primary dark:text-dark-primary shadow-md'
                  : 'text-light-text/70 dark:text-dark-text/70 hover:bg-white/30'
                }`}
            >
              <FiCheck className="w-4 h-4" />
              Task Manager
            </button>

          </div>

        </div>

      </div>

      {/* MAIN */}

      <div className="max-w-7xl mx-auto px-4 pb-6">

        <div className="card p-4 sm:p-6 bg-light-surface dark:bg-dark-surface mb-4">

          {activeView === 'brainstorm' ? (

            <StoryIdeaSection
              brainstorm={session}
              chapters={chapters}

              selectedChapter={selectedChapter}
              filterChapter={filterChapter}

              newIdeaInput={newIdeaInput}

              onSelectChapter={setSelectedChapter}
              onFilterChapter={setFilterChapter}
              onIdeaInputChange={setNewIdeaInput}

              onAddIdea={handleAddIdea}
              onDeleteIdea={handleDeleteIdea}

              onVote={handleVoteIdea}

              user={user}

              getChapterTitle={getChapterTitle}
            />

          ) : (

            <TaskManagerSection
              chapters={chapters}
              sections={sections}
              teamMembers={teamMembers}

              filterChapter={filterChapter}

              newTask={newTask}
              tasksByStatus={tasksByStatus}
              isInitiator={Number(user?.id) === Number(project?.initiator_id)}
              user={user}

              onFilterChapter={setFilterChapter}

              onTaskTitleChange={(value) =>
                setNewTask({
                  ...newTask,
                  title: value,
                })
              }

              onTaskDescriptionChange={(value) =>
                setNewTask({
                  ...newTask,
                  description: value,
                })
              }

              onTaskChapterChange={(value) =>
                setNewTask({
                  ...newTask,
                  chapterReference: value,
                  sectionReference: null,
                })
              }

              onTaskSectionChange={(value) =>
                setNewTask({
                  ...newTask,
                  sectionReference: value,
                })
              }

              onTaskAssignChange={(value) =>
                setNewTask({
                  ...newTask,
                  assignedTo: value,
                })
              }

                onTaskDueDateChange={(value) =>
                  setNewTask({
                    ...newTask,
                    dueDate: value,
                  })
                }

              onAddTask={handleAddTask}

              onDeleteTask={handleDeleteTask}

              onUpdateTaskStatus={handleUpdateTask}

              getChapterTitle={getChapterTitle}
            />

          )}

        </div>

        {/* BOTTOM */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">

          <DiscussionPanel
            projectId={projectId}
            brainstorm={session}
            user={user}
            onDiscussionAdded={(discussion) => emitDiscussionAdded(projectId, discussion)}
            onDiscussionDeleted={(discussionId) => emitDiscussionDeleted(projectId, discussionId)}
          />

          <NotesPanel
            projectId={projectId}
            brainstorm={session}
            user={user}
            onNoteAdded={(note) => {
              console.log('📝 Note added callback:', note);
              emitNoteAdded(projectId, note);
            }}
            onNoteDeleted={(noteId) => {
              console.log('🗑️ Note deleted callback:', noteId);
              emitNoteDeleted(projectId, noteId);
            }}
          />

          <ContributionPanel
            projectId={projectId}
            brainstorm={session}
            user={user}
          />

        </div>

      </div>

    </div>
  );
};

export default BrainstormGridLayout;