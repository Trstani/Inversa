import { useState, useEffect } from 'react';
import { uploadImage } from "../utils/uploadImage";
import { deleteStorageFile } from "../utils/storage";

import {
  useNavigate,
  useParams,
} from 'react-router-dom';

import {
  FiArrowLeft,
  FiCamera,
  FiMail,
  FiCalendar,
  FiEdit2,
  FiLogOut,
  FiBookOpen,
  FiUsers,
  FiHeart,
  FiClock,
  FiStar,
  FiX,
} from 'react-icons/fi';

import {
  useAuth,
} from '../context/AuthContext';

import {
  apiClient,
} from '../api/client';

import CardProject from '../components/CardProject';
import TeamCard from '../components/TeamCard';

import FollowedList from "../section/design/FollowedList";
import HistoryList from "../section/design/HistoryList";
import { validateImage } from "../utils/imageValidation";
import { showError } from '../utils/toast';

const UserProfile = () => {

  /*
  =========================
  HOOKS
  =========================
  */

  const navigate =
    useNavigate();

  const { user, logout } =
    useAuth();

  const { id } =
    useParams();

  /*
  =========================
  PROFILE TARGET
  =========================
  */

  const profileUserId =
    id || user?.id;

  const isOwnProfile =
    !id ||

    Number(id) ===
    Number(user?.id);

  /*
  =========================
  STATES
  =========================
  */

  const [
    profileData,
    setProfileData,
  ] = useState(null);

  const [
    editData,
    setEditData,
  ] = useState({});

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    isEditing,
    setIsEditing,
  ] = useState(false);

  const [
    follows,
    setFollows,
  ] = useState([]);

  const [
    history,
    setHistory,
  ] = useState([]);

  /*
  =========================
  LOAD PROFILE
  =========================
  */

  useEffect(() => {

    if (!user) {

      navigate('/login');

      return;
    }

    loadProfile();

  }, [user, id]);

  const loadProfile =
    async () => {

      try {

        setLoading(true);

        /*
        =========================
        USER
        =========================
        */

        const response =
          await apiClient.users.getById(
            profileUserId
          );

        const data =
          response.data;

        /*
        =========================
        PROJECTS
        =========================
        */

        const projectsResponse =
          await apiClient.projects.getAll();

        const userProjects =
          (projectsResponse.data || []).filter(
            (p) =>
              Number(p.initiator_id) ===
              Number(profileUserId)

              &&

              !p.team_id
          );

        /*
        =========================
        TEAMS
        =========================
        */

        const teamsResponse =
          await apiClient.teams.getUserTeams(
            profileUserId
          );

        const userTeams =
          teamsResponse.data || [];

        /*=========================
              FOLLOWS
          =========================*/

        try {

          const followResponse =
            await apiClient.projects
              .getUserFollows(profileUserId);

          setFollows(
            followResponse.data || []
          );

        } catch (error) {

          console.error(error);
        }

        /*
        =========================
        READING HISTORY
        =========================
        */

        try {

          const historyResponse =
            await apiClient
              .readingHistory
              .getUserHistory(profileUserId);

          setHistory(
            historyResponse.data || []
          );

        } catch (error) {

          console.error(error);
        }

        /*
        =========================
        SET PROFILE
        =========================
        */

        setProfileData({

          ...data,

          projects:
            userProjects,

          teams:
            userTeams,

          project_count:
            userProjects.length,

          team_count:
            userTeams.length,

          follower_count:
            0,
        });

        setEditData(data);

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);
      }
    };

  /*
=========================
IMAGE CHANGE
=========================
*/

