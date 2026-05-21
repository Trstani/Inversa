// components/Brainstorm/components/DiscussionPanel.jsx

import React, {
  useState,
  useEffect,
} from 'react';

import {
  FiSend,
  FiMessageCircle,
} from 'react-icons/fi';

import {
  apiClient,
} from '../../../api/client';

const DiscussionPanel = ({
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
    newDiscussion,
    setNewDiscussion,
  ] = useState('');

  const [
    discussions,
    setDiscussions,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(false);

  /*
  =========================
  LOAD DISCUSSIONS
  =========================
  */

  useEffect(() => {

    if (!projectId) {
      return;
    }

    loadDiscussions();

  }, [projectId]);

  const loadDiscussions =
    async () => {

      setLoading(true);

      try {

        const response =
          await apiClient
            .brainstorm
            .getDiscussions(
              projectId
            );

        setDiscussions(
          response.data || []
        );

      } catch (error) {

        console.error(
          'Error loading discussions:',
          error
        );

      } finally {

        setLoading(false);
      }
    };

  /*
  =========================
  ADD DISCUSSION
  =========================
  */

  const handleAddDiscussion =
    async () => {

      if (
        !newDiscussion.trim()
      ) {
        return;
      }

      try {

        await apiClient
          .brainstorm
          .addDiscussion(
            projectId,
            {
              message:
                newDiscussion,
            }
          );

        setNewDiscussion('');

        await loadDiscussions();

        onUpdate?.();

      } catch (error) {

        console.error(
          'Error adding discussion:',
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

        <FiMessageCircle className="w-4 h-4" />

        Discussion

      </h3>

      {/* MESSAGES */}

      <div
        className="
          flex-1

          overflow-y-auto

          space-y-3

          mb-4

          min-h-0
        "
      >

        {loading ? (

          <div
            className="
              text-center py-4

              text-light-secondary
              dark:text-dark-secondary

              text-sm
            "
          >
            Loading...
          </div>

        ) : discussions.length === 0 ? (

          <div
            className="
              text-center py-8

              text-light-secondary
              dark:text-dark-secondary

              text-sm
            "
          >

            <p>
              No discussions yet
            </p>

          </div>

        ) : (

          discussions.map(
            (discussion) => (

              <div
                key={discussion.id}
                className="
                  bg-light-background
                  dark:bg-dark-background

                  p-3

                  rounded-xl
                "
              >

                {/* USER */}

                <div
                  className="
                    flex justify-between
                    items-start

                    gap-2

                    mb-1
                  "
                >

                  <p
                    className="
                      font-medium

                      text-xs

                      text-light-primary
                      dark:text-dark-primary
                    "
                  >
                    {discussion.name ||
                      'Unknown'}
                  </p>

                </div>

                {/* MESSAGE */}

                <p
                  className="
                    text-xs

                    text-light-secondary
                    dark:text-dark-secondary
                  "
                >
                  {discussion.message}
                </p>

                {/* TIME */}

                <p
                  className="
                    text-xs

                    text-light-secondary/50
                    dark:text-dark-secondary/50

                    mt-1
                  "
                >
                  {new Date(
                    discussion.created_at
                  ).toLocaleTimeString()}
                </p>

              </div>

            )
          )

        )}

      </div>

      {/* INPUT */}

      <div className="flex gap-2">

        <input
          type="text"

          value={newDiscussion}

          onChange={(e) =>
            setNewDiscussion(
              e.target.value
            )
          }

          placeholder="Add discussion..."

          className="
            flex-1

            px-3 py-2

            text-sm

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

          onKeyPress={(e) =>
            e.key === 'Enter' &&
            handleAddDiscussion()
          }
        />

        <button
          onClick={handleAddDiscussion}

          disabled={
            !newDiscussion.trim()
          }

          className="
            px-3 py-2

            bg-light-accent
            dark:bg-dark-accent

            text-white

            rounded

            hover:opacity-90

            disabled:opacity-50

            transition
          "
        >

          <FiSend className="w-4 h-4" />

        </button>

      </div>

    </div>
  );
};

export default DiscussionPanel;