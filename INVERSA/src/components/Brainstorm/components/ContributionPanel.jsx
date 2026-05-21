// components/Brainstorm/components/ContributionPanel.jsx

import React, {
  useMemo,
} from 'react';

import {
  FiTrendingUp,
  FiGitBranch,
  FiCheck,
  FiFileText,
} from 'react-icons/fi';

const ContributionPanel = ({
  brainstorm = {},
}) => {

  /*
  =========================
  CONTRIBUTIONS
  =========================
  */

  const contributions =
    useMemo(() => {

      const stats = {};

      /*
      =========================
      IDEAS
      =========================
      */

      brainstorm?.ideas?.forEach(
        (idea) => {

          const userKey =
            idea.user_id ||
            idea.name ||
            'unknown';

          if (
            !stats[userKey]
          ) {

            stats[userKey] = {

              name:
                idea.name ||
                'Unknown',

              ideas: 0,
              tasks: 0,
              notes: 0,
            };
          }

          stats[userKey]
            .ideas += 1;
        }
      );

      /*
      =========================
      TASKS
      =========================
      */

      brainstorm?.tasks?.forEach(
        (task) => {

          const userKey =
            task.assigned_to ||
            'unassigned';

          if (
            !stats[userKey]
          ) {

            stats[userKey] = {

              name:
                task.assigned_name ||
                'Unassigned',

              ideas: 0,
              tasks: 0,
              notes: 0,
            };
          }

          stats[userKey]
            .tasks += 1;
        }
      );

      /*
      =========================
      NOTES
      =========================
      */

      brainstorm?.notes?.forEach(
        (note) => {

          const userKey =
            note.user_id ||
            note.name ||
            'unknown';

          if (
            !stats[userKey]
          ) {

            stats[userKey] = {

              name:
                note.name ||
                'Unknown',

              ideas: 0,
              tasks: 0,
              notes: 0,
            };
          }

          stats[userKey]
            .notes += 1;
        }
      );

      return Object
        .entries(stats)

        .map(
          ([
            userId,
            data,
          ]) => ({

            userId,

            ...data,
          })
        )

        .sort(
          (a, b) => (

            (
              b.ideas +
              b.tasks +
              b.notes
            )

            -

            (
              a.ideas +
              a.tasks +
              a.notes
            )
          )
        );

    }, [brainstorm]);

  /*
  =========================
  RENDER
  =========================
  */

  return (

    <div
      className="
        card p-4

        h-full

        flex flex-col

        bg-light-surface
        dark:bg-dark-surface
      "
    >

      {/* HEADER */}

      <h3
        className="
          font-semibold

          text-light-primary
          dark:text-dark-primary

          mb-4

          flex items-center gap-2
        "
      >

        <FiTrendingUp className="w-4 h-4" />

        Contributions

      </h3>

      {/* LIST */}

      <div
        className="
          flex-1

          overflow-y-auto

          space-y-2

          min-h-0
        "
      >

        {contributions.length === 0 ? (

          <div
            className="
              text-center py-8

              text-light-secondary
              dark:text-dark-secondary

              text-sm
            "
          >

            <p>
              No contributions yet
            </p>

          </div>

        ) : (

          contributions.map(
            (contrib) => {

              const total =

                contrib.ideas +
                contrib.tasks +
                contrib.notes;

              return (

                <div
                  key={contrib.userId}

                  className="
                    bg-light-background
                    dark:bg-dark-background

                    p-3

                    rounded-xl
                  "
                >

                  {/* TOP */}

                  <div
                    className="
                      flex justify-between
                      items-start

                      mb-2
                    "
                  >

                    <p
                      className="
                        font-medium

                        text-xs

                        text-light-primary
                        dark:text-dark-primary

                        truncate
                      "
                    >
                      {contrib.name}
                    </p>

                    <span
                      className="
                        px-2 py-1

                        bg-light-accent/10
                        dark:bg-dark-accent/10

                        text-light-accent
                        dark:text-dark-accent

                        rounded

                        text-xs font-semibold
                      "
                    >
                      {total}
                    </span>

                  </div>

                  {/* STATS */}

                  <div
                    className="
                      grid grid-cols-2

                      gap-2

                      text-xs
                    "
                  >

                    {contrib.ideas > 0 && (

                      <div
                        className="
                          flex items-center gap-1
                        "
                      >

                        <FiGitBranch
                          className="
                            w-3 h-3

                            text-light-secondary
                            dark:text-dark-secondary
                          "
                        />

                        <span
                          className="
                            text-light-primary
                            dark:text-dark-primary

                            font-medium
                          "
                        >
                          {contrib.ideas}
                        </span>

                      </div>

                    )}

                    {contrib.tasks > 0 && (

                      <div
                        className="
                          flex items-center gap-1
                        "
                      >

                        <FiCheck
                          className="
                            w-3 h-3

                            text-light-secondary
                            dark:text-dark-secondary
                          "
                        />

                        <span
                          className="
                            text-light-primary
                            dark:text-dark-primary

                            font-medium
                          "
                        >
                          {contrib.tasks}
                        </span>

                      </div>

                    )}

                    {contrib.notes > 0 && (

                      <div
                        className="
                          flex items-center gap-1
                        "
                      >

                        <FiFileText
                          className="
                            w-3 h-3

                            text-light-secondary
                            dark:text-dark-secondary
                          "
                        />

                        <span
                          className="
                            text-light-primary
                            dark:text-dark-primary

                            font-medium
                          "
                        >
                          {contrib.notes}
                        </span>

                      </div>

                    )}

                  </div>

                  {/* PROGRESS */}

                  <div
                    className="
                      mt-2

                      h-1

                      bg-light-background
                      dark:bg-dark-background

                      rounded-full

                      overflow-hidden
                    "
                  >

                    <div
                      className="
                        h-full

                        bg-light-accent
                        dark:bg-dark-accent

                        transition-all
                      "
                      style={{
                        width:
                          `${Math.min(
                            (total / 20) * 100,
                            100
                          )}%`
                      }}
                    />

                  </div>

                </div>

              );
            }
          )

        )}

      </div>

    </div>
  );
};

export default ContributionPanel;