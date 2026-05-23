// components/Brainstorm/components/TaskCard.jsx

import {
  FiTrash2,
  FiCheckCircle,
  FiBook,
  FiLock,
  FiPlay,
  FiLoader,
  FiUser,
  FiCalendar,
} from 'react-icons/fi';

const TaskCard = ({

  task,

  status,

  onDelete,

  onUpdateStatus,

  getChapterTitle,

  user,

  isInitiator = false,

}) => {

  /*
  =========================
  ASSIGNED USER
  =========================
  */

  const assignedUserId =

    task.assigned_to ||

    task.assignedTo ||

    null;

  const assignedUserName =

    task.assigned_name ||

    task.assignedName ||

    null;

  /*
  =========================
  CHAPTER
  =========================
  */

  const chapterId =

    task.chapter_id ||

    task.chapterReference ||

    null;

  /*
=========================
DUE DATE
=========================
*/

  const dueDate =

    task.due_date ||

    task.dueDate ||

    null;  

  /*
  =========================
  PERMISSIONS
  =========================
  */

  const isAssignedUser =

    Number(user?.id) ===
    Number(assignedUserId);

  const canManageTask =

    isAssignedUser ||
    isInitiator;

  /*
  =========================
  STATUS
  =========================
  */

  const currentStatus =

    task.status ||
    status;

  const nextStatus =

    currentStatus === 'pending'

      ? 'in-progress'

      : 'completed';

  const buttonLabel =

    currentStatus === 'pending'

      ? 'Start'

      : 'Complete';

  /*
  =========================
  STATUS ICON
  =========================
  */

  const StatusIcon =

    currentStatus === 'pending'

      ? FiPlay

      : currentStatus ===
        'in-progress'

        ? FiLoader

        : FiCheckCircle;

  /*
  =========================
  RENDER
  =========================
  */

  return (

    <div
      className="
        card p-4

        bg-light-surface
        dark:bg-dark-surface

        border
        border-light-accent/10
        dark:border-dark-accent/10

        hover:border-light-accent
        dark:hover:border-dark-accent

        transition
      "
    >

      {/* HEADER */}

      <div
        className="
          flex justify-between
          items-start

          gap-3

          mb-3
        "
      >

        {/* TITLE */}

        <div className="flex-1 min-w-0">

          <p
            className="
              font-semibold

              text-sm

              text-light-primary
              dark:text-dark-primary

              line-clamp-2
            "
          >
            {task.title}
          </p>

        </div>

        {/* DELETE */}

        {canManageTask && (

          <button
            onClick={() =>
              onDelete(
                task.id
              )
            }

            className="
              p-1

              rounded-lg

              text-red-500

              hover:bg-red-500/10

              transition
            "
          >

            <FiTrash2 className="w-4 h-4" />

          </button>

        )}

      </div>

      {/* DESCRIPTION */}

      {task.description && (

        <p
          className="
            text-xs

            text-light-secondary
            dark:text-dark-secondary

            mb-3

            whitespace-pre-wrap
          "
        >
          {task.description}
        </p>

      )}

      {/* ASSIGNED */}

      {assignedUserId && (

        <div
          className="
            mb-2

            text-xs

            text-light-accent
            dark:text-dark-accent

            flex items-center gap-1
          "
        >

          <FiUser className="w-3 h-3" />

          {

            assignedUserName ||

            `User ${assignedUserId}`
          }

        </div>

      )}

      {/* CHAPTER */}

      {chapterId && (

        <div
          className="
            mb-3

            text-xs

            text-light-secondary
            dark:text-dark-secondary

            flex items-center gap-1
          "
        >

          <FiBook className="w-3 h-3" />

          {
            getChapterTitle(
              chapterId
            )
          }

        </div>

      )}

      {/* DUE DATE */}

      {dueDate && (

        <div className=" mb-3 text-xs text-light-secondary dark:text-dark-secondary flex items-center gap-1">

          <FiCalendar className="w-3 h-3" />

          {
            new Date(
              dueDate
            ).toLocaleString(
              'ID-id',
              {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }
            )
          }

        </div>

      )}

      {/* STATUS */}

      <div className="mt-4">

        {/* COMPLETED */}

        {currentStatus ===
          'completed' ? (

          <div
            className="
              w-full

              px-3 py-2

              rounded-xl

              bg-green-500/10
              text-green-500

              text-xs font-medium

              flex items-center
              justify-center
              gap-2
            "
          >

            <FiCheckCircle className="w-4 h-4" />

            Completed

          </div>

        ) : canManageTask ? (

          <button
            onClick={() =>
              onUpdateStatus(
                task.id,
                {
                  status:
                    nextStatus,
                }
              )
            }

            className={`
              w-full

              px-3 py-2

              rounded-xl

              text-xs font-medium

              flex items-center
              justify-center
              gap-2

              transition

              ${
                currentStatus ===
                'pending'

                  ? `
                    bg-yellow-500/10
                    text-yellow-500

                    hover:bg-yellow-500/20
                  `

                  : `
                    bg-blue-500/10
                    text-blue-500

                    hover:bg-blue-500/20
                  `
              }
            `}
          >

            <StatusIcon className="w-4 h-4" />

            {buttonLabel}

          </button>

        ) : (

          <div
            className="
              w-full

              px-3 py-2

              rounded-xl

              bg-light-background
              dark:bg-dark-background

              text-light-secondary
              dark:text-dark-secondary

              text-xs

              flex items-center
              justify-center
              gap-2
            "
          >

            <FiLock className="w-4 h-4" />

            Assigned Task

          </div>

        )}

      </div>

    </div>
  );
};

export default TaskCard;