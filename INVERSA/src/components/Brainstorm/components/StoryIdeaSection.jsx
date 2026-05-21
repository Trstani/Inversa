// components/Brainstorm/components/StoryIdeaSection.jsx

import {
  FiPlus,
} from 'react-icons/fi';

import IdeaCard
  from './IdeaCard';

const StoryIdeaSection = ({

  brainstorm,

  chapters,

  selectedChapter,

  filterChapter,

  newIdeaInput,

  onSelectChapter,

  onFilterChapter,

  onIdeaInputChange,

  onAddIdea,

  onDeleteIdea,

  onVote,

  user,

  getChapterTitle,

}) => {

  /*
  =========================
  FILTERED IDEAS
  =========================
  */

  const filteredIdeas =

    brainstorm?.ideas?.filter(
      (idea) => {

        if (!filterChapter) {
          return true;
        }

        return (
          idea.chapter_id ===
          filterChapter
        );
      }
    ) || [];

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
          flex justify-between
          items-center

          mb-4
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
          Story Ideas
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
            px-3 py-1

            text-sm

            bg-light-background
            dark:bg-dark-background

            border
            border-light-accent/20
            dark:border-dark-accent/20

            rounded

            text-light-primary
            dark:text-dark-primary

            focus:outline-none

            focus:border-light-accent
            dark:focus:border-dark-accent
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
                  chapter.chapterNumber
                }

              </option>

            )
          )}

        </select>

      </div>

      {/* INPUT */}

      <div
        className="
          mb-6

          flex flex-col
          sm:flex-row

          gap-2
        "
      >

        {/* CHAPTER */}

        <select
          value={selectedChapter || ''}

          onChange={(e) =>
            onSelectChapter(

              e.target.value
                ? parseInt(
                    e.target.value
                  )
                : null
            )
          }

          className="
            px-4 py-2

            bg-light-background
            dark:bg-dark-background

            border
            border-light-accent/20
            dark:border-dark-accent/20

            rounded

            text-light-primary
            dark:text-dark-primary

            focus:outline-none

            focus:border-light-accent
            dark:focus:border-dark-accent
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
                  chapter.chapterNumber

                }: {chapter.title}

              </option>

            )
          )}

        </select>

        {/* INPUT */}

        <input
          type="text"

          value={newIdeaInput}

          onChange={(e) =>
            onIdeaInputChange(
              e.target.value
            )
          }

          placeholder="Add your idea..."

          className="
            flex-1

            px-4 py-2

            bg-light-background
            dark:bg-dark-background

            border
            border-light-accent/20
            dark:border-dark-accent/20

            rounded

            text-light-primary
            dark:text-dark-primary

            placeholder-light-secondary
            dark:placeholder-dark-secondary

            focus:outline-none

            focus:border-light-accent
            dark:focus:border-dark-accent
          "

          onKeyDown={(e) =>
            e.key === 'Enter' &&
            onAddIdea()
          }
        />

        {/* BUTTON */}

        <button
          onClick={onAddIdea}

          disabled={
            !newIdeaInput.trim()
          }

          className="
            px-4 py-2

            bg-light-accent
            dark:bg-dark-accent

            text-white

            rounded

            hover:opacity-90

            disabled:opacity-50

            transition

            font-medium

            flex items-center gap-2
          "
        >

          <FiPlus className="w-4 h-4" />

          Add Idea

        </button>

      </div>

      {/* EMPTY */}

      {filteredIdeas.length === 0 ? (

        <div
          className="
            text-center py-8

            text-light-secondary
            dark:text-dark-secondary
          "
        >

          <p>
            No ideas yet.
            Be the first to share!
          </p>

        </div>

      ) : (

        /* GRID */

        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-3

            gap-4 sm:gap-6
          "
        >

          {filteredIdeas.map(
            (idea) => (

              <IdeaCard
                key={idea.id}

                idea={idea}

                onDelete={onDeleteIdea}
                onVote={onVote}

                user={user}

                getChapterTitle={
                  getChapterTitle
                }
              />

            )
          )}

        </div>

      )}

    </div>
  );
};

export default StoryIdeaSection;