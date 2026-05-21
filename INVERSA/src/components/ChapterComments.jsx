import {
  useState,
  useEffect,
} from 'react';

import {
  Link,
} from 'react-router-dom';

import {
  FiTrash2,
  FiSend,
} from 'react-icons/fi';

import {
  useAuth,
} from '../context/AuthContext';

import {
  apiClient,
} from '../api/client';

const ChapterComments = ({
  chapterId,
}) => {

  /*
  =========================
  HOOKS
  =========================
  */

  const { user } =
    useAuth();

  /*
  =========================
  STATES
  =========================
  */

  const [
    currentUserProfile,
    setCurrentUserProfile,
  ] = useState(null);

  const [
    comments,
    setComments,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    input,
    setInput,
  ] = useState('');


  /*
  =========================
  LOAD COMMENTS
  =========================
  */
 useEffect(() => {

  if (user?.id) {
    loadCurrentUser();
  }

}, [user?.id]);

const loadCurrentUser =
  async () => {

    try {

      const response =
        await apiClient.users.getById(
          user.id
        );

      setCurrentUserProfile(
        response.data
      );

    } catch (error) {

      console.error(error);
    }
  };

  useEffect(() => {

    loadComments();

  }, [chapterId]);

  const loadComments =
    async () => {

      try {

        setLoading(true);

        const response =
          await apiClient.comments.getByChapter(
            chapterId
          );

        setComments(
          response.data || []
        );

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);
      }
    };

  /*
  =========================
  ADD COMMENT
  =========================
  */

  const handleSubmit =
  async () => {

    if (!input.trim()) {
      return;
    }

    try {

      const response =
        await apiClient.comments.create(
          chapterId,
          {
            text: input,
          }
        );

      const newComment = {

        ...response.data,
      };

      setComments(prev => [
        ...prev,
        newComment,
      ]);

      setInput('');

    } catch (error) {

      console.error(error);
    }
  };

  /*
  =========================
  DELETE COMMENT
  =========================
  */

  const handleDelete =
    async (commentId) => {

      try {

        await apiClient.comments.delete(
          commentId
        );

        await loadComments();

      } catch (error) {

        console.error(error);
      }
    };

  /*
  =========================
  RENDER
  =========================
  */

  return (

    <div className="card p-4 sm:p-6 mb-6 sm:mb-8">

      {/* HEADER */}

      <div className="mb-5">

        <h3 className="text-lg sm:text-xl font-semibold text-light-primary dark:text-dark-primary">

          Comments

        </h3>

        <p className="text-sm text-light-secondary dark:text-dark-secondary mt-1">

          {comments.length} comments

        </p>

      </div>

      {/* INPUT */}

      {user && (

        <div className="flex gap-3 mb-6">

          {/* AVATAR */}

          <div className="w-11 h-11 overflow-hidden rounded-full bg-light-accent/10 dark:bg-dark-accent/10 flex items-center justify-center shrink-0">

            {currentUserProfile?.profile_image ? (

              <img
                src={currentUserProfile?.profile_image}
                alt={currentUserProfile?.name}

                className="
                  w-full
                  h-full

                  object-cover
                "
              />

            ) : (

              <span className="text-sm font-bold text-light-accent dark:text-dark-accent">

                {currentUserProfile?.name?.charAt(0)?.toUpperCase()}

              </span>

            )}

          </div>

          {/* INPUT */}

          <div className="flex-1 flex gap-2">

            <textarea
              value={input}

              onChange={(e) =>
                setInput(e.target.value)
              }

              rows={2}

              placeholder="Write a comment..."

              className="flex-1 resize-none rounded-2xl border border-light-border dark:border-dark-border bg-light-background dark:bg-dark-background p-3 text-sm text-light-primary dark:text-dark-primary"
            />

            <button
              onClick={handleSubmit}

              className="h-11 w-11 rounded-2xl bg-light-accent dark:bg-dark-accent text-white flex items-center justify-center hover:opacity-90 transition-all"
            >

              <FiSend className="w-4 h-4" />

            </button>

          </div>

        </div>

      )}

      {/* COMMENTS */}

      <div className="space-y-4">

        {comments.map(
          (comment) => (

            <div
              key={comment.id}

              className="rounded-2xl border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface p-4"
            >

              <div className="flex items-start justify-between gap-4">

                <div className="flex gap-3">

                  {/* AVATAR */}

                  <Link
                    to={`/profile/${comment.user_id}`}
                  >

                    <div className="w-11 h-11 overflow-hidden rounded-full bg-light-accent/10 dark:bg-dark-accent/10 flex items-center justify-center shrink-0">

                      {comment.profile_image ? (

                        <img
                          src={comment.profile_image}
                          alt={comment.name}

                          className="
                            w-full
                            h-full

                            object-cover
                          "
                        />

                      ) : (

                        <span className="text-sm font-bold text-light-accent dark:text-dark-accent">

                          {comment.name?.charAt(0)?.toUpperCase()}

                        </span>

                      )}

                    </div>

                  </Link>

                  {/* CONTENT */}

                  <div>

                    <Link
                      to={`/profile/${comment.user_id}`}
                    >

                      <p className="font-medium text-light-primary dark:text-dark-primary hover:text-light-accent dark:hover:text-dark-accent transition-colors">

                        {comment.name}

                      </p>

                    </Link>

                    <p className="text-xs text-light-secondary dark:text-dark-secondary mt-1">

                      {new Date(
                        comment.created_at
                      ).toLocaleString()}

                    </p>

                    <p className="text-sm text-light-primary dark:text-dark-primary mt-3 whitespace-pre-wrap leading-relaxed">

                      {comment.text}

                    </p>

                  </div>

                </div>

                {/* DELETE */}

                {Number(comment.user_id) === Number(user?.id) && (

                  <button
                    onClick={() =>
                      handleDelete(
                        comment.id
                      )
                    }

                    className="text-red-500 hover:opacity-80 transition-all"
                  >

                    <FiTrash2 className="w-4 h-4" />

                  </button>

                )}

              </div>

            </div>

          )
        )}

      </div>

    </div>
  );
};

export default ChapterComments;