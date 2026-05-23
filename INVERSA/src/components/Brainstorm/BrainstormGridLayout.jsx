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
  });

  /*
  =========================
  HOOK
  =========================
  */

  const {
    session,
    loading,

    addNewIdea,
    removeIdea,
    vote,

    createTask,
    updateTaskStatus,
    removeTask,

    reloadSession,

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

  /*
  =========================
  SOCKET.IO SETUP
  =========================
  */

  useEffect(() => {
    // Join brainstorm room
    joinBrainstormRoom(projectId, user?.id);

    return () => {
      // Leave brainstorm room on unmount
      leaveBrainstormRoom(projectId);
    };
  }, [projectId, user?.id]);

  /*
  =========================
  REAL-TIME IDEA UPDATES
  =========================
  */

  useEffect(() => {
    const handleIdeaAdded = ({ idea }) => {
      console.log('💡 Real-time idea added:', idea);
      reloadSession();
    };

    const handleIdeaDeleted = ({ ideaId }) => {
      console.log('🗑️ Real-time idea deleted:', ideaId);
      reloadSession();
    };

    const handleIdeaVoted = ({ ideaId, userId }) => {
      console.log('👍 Real-time idea voted:', ideaId);
      reloadSession();
    };

    onIdeaAdded(handleIdeaAdded);
    onIdeaDeleted(handleIdeaDeleted);
    onIdeaVoted(handleIdeaVoted);

    return () => {
      offIdeaAdded(handleIdeaAdded);
      offIdeaDeleted(handleIdeaDeleted);
      offIdeaVoted(handleIdeaVoted);
    };
  }, [reloadSession]);

  /*
  =========================
  REAL-TIME DISCUSSION UPDATES
  =========================
  */

  useEffect(() => {
    const handleDiscussionAdded = ({ discussion }) => {
      console.log('💬 Real-time discussion added:', discussion);
      reloadSession();
    };

    const handleDiscussionDeleted = ({ discussionId }) => {
      console.log('🗑️ Real-time discussion deleted:', discussionId);
      reloadSession();
    };

    onDiscussionAdded(handleDiscussionAdded);
    onDiscussionDeleted(handleDiscussionDeleted);

    return () => {
      offDiscussionAdded(handleDiscussionAdded);
      offDiscussionDeleted(handleDiscussionDeleted);
    };
  }, [reloadSession]);

  /*
  =========================
  REAL-TIME NOTES UPDATES
  =========================
  */

  useEffect(() => {
    const handleNoteAdded = ({ note }) => {
      console.log('📝 Real-time note added:', note);
      reloadSession();
    };

    const handleNoteDeleted = ({ noteId }) => {
      console.log('🗑️ Real-time note deleted:', noteId);
      reloadSession();
    };

    onNoteAdded(handleNoteAdded);
    onNoteDeleted(handleNoteDeleted);

    return () => {
      offNoteAdded(handleNoteAdded);
      offNoteDeleted(handleNoteDeleted);
    };
  }, [reloadSession]);

  /*
  =========================
  REAL-TIME TASK UPDATES
  =========================
  */

  useEffect(() => {
    const handleTaskAdded = ({ task }) => {
      console.log('✅ Real-time task added:', task);
      reloadSession();
    };

    const handleTaskUpdated = ({ taskId, updates }) => {
      console.log('🔄 Real-time task updated:', taskId);
      reloadSession();
    };

    const handleTaskDeleted = ({ taskId }) => {
      console.log('🗑️ Real-time task deleted:', taskId);
      reloadSession();
    };

    onTaskAdded(handleTaskAdded);
    onTaskUpdated(handleTaskUpdated);
    onTaskDeleted(handleTaskDeleted);

    return () => {
      offTaskAdded(handleTaskAdded);
      offTaskUpdated(handleTaskUpdated);
      offTaskDeleted(handleTaskDeleted);
    };
  }, [reloadSession]);

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

  const handleAddIdea = async () => {

    if (!newIdeaInput.trim()) return;

    await addNewIdea(
      user?.id,
      user?.name,
      newIdeaInput,
      selectedChapter
    );

    // Emit real-time update
    const newIdea = {
      title: newIdeaInput,
      user_id: user?.id,
      user_name: user?.name,
      chapter_id: selectedChapter,
      created_at: new Date(),
    };

    emitIdeaAdded(projectId, newIdea);

    setNewIdeaInput('');
    setSelectedChapter(null);

    
  };

  const handleDeleteIdea = async (ideaId) => {

    await removeIdea(ideaId);
    
    // Emit real-time update
    emitIdeaDeleted(projectId, ideaId);
    
  };

  const handleVoteIdea =
  async (ideaId) => {

    try {

      await vote(ideaId);
      
      // Emit real-time update
      emitIdeaVoted(projectId, ideaId, user?.id);

      

    } catch (error) {

      console.error(error);
    }
  };

  /*
  =========================
  TASK ACTIONS
  =========================
  */

  const handleAddTask = async () => {

    if (!newTask.title.trim()) return;

    await createTask({
      title: newTask.title,
      description: newTask.description,

      assigned_to: newTask.assignedTo,

      chapter_id: newTask.chapterReference,

      section_id: newTask.sectionReference,

      status: 'pending',
    });

    // Emit real-time update
    const newTaskData = {
      title: newTask.title,
      description: newTask.description,
      assigned_to: newTask.assignedTo,
      chapter_id: newTask.chapterReference,
      section_id: newTask.sectionReference,
      status: 'pending',
      created_at: new Date(),
    };

    emitTaskAdded(projectId, newTaskData);

    setNewTask({
      title: '',
      description: '',
      chapterReference: null,
      sectionReference: null,
      assignedTo: null,
    });

    setSections([]);

    
  };

  const handleUpdateTask = async (taskId, updates) => {

    await updateTaskStatus(taskId, updates);
    
    // Emit real-time update
    emitTaskUpdated(projectId, taskId, updates);
    
  };

  const handleDeleteTask = async (taskId) => {

    await removeTask(taskId);
    
    // Emit real-time update
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

    return `Chapter ${
      chapter.chapter_number ||
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
              className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-medium transition ${
                activeView === 'brainstorm'
                  ? 'bg-white/60 dark:bg-dark-surface/80 text-light-primary dark:text-dark-primary shadow-md'
                  : 'text-light-text/70 dark:text-dark-text/70 hover:bg-white/30'
              }`}
            >
              <FiZap className="w-4 h-4" />
              Vote Idea
            </button>

            <button
              onClick={() => setActiveView('tasks')}
              className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-medium transition ${
                activeView === 'tasks'
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
            onUpdate={onUpdate}
            user={user}
            onDiscussionAdded={(discussion) => emitDiscussionAdded(projectId, discussion)}
            onDiscussionDeleted={(discussionId) => emitDiscussionDeleted(projectId, discussionId)}
          />

          <NotesPanel
            projectId={projectId}
            brainstorm={session}
            onUpdate={onUpdate}
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