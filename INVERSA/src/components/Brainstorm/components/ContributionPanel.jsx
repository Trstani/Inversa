// components/Brainstorm/components/ContributionPanel.jsx
import React, { useMemo } from 'react';
import { FiTrendingUp, FiGitBranch, FiThumbsUp, FiCheck, FiFileText } from 'react-icons/fi';

const ContributionPanel = ({ brainstorm = {}, teamMembers = [] }) => {
  const contributions = useMemo(() => {
    const stats = {};

    // Count ideas
    brainstorm.ideas?.forEach(idea => {
      if (!stats[idea.userId]) {
        stats[idea.userId] = { name: idea.userName, ideas: 0, votes: 0, tasks: 0, notes: 0 };
      }
      stats[idea.userId].ideas += 1;
    });

    // Count votes
    brainstorm.votes?.forEach(vote => {
      const idea = brainstorm.ideas?.find(i => i.id === vote.ideaId);
      if (idea && stats[idea.userId]) {
        stats[idea.userId].votes += 1;
      }
    });

    // Count tasks
    brainstorm.tasks?.forEach(task => {
      if (task.assignedTo) {
        if (!stats[task.assignedTo]) {
          stats[task.assignedTo] = { name: task.assignedTo, ideas: 0, votes: 0, tasks: 0, notes: 0 };
        }
        stats[task.assignedTo].tasks += 1;
      }
    });

    // Count notes
    brainstorm.notes?.forEach(note => {
      if (!stats[note.userId]) {
        stats[note.userId] = { name: note.userName, ideas: 0, votes: 0, tasks: 0, notes: 0 };
      }
      stats[note.userId].notes += 1;
    });

    return Object.entries(stats)
      .map(([userId, data]) => ({ userId, ...data }))
      .sort((a, b) => (b.ideas + b.votes + b.tasks + b.notes) - (a.ideas + a.votes + a.tasks + a.notes));
  }, [brainstorm]);

  return (
    <div className="card p-4 h-full flex flex-col bg-light-surface dark:bg-dark-surface">
      <h3 className="font-semibold text-light-primary dark:text-dark-primary mb-4 flex items-center gap-2">
        <FiTrendingUp className="w-4 h-4" />
        Contributions
      </h3>

      {/* Contributions List */}
      <div className="flex-1 overflow-y-auto space-y-2 min-h-0">
        {contributions.length === 0 ? (
          <div className="text-center py-8 text-light-secondary dark:text-dark-secondary text-sm">
            <p>No contributions yet</p>
          </div>
        ) : (
          contributions.map(contrib => {
            const total = contrib.ideas + contrib.votes + contrib.tasks + contrib.notes;
            return (
              <div key={contrib.userId} className="bg-light-background dark:bg-dark-background p-3 rounded">
                <div className="flex justify-between items-start mb-2">
                  <p className="font-medium text-xs text-light-primary dark:text-dark-primary truncate">
                    {contrib.name}
                  </p>
                  <span className="px-2 py-1 bg-light-accent/10 dark:bg-dark-accent/10 text-light-accent dark:text-dark-accent rounded text-xs font-semibold">
                    {total}
                  </span>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {contrib.ideas > 0 && (
                    <div className="flex items-center gap-1">
                      <FiGitBranch className="w-3 h-3 text-light-secondary dark:text-dark-secondary" />
                      <span className="text-light-primary dark:text-dark-primary font-medium">{contrib.ideas}</span>
                    </div>
                  )}
                  {contrib.votes > 0 && (
                    <div className="flex items-center gap-1">
                      <FiThumbsUp className="w-3 h-3 text-light-secondary dark:text-dark-secondary" />
                      <span className="text-light-primary dark:text-dark-primary font-medium">{contrib.votes}</span>
                    </div>
                  )}
                  {contrib.tasks > 0 && (
                    <div className="flex items-center gap-1">
                      <FiCheck className="w-3 h-3 text-light-secondary dark:text-dark-secondary" />
                      <span className="text-light-primary dark:text-dark-primary font-medium">{contrib.tasks}</span>
                    </div>
                  )}
                  {contrib.notes > 0 && (
                    <div className="flex items-center gap-1">
                      <FiFileText className="w-3 h-3 text-light-secondary dark:text-dark-secondary" />
                      <span className="text-light-primary dark:text-dark-primary font-medium">{contrib.notes}</span>
                    </div>
                  )}
                </div>

                {/* Progress Bar */}
                <div className="mt-2 h-1 bg-light-background dark:bg-dark-background rounded-full overflow-hidden">
                  <div
                    className="h-full bg-light-accent dark:bg-dark-accent transition-all"
                    style={{ width: `${Math.min((total / 20) * 100, 100)}%` }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ContributionPanel;
