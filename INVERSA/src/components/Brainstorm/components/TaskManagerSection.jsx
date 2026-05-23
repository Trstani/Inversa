// components/Brainstorm/components/TaskManagerSection.jsx

import {
  FiPlus,
  FiClock,
  FiLoader,
  FiCheckCircle,
} from 'react-icons/fi';

import TaskCard
  from './TaskCard';

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

  onTaskDueDateChange,

  onAddTask,

  onDeleteTask,

  onUpdateTaskStatus,

  getChapterTitle,

  isInitiator = false,

}) => {

  /*
  =========================
  FILTER TASKS
  =========================
  */

  const filterTasks =
    (tasks = []) => {

      return tasks.filter(
        (task) => {

          const taskChapterId =

            task.chapter_id ||

            task.chapterReference ||

            null;

          if (!filterChapter) {
            return true;
          }

          return (
            Number(taskChapterId) ===
            Number(filterChapter)
          );
        }
      );
    };

  /*
  =========================
  STATUS CONFIG
  =========================
  */

  const statusConfig = {

    pending: {
      title: 'Pending',
      icon: FiClock,
      color:
        'text-yellow-500',
    },

    'in-progress': {
      title: 'In Progress',
      icon: FiLoader,
      color:
        'text-blue-500',
    },

    completed: {
      title: 'Completed',
      icon:
        FiCheckCircle,
      color:
        'text-green-500',
    },
  };

  /*
  =========================
  RENDER
  =========================
  */

  return (

    <div className="mb-6">

      {/* HEADER */}

      <div
        className="
          flex flex-col
          sm:flex-row

          sm:items-center
          sm:justify-between

          gap-3

          mb-5
        "
      >

        <h2
          className="
            text-lg sm:text-xl
            font-bold

            text-light-primary
            dark:text-dark-primary
          "
        >
          Task Manager
        </h2>

        {/* FILTER */}

        <select
          value={filterChapter || ''}

          onChange={(e) =>
            onFilterChapter(
              e.target.value

                ? parseInt(
                  e.target.value
                )

                : null
            )
          }

          className="
            px-3 py-2

            text-sm

            rounded-xl

            bg-light-background
            dark:bg-dark-background

            border
            border-light-accent/20
            dark:border-dark-accent/20

            text-light-primary
            dark:text-dark-primary

            focus:outline-none
          "
        >

          <option value="">
            All Chapters
          </option>

          {chapters.map(
            (chapter) => (

              <option
                key={chapter.id}
                value={chapter.id}
              >

                Chapter {

                  chapter.chapter_number ||

                  chapter.chapterNumber ||

                  chapter.id
                }

              </option>

            )
          )}

        </select>

      </div>

      {/* CREATE TASK */}

      <div
        className="
          card p-5

          mb-6

          bg-light-surface
          dark:bg-dark-surface
        "
      >

        <h3
          className="
            font-semibold

            text-light-primary
            dark:text-dark-primary

            mb-4
          "
        >
          Add New Task
        </h3>

        <div className="space-y-4">

          {/* TITLE */}

          <input
            type="text"

            value={newTask.title}

            onChange={(e) =>
              onTaskTitleChange(
                e.target.value
              )
            }

            placeholder="Task title"

            className="
              w-full

              px-4 py-2

              rounded-xl

              bg-light-background
              dark:bg-dark-background

              border
              border-light-accent/20
              dark:border-dark-accent/20

              text-light-primary
              dark:text-dark-primary

              focus:outline-none
            "
          />

          {/* DESCRIPTION */}

          <textarea
            rows="3"

            value={newTask.description}

            onChange={(e) =>
              onTaskDescriptionChange(
                e.target.value
              )
            }

            placeholder="Task description"

            className="
              w-full

              px-4 py-2

              rounded-xl

              resize-none

              bg-light-background
              dark:bg-dark-background

              border
              border-light-accent/20
              dark:border-dark-accent/20

              text-light-primary
              dark:text-dark-primary

              focus:outline-none
            "
          />

          {/* CHAPTER + SECTION */}

          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-2

              gap-4
            "
          >

            {/* CHAPTER */}

            <select
              value={
                newTask.chapterReference ||

                newTask.chapter_id ||

                ''
              }

              onChange={(e) =>
                onTaskChapterChange(

                  e.target.value

                    ? parseInt(
                      e.target.value
                    )

                    : null
                )
              }

              className="
                px-4 py-2

                rounded-xl

                bg-light-background
                dark:bg-dark-background

                border
                border-light-accent/20
                dark:border-dark-accent/20

                text-light-primary
                dark:text-dark-primary

                focus:outline-none
              "
            >

              <option value="">
                Select chapter...
              </option>

              {chapters.map(
                (chapter) => (

                  <option
                    key={chapter.id}
                    value={chapter.id}
                  >

                    Chapter {

                      chapter.chapter_number ||

                      chapter.chapterNumber ||

                      chapter.id
                    }

                  </option>

                )
              )}

            </select>

            {/* SECTION */}

            {(newTask.chapterReference ||
              newTask.chapter_id) &&

              sections.length > 0 && (

                <select
                  value={
                    newTask.sectionReference ||

                    newTask.section_id ||

                    ''
                  }

                  onChange={(e) =>
                    onTaskSectionChange(

                      e.target.value

                        ? parseInt(
                          e.target.value
                        )

                        : null
                    )
                  }

                  className="
                  px-4 py-2

                  rounded-xl

                  bg-light-background
                  dark:bg-dark-background

                  border
                  border-light-accent/20
                  dark:border-dark-accent/20

                  text-light-primary
                  dark:text-dark-primary

                  focus:outline-none
                "
                >

                  <option value="">
                    Select section...
                  </option>

                  {sections.map(
                    (section) => (

                      <option
                        key={section.id}
                        value={section.id}
                      >

                        Section {

                          section.order ||
                          section.id
                        }

                      </option>

                    )
                  )}

                </select>

              )}

          </div>

          {/* ASSIGN */}

          <select
            value={
              newTask.assignedTo ||

              newTask.assigned_to ||

              ''
            }

            onChange={(e) =>
              onTaskAssignChange(
                e.target.value || null
              )
            }

            className="
              w-full

              px-4 py-2

              rounded-xl

              bg-light-background
              dark:bg-dark-background

              border
              border-light-accent/20
              dark:border-dark-accent/20

              text-light-primary
              dark:text-dark-primary

              focus:outline-none
            "
          >

            <option value="">
              Assign to...
            </option>

            {teamMembers.length > 0 ? (

              teamMembers.map(
                (member) => {

                  const memberId =

                    member.user_id ||

                    member.userId;

                  const memberName =

                    member.name ||

                    `User ${memberId}`;

                  const isCurrentUser =

                    Number(memberId) ===
                    Number(user?.id);

                  return (

                    <option
                      key={memberId}
                      value={memberId}
                    >

                      {
                        isCurrentUser

                          ? 'Me'

                          : memberName
                      }

                    </option>

                  );
                }
              )

            ) : (

              <option value={user?.id}>

                {user?.name || 'Me'}

              </option>

            )}

          </select>

          {/* DUE DATE */}

          <div className="space-y-1">

            <label
              className="
      text-sm
      font-medium

      text-light-primary
      dark:text-dark-primary
    "
            >
              Due Date
            </label>

            <input
              type="datetime-local"

              value={
                newTask.dueDate ||

                newTask.due_date ||

                ''
              }

              onChange={(e) =>
                onTaskDueDateChange(
                  e.target.value
                )
              }

              className="
      w-full

      px-4 py-2

      rounded-xl

      bg-light-background
      dark:bg-dark-background

      border
      border-light-accent/20
      dark:border-dark-accent/20

      text-light-primary
      dark:text-dark-primary

      focus:outline-none
    "
            />

          </div>

          {/* BUTTON */}

          <button
            onClick={onAddTask}

            disabled={
              !newTask.title?.trim()
            }

            className="
              w-full

              px-4 py-2

              rounded-xl

              bg-light-accent
              dark:bg-dark-accent

              text-white
              font-medium

              hover:opacity-90

              disabled:opacity-50

              transition

              flex items-center
              justify-center
              gap-2
            "
          >

            <FiPlus className="w-4 h-4" />

            Add Task

          </button>

        </div>

      </div>

      {/* TASK COLUMNS */}

      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-3

          gap-5
        "
      >

        {Object.entries(
          statusConfig
        ).map(
          ([status, config]) => {

            const StatusIcon =
              config.icon;

            const filteredTasks =
              filterTasks(
                tasksByStatus[
                status
                ] || []
              );

            return (

              <div key={status}>

                {/* COLUMN HEADER */}

                <div
                  className="
                    flex items-center
                    gap-2

                    mb-4
                  "
                >

                  <StatusIcon
                    className={`
                      w-4 h-4

                      ${config.color}
                    `}
                  />

                  <h3
                    className="
                      font-semibold

                      text-light-primary
                      dark:text-dark-primary
                    "
                  >

                    {config.title}

                  </h3>

                </div>

                {/* TASK LIST */}

                <div className="space-y-3">

                  {filteredTasks.length ===
                    0 ? (

                    <div
                      className="
                        text-center

                        py-6

                        rounded-xl

                        bg-light-surface
                        dark:bg-dark-surface
                      "
                    >

                      <p
                        className="
                          text-xs

                          text-light-secondary
                          dark:text-dark-secondary
                        "
                      >
                        No tasks
                      </p>

                    </div>

                  ) : (

                    filteredTasks.map(
                      (task) => (

                        <TaskCard
                          key={task.id}

                          task={task}

                          status={status}

                          user={user}

                          isInitiator={isInitiator}

                          onDelete={onDeleteTask}

                          onUpdateStatus={onUpdateTaskStatus}

                          getChapterTitle={getChapterTitle}
                        />

                      )
                    )

                  )}

                </div>

              </div>

            );
          }
        )}

      </div>

    </div>
  );
};

export default TaskManagerSection;