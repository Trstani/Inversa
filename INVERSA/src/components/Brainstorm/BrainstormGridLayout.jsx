// components/Brainstorm/BrainstormGridLayout.jsx
import { useState, useEffect } from 'react';
import { FiZap, FiCheck } from 'react-icons/fi';
import DiscussionPanel from './components/DiscussionPanel';
import NotesPanel from './components/NotesPanel';
import ContributionPanel from './components/ContributionPanel';
import StoryIdeaSection from './components/StoryIdeaSection';
import TaskManagerSection from './components/TaskManagerSection';
import { loadChapters } from '../../utils/dataManager/chapterManager';
import { getSectionsByChapter } from '../../utils/dataManager/sectionManager';
import { findUserById } from '../../utils/userManager/index';
import { getProjectById } from '../../utils/dataManager/projectManager';
import { getTeamById } from '../../utils/dataManager/teamManager';
import useBrainstorm from '../../InitiatorFolder/hooks/useBrainstorm';

const BrainstormGridLayout = ({ projectId, brainstorm, onUpdate, user }) => {
  const [activeView, setActiveView] = useState('brainstorm'); // 'brainstorm' or 'tasks'
  const [chapters, setChapters] = useState([]);
  const [sections, setSections] = useState([]);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [filterChapter, setFilterChapter] = useState(null); // Filter untuk ideas dan tasks
  const [teamMembers, setTeamMembers] = useState([]);
  const [newIdeaInput, setNewIdeaInput] = useState('');
  const [expandedIdea, setExpandedIdea] = useState(null); // Track expanded idea untuk comments
  const [ideaComments, setIdeaComments] = useState({}); // Store comments per idea
  const [newComment, setNewComment] = useState('');
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    chapterReference: null,
    sectionReference: null,
    assignedTo: null
  });
  const { addNewIdea, removeIdea, createTask, updateTaskStatus, removeTask } = useBrainstorm(projectId);

  useEffect(() => {
    loadChaptersData();
    loadTeamMembers();
    loadCommentsFromStorage();
  }, [projectId]);

  const loadCommentsFromStorage = () => {
    try {
      const stored = localStorage.getItem(`brainstorm_comments_${projectId}`);
      if (stored) {
        setIdeaComments(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  };

  const saveCommentsToStorage = (comments) => {
    try {
      localStorage.setItem(`brainstorm_comments_${projectId}`, JSON.stringify(comments));
    } catch (error) {
      console.error('Error saving comments:', error);
    }
  };

  const loadChaptersData = async () => {
    const chaptersList = await loadChapters(projectId);
    setChapters(chaptersList);
  };

  const loadTeamMembers = async () => {
    try {
      const project = await getProjectById(projectId);
      if (project?.isTeamProject && project?.teamId) {
        const team = await getTeamById(project.teamId);
        setTeamMembers(team?.collaborators || []);
      }
    } catch (error) {
      console.error('Error loading team members:', error);
    }
  };

  const handleAddIdea = async () => {
    if (!newIdeaInput.trim()) return;
    await addNewIdea(user.id, user.name, newIdeaInput, selectedChapter);
    setNewIdeaInput('');
    setSelectedChapter(null);
    onUpdate?.();
  };

  const handleDeleteIdea = async (ideaId) => {
    await removeIdea(ideaId);
    onUpdate?.();
  };

  const handleAddComment = (ideaId) => {
    if (!newComment.trim()) return;
    const updatedComments = {
      ...ideaComments,
      [ideaId]: [
        ...(ideaComments[ideaId] || []),
        {
          id: Date.now(),
          userId: user.id,
          userName: user.name,
          text: newComment,
          createdAt: new Date().toISOString()
        }
      ]
    };
    setIdeaComments(updatedComments);
    saveCommentsToStorage(updatedComments);
    setNewComment('');
  };

  const handleDeleteComment = (ideaId, commentId) => {
    const updatedComments = {
      ...ideaComments,
      [ideaId]: ideaComments[ideaId].filter(c => c.id !== commentId)
    };
    setIdeaComments(updatedComments);
    saveCommentsToStorage(updatedComments);
  };

  const handleChapterChange = async (chapterId) => {
    setNewTask(prev => ({ ...prev, chapterReference: chapterId, sectionReference: null }));
    if (chapterId) {
      const sectionsList = await getSectionsByChapter(chapterId);
      setSections(sectionsList);
    } else {
      setSections([]);
    }
  };

  const handleAddTask = async () => {
    if (!newTask.title.trim()) return;
    await createTask({
      title: newTask.title,
      description: newTask.description,
      chapterReference: newTask.chapterReference,
      sectionReference: newTask.sectionReference,
      assignedTo: newTask.assignedTo
    });
    setNewTask({
      title: '',
      description: '',
      chapterReference: null,
      sectionReference: null,
      assignedTo: null
    });
    setSections([]);
    onUpdate?.();
  };

  const handleUpdateTask = async (taskId, updates) => {
    await updateTaskStatus(taskId, updates);
    onUpdate?.();
  };

  const handleDeleteTask = async (taskId) => {
    await removeTask(taskId);
    onUpdate?.();
  };

  const tasksByStatus = {
    pending: brainstorm?.tasks?.filter(t => t.status === 'pending') || [],
    'in-progress': brainstorm?.tasks?.filter(t => t.status === 'in-progress') || [],
    completed: brainstorm?.tasks?.filter(t => t.status === 'completed') || [],
  };

  const getChapterTitle = (chapterId) => {
    const chapter = chapters.find(c => c.id === chapterId);
    return chapter ? `Chapter ${chapter.chapterNumber}: ${chapter.title}` : 'Unknown Chapter';
  };

  return (
    <div className="min-h-screen bg-light-background dark:bg-dark-background">
      {/* View Tabs - Brainstorm vs Task Manager */}
      <div className="sticky top-0 z-10 bg-light-background dark:bg-dark-background px-4 py-4 border-light-accent/20 dark:border-dark-accent/20">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-2">
            <div className="flex gap-1 p-1 bg-white/20 dark:bg-black/20 backdrop-blur-md rounded-2xl border border-white/30 dark:border-white/10 shadow-sm">
              <button
                onClick={() => setActiveView('brainstorm')}
                className={`flex items-center gap-2 px-6 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${activeView === 'brainstorm'
                    ? 'bg-white/60 dark:bg-dark-surface/80 text-light-primary dark:text-dark-primary shadow-md'
                    : 'text-light-text/70 dark:text-dark-text/70 hover:bg-white/30 dark:hover:bg-dark-secondary/30'
                  }`}
              >
                <FiZap className="w-4 h-4" />
                Vote Idea
              </button>
              <button
                onClick={() => setActiveView('tasks')}
                className={`flex items-center gap-2 px-6 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${activeView === 'tasks'
                    ? 'bg-white/60 dark:bg-dark-surface/80 text-light-primary dark:text-dark-primary shadow-md'
                    : 'text-light-text/70 dark:text-dark-text/70 hover:bg-white/30 dark:hover:bg-dark-secondary/30'
                  }`}
              >
                <FiCheck className="w-4 h-4" />
                Task Manager
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Top Row - Large Section for Ideas or Tasks */}
          <div className="lg:col-span-3">
            <div className="card p-6 bg-light-surface dark:bg-dark-surface mb-4">
              {activeView === 'brainstorm' ? (
                <StoryIdeaSection
                  brainstorm={brainstorm}
                  chapters={chapters}
                  selectedChapter={selectedChapter}
                  filterChapter={filterChapter}
                  newIdeaInput={newIdeaInput}
                  expandedIdea={expandedIdea}
                  ideaComments={ideaComments}
                  newComment={newComment}
                  onSelectChapter={setSelectedChapter}
                  onFilterChapter={setFilterChapter}
                  onIdeaInputChange={setNewIdeaInput}
                  onAddIdea={handleAddIdea}
                  onToggleExpandIdea={(ideaId) => setExpandedIdea(expandedIdea === ideaId ? null : ideaId)}
                  onDeleteIdea={handleDeleteIdea}
                  onCommentChange={setNewComment}
                  onAddComment={handleAddComment}
                  onDeleteComment={handleDeleteComment}
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
                  user={user}
                  onFilterChapter={setFilterChapter}
                  onTaskTitleChange={(value) => setNewTask({ ...newTask, title: value })}
                  onTaskDescriptionChange={(value) => setNewTask({ ...newTask, description: value })}
                  onTaskChapterChange={handleChapterChange}
                  onTaskSectionChange={(value) => setNewTask({ ...newTask, sectionReference: value })}
                  onTaskAssignChange={(value) => setNewTask({ ...newTask, assignedTo: value })}
                  onAddTask={handleAddTask}
                  onDeleteTask={handleDeleteTask}
                  onUpdateTaskStatus={handleUpdateTask}
                  getChapterTitle={getChapterTitle}
                />
              )}
            </div>
          </div>

        </div>

        {/* Bottom Row - Discussion, Notes, Contribution in one row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div>
            <DiscussionPanel
              projectId={projectId}
              brainstorm={brainstorm}
              onUpdate={onUpdate}
              user={user}
            />
          </div>

          <div>
            <NotesPanel
              projectId={projectId}
              brainstorm={brainstorm}
              onUpdate={onUpdate}
              user={user}
            />
          </div>

          <div>
            <ContributionPanel
              projectId={projectId}
              brainstorm={brainstorm}
              user={user}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrainstormGridLayout;
