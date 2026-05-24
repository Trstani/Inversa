import { useState } from 'react';

import {
  FiTrash2,
  FiBook,
  FiMessageCircle,
  FiThumbsUp,
} from 'react-icons/fi';

import IdeaComments from './IdeaComments';

const IdeaCard = ({
  idea,
  onDelete,
  onVote,
  user,
  getChapterTitle,
}) => {

  /*
  =========================
  STATES
  =========================
  */

  const [
    showComments,
    setShowComments,
  ] = useState(false);

  /*
  =========================
  IDEA DATA
  =========================
  */

  const ideaOwnerId =
    idea.user_id ||
    idea.userId;

  const isOwner =
    Number(user?.id) ===
    Number(ideaOwnerId);

  const canVote =
    !isOwner;

 const voters=
  idea.voters||[];

const hasVoted=
  voters.includes(
    user?.id
  );

  const displayName =
    idea.user_name ||
    idea.userName ||
    idea.name ||
    'Unknown';

  const chapterId =
    idea.chapter_id ||
    idea.chapterReference ||
    null;

  const ideaTitle =
    idea.title || '';

  const ideaDescription =
    idea.description ||
    idea.content ||
    '';

  const votes =
    idea.votes || 0;

  const formattedDate =
    idea.created_at
      ? new Date(
          idea.created_at
        ).toLocaleDateString()

      : idea.createdAt
        ? new Date(
            idea.createdAt
          ).toLocaleDateString()

        : 'Unknown Date';

  /*
  =========================
  VOTE
  =========================
  */

  const handleVote =
    async () => {

      try {

        await onVote(
          idea.id
        );

      } catch (error) {

        console.error(
          error
        );
      }
    };

  /*
  =========================
  RENDER
  =========================
  */

  return (

    <div className="card p-4 bg-light-surface dark:bg-dark-surface border border-light-accent/20 dark:border-dark-accent/20 hover:border-light-accent dark:hover:border-dark-accent transition">

      {/* HEADER */}

      <div className="flex justify-between items-start gap-3 mb-3">

        <div className="flex-1">

          <p className="font-medium text-sm text-light-primary dark:text-dark-primary">

            {displayName}

          </p>

          {chapterId && (

            <p className="text-xs text-light-accent dark:text-dark-accent mt-1 flex items-center gap-1">

              <FiBook className="w-3 h-3" />

              {getChapterTitle(
                chapterId
              )}

            </p>

          )}

        </div>

        <div className="flex items-center gap-2">

          {/* DISCUSSION */}

          <button
            onClick={() =>
              setShowComments(
                !showComments
              )
            }

            className="flex items-center gap-1 px-2 py-1 text-xs rounded-lg bg-light-background dark:bg-dark-background text-light-secondary dark:text-dark-secondary hover:bg-light-accent/10 dark:hover:bg-dark-accent/10 transition"
          >

            <FiMessageCircle className="w-3 h-3" />

            Discussion

          </button>

          {/* DELETE */}

          {isOwner && (

            <button
              onClick={() =>
                onDelete(
                  idea.id
                )
              }

              className="p-1 rounded-lg text-red-500 hover:bg-red-500/10 transition"
            >

              <FiTrash2 className="w-4 h-4" />

            </button>

          )}

        </div>

      </div>

      {/* TITLE */}

      {ideaTitle && (

        <h3 className="font-semibold text-light-primary dark:text-dark-primary mb-2">

          {ideaTitle}

        </h3>

      )}

      {/* CONTENT */}

      {ideaDescription && (


        <p className="text-sm text-light-secondary dark:text-dark-secondary mb-4 whitespace-pre-wrap">

          {ideaDescription}

        </p>

      )}

      {/* FOOTER */}

      <div className="flex items-center justify-between">

        <span className="text-xs text-light-secondary/70 dark:text-dark-secondary/70">

          {formattedDate}

        </span>

        {/* VOTE */}

        {canVote ? (

          <button
            onClick={handleVote}

            title="vote"

            className={`cursor-pointer transition-all px-3 py-1 rounded-lg border-b-[4px] text-xs flex items-center gap-1 ${
              hasVoted

                ? 'bg-orange-500 text-white border-orange-700 hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px]'

                : 'bg-blue-500 text-white border-blue-700 hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px]'
            }`}
          >

            <FiThumbsUp className="w-3 h-3" />

            {votes}

          </button>

        ) : (

          <div className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs bg-light-background dark:bg-dark-background text-light-secondary dark:text-dark-secondary">

            <FiThumbsUp className="w-3 h-3" />

            {votes}

          </div>

        )}

      </div>

      {/* COMMENTS */}

      {showComments && (

        <div className="mt-5 pt-5 border-t border-light-border dark:border-dark-border">

          <IdeaComments
            ideaId={idea.id}
          />

        </div>

      )}

    </div>
  );
};

export default IdeaCard;