import { FiPlus } from 'react-icons/fi';
import TaskCard from './TaskCard';
import { findUserById } from '../../../utils/userManager/index';

const TaskManagerSection = ({
  chapters,
  sections,
  teamMembers,
  filterChapter,
  newTask,
  tasksByStatus,
  user,
  onFilterChapter,
  onTaskTitleChange,
  onTaskDescriptionChange,
  onTaskChapterChange,
  onTaskSectionChange,
  onTaskAssignChange,
  onAddTask,
  onDeleteTask,
  onUpdateTaskStatus,
  getChapterTitle
}) => {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg sm:text-xl font-bold text-light-primary dark:text-dark-primary">
          Task Manager
        </h2>
        <select
          value={filterChapter || ''}
          onChange={(e) => onFilterChapter(e.target.value ? parseInt(e.target.value) : null)}
          className="px-3 py-1 text-sm bg-light-background dark:bg-dark-background border border-light-accent/20 dark:border-dark-accent/20 rounded text-light-primary dark:text-dark-primary focus:outline-none focus:border-light-accent dark:focus:border-dark-accent"
        >
          <option value="">All Chapters</option>
          {chapters.map(chapter => (
            <option key={chapter.id} value={chapter.id}>
              Chapter {chapter.chapterNumber}
            </option>
          ))}
        </select>
      </div>

      {/* Task Manager Layout - Input Form on Top, 3 Status Columns Below */}
      <div className="space-y-6">
        {/* Add Task Input Form - Full Width */}
        <div className="card p-4 sm:p-6 bg-light-surface dark:bg-dark-surface">
          <h3 className="font-semibold text-light-primary dark:text-dark-primary mb-4">
            Add New Task
          </h3>
          <div className="space-y-4">
            <input
              type="text"
              value={newTask.title}
              onChange={(e) => onTaskTitleChange(e.target.value)}
              placeholder="Task title"
              className="w-full px-4 py-2 bg-light-background dark:bg-dark-background border border-light-accent/20 dark:border-dark-accent/20 rounded text-light-primary dark:text-dark-primary placeholder-light-secondary dark:placeholder-dark-secondary focus:outline-none focus:border-light-accent dark:focus:border-dark-accent"
            />

            <textarea
              value={newTask.description}
              onChange={(e) => onTaskDescriptionChange(e.target.value)}
              placeholder="Task description (optional)"
              className="w-full px-4 py-2 bg-light-background dark:bg-dark-background border border-light-accent/20 dark:border-dark-accent/20 rounded text-light-primary dark:text-dark-primary placeholder-light-secondary dark:placeholder-dark-secondary focus:outline-none focus:border-light-accent dark:focus:border-dark-accent resize-none"
              rows="3"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                value={newTask.chapterReference || ''}
                onChange={(e) => onTaskChapterChange(e.target.value ? parseInt(e.target.value) : null)}
                className="px-4 py-2 bg-light-background dark:bg-dark-background border border-light-accent/20 dark:border-dark-accent/20 rounded text-light-primary dark:text-dark-primary focus:outline-none focus:border-light-accent dark:focus:border-dark-accent"
              >
                <option value="">Select chapter...</option>
                {chapters.map(chapter => (
                  <option key={chapter.id} value={chapter.id}>
                    Chapter {chapter.chapterNumber}
                  </option>
                ))}
              </select>

              {newTask.chapterReference && sections.length > 0 && (
                <select
                  value={newTask.sectionReference || ''}
                  onChange={(e) => onTaskSectionChange(e.target.value ? parseInt(e.target.value) : null)}
                  className="px-4 py-2 bg-light-background dark:bg-dark-background border border-light-accent/20 dark:border-dark-accent/20 rounded text-light-primary dark:text-dark-primary focus:outline-none focus:border-light-accent dark:focus:border-dark-accent"
                >
                  <option value="">Select section...</option>
                  {sections.map(section => (
                    <option key={section.id} value={section.id}>
                      Section {section.order}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <select
              value={newTask.assignedTo || ''}
              onChange={(e) => onTaskAssignChange(e.target.value || null)}
              className="w-full px-4 py-2 bg-light-background dark:bg-dark-background border border-light-accent/20 dark:border-dark-accent/20 rounded text-light-primary dark:text-dark-primary focus:outline-none focus:border-light-accent dark:focus:border-dark-accent"
            >
              <option value="">Assign to...</option>
              {teamMembers.length > 0 ? (
                teamMembers.map(member => {
                  const memberUser = findUserById(member.userId);
                  const isCurrentUser = member.userId === user?.id;
                  return (
                    <option key={member.userId} value={member.userId}>
                      {isCurrentUser ? 'Me' : memberUser?.name || `User ${member.userId}`}
                    </option>
                  );
                })
              ) : (
                <option value={user?.id}>{user?.name || 'Me'}</option>
              )}
            </select>

            <button
              onClick={onAddTask}
              disabled={!newTask.title.trim()}
              className="w-full px-4 py-2 bg-light-accent dark:bg-dark-accent text-white rounded hover:opacity-90 disabled:opacity-50 transition font-medium flex items-center justify-center gap-2"
            >
              <FiPlus className="w-4 h-4" />
              Add Task
            </button>
          </div>
        </div>

        {/* 3 Status Columns Below */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {['pending', 'in-progress', 'completed'].map(status => (
            <div key={status}>
              <h3 className="font-semibold text-light-primary dark:text-dark-primary mb-3 capitalize">
                {status.replace('-', ' ')}
              </h3>

              <div className="space-y-3">
                {tasksByStatus[status].filter(t => !filterChapter || t.chapterReference === filterChapter).length === 0 ? (
                  <p className="text-xs text-light-secondary dark:text-dark-secondary text-center py-4 opacity-70">
                    No tasks
                  </p>
                ) : (
                  tasksByStatus[status]
                    .filter(t => !filterChapter || t.chapterReference === filterChapter)
                    .map(task => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        status={status}
                        onDelete={onDeleteTask}
                        onUpdateStatus={onUpdateTaskStatus}
                        getChapterTitle={getChapterTitle}
                      />
                    ))
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskManagerSection;
