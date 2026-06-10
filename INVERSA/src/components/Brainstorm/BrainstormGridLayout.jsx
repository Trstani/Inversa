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
import BrainstormTutorialIdea from "../tutorial/BrainstormTutorialIdea";  
import BrainstormTutorialTask from "../tutorial/BrainstormTutorialTask";


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
  const [
    activeView,
    setActiveView
  ] = useState(() => {

    return (
      localStorage.getItem(
        `brainstorm_view_${projectId}`
      ) || 'brainstorm'
    );

  });

  const [showBrainstormIdeaTutorial, setshowBrainstormIdeaTutorial] = useState(false);
  const [showBrainstormTaskTutorial, setshowBrainstormTaskTutorial] = useState(false);
  const [brainstormideaTutorialStep, setbrainstormideaTutorialStep] = useState(0);
  const [brainstormtaskTutorialStep, setbrainstormtaskTutorialStep] = useState(0);

   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Fungsi async untuk membuka menu dan menunggu animasi selesai
  const handleOpenMobileMenu = () => {
    return new Promise((resolve) => {
      setMobileMenuOpen(true);
      // Sesuaikan timeout dengan durasi animasi buka menu (misal 350ms)
      setTimeout(resolve, 350);
    });
  };
  
  // Fungsi untuk menutup menu
  const handleCloseMobileMenu = () => {
    setMobileMenuOpen(false);
  };
   

  // BrainstormIdea TUTORIAL
  useEffect(() => {
    if (
      activeView !== 'brainstorm'
    ) {
      return;
    }
    const done = localStorage.getItem('inversa_brainstormidea_tutorial');
    if (!done) setshowBrainstormIdeaTutorial(true);
  }, [activeView]);

  const handleBrainstormIdeaTutorialNext = () => {
    if (brainstormideaTutorialStep >= 3) {
      localStorage.setItem('inversa_brainstormidea_tutorial', 'done');
      setshowBrainstormIdeaTutorial(false);
      return;
    }
    setbrainstormideaTutorialStep(prev => prev + 1);
  };

  const handleBrainstormIdeaTutorialSkip = () => {
    localStorage.setItem('inversa_brainstormidea_tutorial', 'done');
    setshowBrainstormIdeaTutorial(false);
  };

  const handleBrainstormIdeaTutorialPrevious = () => {
    if (brainstormideaTutorialStep > 0) setbrainstormideaTutorialStep(prev => prev - 1);
  };


  useEffect(() => {
    if (activeView !== 'tasks') {return;}
    const done = localStorage.getItem('inversa_brainstormtask_tutorial');
    if (!done) setshowBrainstormTaskTutorial(true);
  }, [activeView]);

  const handleBrainstormTaskTutorialNext = () => {
    if (brainstormtaskTutorialStep >= 3) {
      localStorage.setItem('inversa_brainstormtask_tutorial', 'done');
      setshowBrainstormTaskTutorial(false);
      return;
    }
    setbrainstormtaskTutorialStep(prev => prev + 1);
  };

  const handleBrainstormTaskTutorialSkip = () => {
    localStorage.setItem('inversa_brainstormtask_tutorial', 'done');
    setshowBrainstormTaskTutorial(false);
  };

  const handleBrainstormTaskTutorialPrevious = () => {
    if (brainstormtaskTutorialStep > 0) setbrainstormtaskTutorialStep(prev => prev - 1);
  };

  const [chapters, setChapters] = useState([]);
  const [sections, setSections] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [project, setProject] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [filterChapter, setFilterChapter] = useState(null);

  const [newIdeaInput, setNewIdeaInput] = useState({

    title: '',
    description: ''

  });
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    chapterReference: null,
    sectionReference: null,
    assignedTo: null,
    dueDate: '',
  });

  useEffect(() => {

    if (!projectId) {
      return;
    }

    localStorage.setItem(
      `brainstorm_view_${projectId}`,
      activeView
    );

  }, [
    activeView,
    projectId
  ]);

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

  useEffect(() => {

    const chapterId =
      newTask.chapterReference;

    if (!chapterId) {

      setSections([]);
      return;

    }

    loadSections(
      chapterId
    );

  }, [
    newTask.chapterReference
  ]);

  const loadSections =
    async (
      chapterId
    ) => {

      try {

        const response =
          await apiClient
            .sections
            .getByChapter(
              chapterId
            );

        setSections(
          response.data || []
        );

      }
      catch (error) {

        console.error(error);

      }

    };
  /*
=========================
SOCKET.IO SETUP
=========================
*/

  useEffect(() => {
    if (
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

    const ideaVoted=({
  ideaId,
  userId,
  voted
})=>{

  setSession(prev=>({

    ...prev,

    ideas:
      prev?.ideas?.map(
        idea=>{

          if(
            idea.id!==ideaId
          ){
            return idea;
          }

          const currentVoters=
            idea.voters||[];

          const updatedVoters=
            voted
            ?[
              ...currentVoters,
              userId
            ]
            :currentVoters.filter(
              id=>
              Number(id)!==
              Number(userId)
            );

          return{

            ...idea,

            voters:
              updatedVoters,

            has_voted:
              updatedVoters.includes(
                user?.id
              ),

            votes:
              updatedVoters.length

          };

        }
      )||[]

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
  DISCUSSION ACTIONS
  =========================
  */
  const handleAddDiscussion =
    async (message) => {

      try {

        const response =
          await apiClient
            .brainstorm
            .addDiscussion(
              projectId,
              { message }
            );

        const savedDiscussion =
          response.data;

        emitDiscussionAdded(
          projectId,
          savedDiscussion
        );

      }
      catch (error) {

        console.error(error);

      }

    };
  /*
  =========================
  NOTE ACTIONS
  =========================
  */

  const handleAddNote =
    async (content) => {

      try {

        const response =
          await apiClient
            .brainstorm
            .addNote(
              projectId,
              { content }
            );

        const savedNote =
          response.data;

        emitNoteAdded(
          projectId,
          savedNote
        );

      }
      catch (error) {

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

      if (!newIdeaInput.title?.trim())
        return;

      try {

        const savedIdea =
          await addNewIdea(

            user?.id,
            user?.name,
            newIdeaInput.title,
            newIdeaInput.description,
            selectedChapter

          );

        emitIdeaAdded(
          projectId,
          savedIdea
        );

        setNewIdeaInput({
          title: '',
          description: ''
        });

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

        const result =
          await vote(
            ideaId
          );

        // kirim ke user lain
        emitIdeaVoted(
          projectId,
          ideaId,
          user?.id,
          result.voted
        );

      }
      catch (error) {

        console.error(
          error
        );

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
              onClick={() => {

                setActiveView(
                  'brainstorm'
                );

                localStorage.setItem(
                  `brainstorm_view_${projectId}`,
                  'brainstorm'
                );

              }}
              className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-medium transition ${activeView === 'brainstorm'
                ? 'bg-white/60 dark:bg-dark-surface/80 text-light-primary dark:text-dark-primary shadow-md'
                : 'text-light-text/70 dark:text-dark-text/70 hover:bg-white/30'
                }`}
            >
              <FiZap className="w-4 h-4" />
              Vote Idea
            </button>

            <button
              onClick={() => {

                setActiveView(
                  'tasks'
                );

                localStorage.setItem(
                  `brainstorm_view_${projectId}`,
                  'tasks'
                );

              }}
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
              isInitiator={
                Number(user?.id) ===
                Number(
                  project?.initiator_id ||
                  project?.initiatorId ||
                  project?.creator_id ||
                  project?.owner_id ||
                  project?.user_id
                )
              }
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
            onDiscussionAdded={handleAddDiscussion}
            onDiscussionDeleted={(discussionId) =>
              emitDiscussionDeleted(
                projectId,
                discussionId
              )
            }
          />

          <NotesPanel
            projectId={projectId}
            brainstorm={session}
            user={user}
            onNoteAdded={handleAddNote}
            onNoteDeleted={(noteId) =>
              emitNoteDeleted(
                projectId,
                noteId
              )
            }
          />

          <ContributionPanel
            projectId={projectId}
            brainstorm={session}
            user={user}
          />

        </div>

      </div>
      {
        showBrainstormIdeaTutorial && (
          <BrainstormTutorialIdea
            step={brainstormideaTutorialStep}
            onNext={handleBrainstormIdeaTutorialNext}
            onSkip={handleBrainstormIdeaTutorialSkip}
            onPrevious={handleBrainstormIdeaTutorialPrevious}
            openMobileMenu={handleOpenMobileMenu}
            closeMobileMenu={handleCloseMobileMenu}
          />
        )
      }

      {
        showBrainstormTaskTutorial && (
          <BrainstormTutorialTask
            step={brainstormtaskTutorialStep}
            onNext={handleBrainstormTaskTutorialNext}
            onSkip={handleBrainstormTaskTutorialSkip}
            onPrevious={handleBrainstormIdeaTutorialPrevious}
            openMobileMenu={handleOpenMobileMenu}
            closeMobileMenu={handleCloseMobileMenu}
          />
        )
      }

    </div>

  );

};

export default BrainstormGridLayout;