const handleImageChange =
  async (e) => {

    const file =
      e.target.files?.[0];

    if(!file)
      return;

    const validation =
      validateImage(
        file
      );

    if(
      !validation.valid
    ){
      showError(
        validation.message
      );

      return;
    }

    try{

      const oldImage =
        profileData?.profile_image;

      const imageUrl =
        await uploadImage(
          file
        );

      const response =
        await apiClient
          .users
          .update(
            user.id,
            {

              ...profileData,

              profile_image:
                imageUrl

            }
          );

      if(
        response.success
      ){

        if(
          oldImage
        ){

          await deleteStorageFile(
            oldImage
          );

        }

        setProfileData({

          ...profileData,

          profile_image:
            imageUrl

        });

        setEditData({

          ...editData,

          profile_image:
            imageUrl

        });

      }

    }catch(error){

      console.error(
        error
      );

      showError(
        "Failed to update profile image"
      );

    }

};

  /*
  =========================
  SAVE PROFILE
  =========================
  */

  const handleSave =
    async () => {

      try {

        const response =
          await apiClient.users.update(
            user.id,
            editData
          );

        if (response.success) {

          setProfileData({

            ...profileData,

            ...response.data,
          });

          setIsEditing(false);
        }

      } catch (error) {

        console.error(error);

        showError(
          'Failed to save profile'
        );
      }
    };

  /*
  =========================
  LOGOUT
  =========================
  */

  const handleLogout =
    () => {

      logout();

      navigate('/login');
    };

  /*
  =========================
  LOADING
  =========================
  */

  if (loading) {

    return (

      <div className="min-h-screen flex items-center justify-center bg-light-background dark:bg-dark-background">

        <div className="w-10 h-10 border-4 border-light-accent/30 border-t-light-accent dark:border-dark-accent/30 dark:border-t-dark-accent rounded-full animate-spin" />

      </div>
    );
  }

  /*
  =========================
  NOT FOUND
  =========================
  */

  if (!profileData) {

    return (

      <div className="min-h-screen flex items-center justify-center bg-light-background dark:bg-dark-background">

        <p className="text-light-secondary dark:text-dark-secondary">
          Profile not found
        </p>

      </div>
    );
  }

  /*
  =========================
  RENDER
  =========================
  */

  return (

    <div className="min-h-screen bg-light-background dark:bg-dark-background py-6 sm:py-8 px-4 sm:px-6">

      <div className="max-w-5xl mx-auto">

        {/* BACK BUTTON */}

        <button
          onClick={() =>
            navigate(-1)
          }
          className="inline-flex items-center gap-2 mb-6 sm:mb-8 text-sm font-medium text-light-secondary dark:text-dark-secondary hover:text-light-accent dark:hover:text-dark-accent transition-colors"
        >

          <FiArrowLeft className="w-4 h-4" />

          Back

        </button>

        {/* HERO SECTION */}

        <div className="rounded-2xl sm:rounded-3xl border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface p-6 sm:p-8 mb-8">

          <div className="flex flex-col sm:flex-row items-start gap-6 sm:gap-8">

            {/* AVATAR */}

            <div className="relative group shrink-0">

              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl border-4 border-light-accent/20 dark:border-dark-accent/20 shadow-lg overflow-hidden bg-gradient-to-br from-light-accent/10 to-light-accent/5 dark:from-dark-accent/10 dark:to-dark-accent/5 flex items-center justify-center">

                {profileData.profile_image ? (

                  <img
                    src={profileData.profile_image}
                    alt="Profile"

                    className="w-full h-full object-cover"
                  />

                ) : (

                  <span className="text-4xl sm:text-5xl font-bold text-light-accent/40 dark:text-dark-accent/40">

                    {profileData.name?.charAt(0)?.toUpperCase()}

                  </span>

                )}

              </div>

              {isOwnProfile && (

                <label className="absolute bottom-0 right-0 p-2 bg-light-accent dark:bg-dark-accent rounded-lg text-white cursor-pointer shadow-lg hover:opacity-90 transition-opacity">

                  <FiCamera className="w-4 h-4" />

                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    onChange={handleImageChange}
                    className="hidden"
                  />

                </label>

              )}

            </div>

            {/* INFO */}

            <div className="flex-1 min-w-0">

              <h1 className="text-2xl sm:text-3xl font-bold text-light-primary dark:text-dark-primary mb-2">

                {profileData.name}

              </h1>

              <div className="flex flex-col gap-2 text-sm text-light-secondary dark:text-dark-secondary mb-4">

                <div className="flex items-center gap-2">

                  <FiMail className="w-4 h-4 text-light-accent dark:text-dark-accent shrink-0" />

                  <span className="truncate">
                    {profileData.email}
                  </span>

                </div>

                <div className="flex items-center gap-2">

                  <FiCalendar className="w-4 h-4 text-light-accent dark:text-dark-accent shrink-0" />

                  <span>

                    Joined {' '}

                    {new Date(
                      profileData.created_at ||
                      profileData.createdAt
                    ).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}

                  </span>

                </div>

              </div>

              {/* BIO */}

              {isEditing ? (

                <div className="space-y-4">

                  <input
                    type="text"
                    value={editData.name || ''}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        name: e.target.value
                      })
                    }
                    placeholder="Name"
                    className="
        w-full p-3 rounded-xl
        bg-light-background
        dark:bg-dark-background
        border border-light-border
        dark:border-dark-border
      "
                  />

                  <textarea
                    value={editData.bio || ''}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        bio: e.target.value
                      })
                    }
                    placeholder="Write your bio..."
                    rows={4}
                    className="
        w-full p-3 rounded-xl
        bg-light-background
        dark:bg-dark-background
        border border-light-border
        dark:border-dark-border
        resize-none
      "
                  />

                  <button
                    onClick={handleSave}
                    className="
        px-4 py-2 rounded-lg
        bg-green-500
        text-white
      "
                  >
                    Save
                  </button>

                </div>

              ) : (

                profileData.bio && (

                  <div className="p-4 rounded-xl bg-light-accent/5 dark:bg-dark-accent/5 border border-light-accent/10 dark:border-dark-accent/10">

                    <p className="text-sm leading-relaxed text-light-primary dark:text-dark-primary">

                      {profileData.bio}

                    </p>

                  </div>

                )

              )}
            </div>

          </div>

          {/* STATS */}

          <div className="grid grid-cols-3 gap-3 sm:gap-4 mt-8 pt-8 border-t border-light-border dark:border-dark-border">

            {[
              {
                icon: FiBookOpen,
                value: profileData.project_count,
                label: 'Projects',
              },

              {
                icon: FiUsers,
                value: profileData.team_count,
                label: 'Teams',
              },

              {
                icon: FiHeart,
                value: profileData.follower_count,
                label: 'Followers',
              },

            ].map((stat, idx) => (

              <div
                key={idx}

                className="flex flex-col items-center p-3 sm:p-4 rounded-xl bg-light-background dark:bg-dark-background"
              >

                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-light-accent/10 dark:bg-dark-accent/10 text-light-accent dark:text-dark-accent mb-2">

                  <stat.icon className="w-4 h-4" />

                </div>

                <span className="text-xl sm:text-2xl font-bold text-light-primary dark:text-dark-primary">

                  {stat.value}

                </span>

                <span className="text-xs text-light-secondary dark:text-dark-secondary mt-1">

                  {stat.label}

                </span>

              </div>

            ))}

          </div>

          {/* ACTIONS */}

          {isOwnProfile && (

            <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-8 border-t border-light-border dark:border-dark-border">

              <button
                onClick={() =>
                  setIsEditing(!isEditing)
                }

                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-light-accent dark:bg-dark-accent text-white font-medium hover:opacity-90 transition-opacity"
              >

                <FiEdit2 className="w-4 h-4" />

                {isEditing
                  ? 'Close'
                  : 'Edit Profile'}

              </button>

              <button
                onClick={handleLogout}

                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-red-500/10 dark:bg-red-500/10 text-red-600 dark:text-red-400 font-medium hover:bg-red-500/20 transition-colors"
              >

                <FiLogOut className="w-4 h-4" />

                Logout

              </button>

            </div>

          )}

        </div>

        {/* PERSONAL SECTIONS */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">

          {/* FOLLOWED */}

          <div
            className="
              rounded-2xl sm:rounded-3xl
              border border-light-border
              dark:border-dark-border
              bg-light-surface dark:bg-dark-surface
              p-6 sm:p-8 flex flex-col
            "
          >

            <h4
              className="
                mb-6 flex items-center gap-2
                text-sm font-semibold
                uppercase tracking-wide
                text-light-secondary
                dark:text-dark-secondary
              "
            >

              <FiStar className="h-4 w-4 text-light-accent dark:text-dark-accent" />

              Followed Projects

            </h4>

            <div className="flex-1 min-h-0">

              <FollowedList
                followedProjects={follows}
              />

            </div>

          </div>

          {/* HISTORY */}


          <div className="rounded-2xl sm:rounded-3xl border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface p-6 sm:p-8 flex flex-col">

            <h4 className="mb-6 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-light-secondary dark:text-dark-secondary">

              <FiClock className="h-4 w-4 text-light-accent dark:text-dark-accent" />Recently Read

            </h4>

            <div className="flex-1 min-h-0">

              {isOwnProfile ? (
                <HistoryList historyItems={history} />
              ) : (
                <p className="text-sm text-light-secondary dark:text-dark-secondary">
                  History is not public
                </p>
              )}

            </div>

          </div>



        </div>

        {/* CONTENT SECTIONS */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* PROJECTS */}

          <div>

            <div className="mb-6">

              <h2 className="text-xl font-bold text-light-primary dark:text-dark-primary flex items-center gap-2">

                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-light-accent/10 dark:bg-dark-accent/10 text-light-accent dark:text-dark-accent">

                  <FiBookOpen className="w-4 h-4" />

                </div>

                Projects

              </h2>

            </div>

            {profileData.projects?.length > 0 ? (

              <div className="space-y-4">

                {profileData.projects.map(
                  (project) => (

                    <CardProject
                      key={project.id}

                      project={project}
                    />

                  )
                )}

              </div>

            ) : (

              <EmptyState
                icon={FiBookOpen}
                message="No projects yet."
              />

            )}

          </div>

          {/* TEAMS */}

          <div>

            <div className="mb-6">

              <h2 className="text-xl font-bold text-light-primary dark:text-dark-primary flex items-center gap-2">

                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-light-accent/10 dark:bg-dark-accent/10 text-light-accent dark:text-dark-accent">

                  <FiUsers className="w-4 h-4" />

                </div>

                Teams

              </h2>

            </div>

            {profileData.teams?.length > 0 ? (

              <div className="space-y-4">

                {profileData.teams.map(
                  (team) => (

                    <TeamCard
                      key={team.id}

                      team={team}
                    />

                  )
                )}

              </div>

            ) : (

              <EmptyState
                icon={FiUsers}
                message="No teams joined."
              />

            )}

          </div>

        </div>

      </div>

    </div>
  );
};

const EmptyState = ({
  icon: Icon,
  message,
}) => (

  <div className="rounded-xl border-2 border-dashed border-light-border dark:border-dark-border p-8 sm:p-12 text-center">

    <Icon className="w-10 h-10 mx-auto mb-3 text-light-secondary/40 dark:text-dark-secondary/40" />

    <p className="text-light-secondary dark:text-dark-secondary font-medium">

      {message}

    </p>

  </div>
);

export default UserProfile;