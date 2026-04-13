import { FiTrash2, FiCheckCircle, FiBook } from 'react-icons/fi';
import { findUserById } from '../../../utils/userManager/index';

const TaskCard = ({
  task,
  status,
  onDelete,
  onUpdateStatus,
  getChapterTitle
}) => {
  return (
    <div className="card p-3 bg-light-surface dark:bg-dark-surface border border-light-accent/10 dark:border-dark-accent/10 hover:border-light-accent dark:hover:border-dark-accent transition">
      <div className="flex justify-between items-start gap-2 mb-2">
        <div className="flex-1 min-w-0">
          <p className="font-medium text-xs text-light-primary dark:text-dark-primary line-clamp-2">
            {task.title}
          </p>
        </div>
        <button
          onClick={() => onDelete(task.id)}
          className="p-1 text-red-500 hover:bg-red-500/10 rounded transition flex-shrink-0"
        >
          <FiTrash2 className="w-4 h-4" />
        </button>
      </div>

      {task.description && (
        <p className="text-xs text-light-secondary dark:text-dark-secondary mb-2 line-clamp-2">
          {task.description}
        </p>
      )}

      {task.assignedTo && (
        <p className="text-xs text-light-accent dark:text-dark-accent mb-2">
          👤 {findUserById(task.assignedTo)?.name || task.assignedTo}
        </p>
      )}

      {task.chapterReference && (
        <p className="text-xs text-light-secondary dark:text-dark-secondary mb-2 flex items-center gap-1">
          <FiBook className="w-3 h-3" />
          {getChapterTitle(task.chapterReference)}
        </p>
      )}

      {status !== 'completed' && (
        <button
          onClick={() =>
            onUpdateStatus(task.id, {
              status: status === 'pending' ? 'in-progress' : 'completed',
            })
          }
          className="w-full px-2 py-1 text-xs bg-green-500/10 text-green-500 rounded hover:bg-green-500/20 transition flex items-center justify-center gap-1"
        >
          <FiCheckCircle className="w-3 h-3" />
          {status === 'pending' ? 'Start' : 'Complete'}
        </button>
      )}
    </div>
  );
};

export default TaskCard;
