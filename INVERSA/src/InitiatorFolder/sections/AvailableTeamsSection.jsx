import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { loadTeams, getMyCreatedTeams, getMyJoinedTeams } from '../../utils/dataManager/teamManager';
import { saveTeamRequest, getUserTeamRequests } from '../../utils/dataManager/teamRequestManager';
import { FiPlus, FiUsers, FiClock, FiCheck } from 'react-icons/fi';
import TeamJoinRequestModal from '../components/TeamJoinRequestModal';

const AvailableTeamsSection = () => {
  const { user } = useAuth();
  const [availableTeams, setAvailableTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRequests, setUserRequests] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [showRequestModal, setShowRequestModal] = useState(false);

  useEffect(() => {
    loadAvailableTeams();
  }, [user?.id]);

  const loadAvailableTeams = async () => {
    setLoading(true);
    try {
      const allTeams = await loadTeams();
      const myCreatedTeams = await getMyCreatedTeams(user?.id);
      const myJoinedTeams = await getMyJoinedTeams(user?.id);
      
      // Filter teams where user is NOT the initiator and NOT already a member
      const myTeamIds = new Set([
        ...myCreatedTeams.map(t => t.id),
        ...myJoinedTeams.map(t => t.id)
      ]);

      const available = allTeams.filter(t => !myTeamIds.has(t.id));
      setAvailableTeams(available);

      // Load user's team requests
      const requests = await getUserTeamRequests(user?.id);
      // ✅ ADDED: Filter out approved requests for teams user is not in
      // This handles the case where user was removed from team
      const validRequests = requests.filter(r => {
        // Keep pending and rejected requests
        if (r.status !== 'approved') return true;
        
        // For approved requests, check if user is still in the team
        const team = allTeams.find(t => t.id === r.teamId);
        if (!team) return false;
        
        const isStillMember = team.collaborators?.some(
          c => c.userId === user?.id && c.status === 'approved'
        );
        
        // If user is not in team anymore, remove the approved request
        return isStillMember;
      });
      
      setUserRequests(validRequests);
    } catch (error) {
      console.error('Error loading available teams:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestToJoin = (team) => {
    setSelectedTeam(team);
    setShowRequestModal(true);
  };

  const handleSubmitRequest = async (formData) => {
    try {
      await saveTeamRequest({
        teamId: selectedTeam.id,
        userId: user.id,
        userName: user.name || "User",
        role: formData.role,
        reason: formData.reason,
      });
      
      await loadAvailableTeams();
      alert('Request sent successfully!');
    } catch (error) {
      console.error('Error sending request:', error);
      throw error;
    }
  };

  const getRequestStatus = (teamId) => {
    return userRequests.find(r => r.teamId === teamId)?.status;
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-light-secondary dark:text-dark-secondary">
          Loading available teams...
        </p>
      </div>
    );
  }

  if (availableTeams.length === 0) {
    return (
      <div className="text-center py-12">
        <FiUsers className="w-12 h-12 mx-auto text-light-secondary dark:text-dark-secondary mb-3 opacity-50" />
        <p className="text-light-secondary dark:text-dark-secondary">
          No available teams at the moment
        </p>
        <p className="text-sm text-light-secondary dark:text-dark-secondary mt-2">
          Create a new team or wait for invitations
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {availableTeams.map(team => {
          const requestStatus = getRequestStatus(team.id);
          
          return (
            <div
              key={team.id}
              className="card p-4 hover:shadow-lg transition-shadow"
            >
              {team.backgroundImage && (
                <div
                  className="w-full h-32 rounded-lg mb-3 bg-cover bg-center"
                  style={{ backgroundImage: `url(${team.backgroundImage})` }}
                />
              )}

              <h3 className="font-semibold text-light-primary dark:text-dark-primary mb-1 truncate">
                {team.title}
              </h3>

              <p className="text-sm text-light-secondary dark:text-dark-secondary mb-4 line-clamp-2">
                {team.description}
              </p>

              <div className="flex items-center gap-1 text-xs text-light-secondary dark:text-dark-secondary mb-4">
                <FiUsers className="w-4 h-4" />
                <span>{team.collaborators?.length || 0} members</span>
              </div>

              {requestStatus === 'pending' ? (
                <button
                  disabled
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-light-surface dark:bg-dark-surface text-light-secondary dark:text-dark-secondary rounded cursor-not-allowed text-sm font-medium"
                >
                  <FiClock className="w-4 h-4" />
                  Request Pending
                </button>
              ) : requestStatus === 'approved' ? (
                <button
                  disabled
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-green-500/20 text-green-600 dark:text-green-400 rounded cursor-not-allowed text-sm font-medium"
                >
                  <FiCheck className="w-4 h-4" />
                  Approved
                </button>
              ) : (
                <button
                  onClick={() => handleRequestToJoin(team)}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-light-accent/10 dark:bg-dark-accent/10 text-light-accent dark:text-dark-accent rounded hover:bg-light-accent/20 dark:hover:bg-dark-accent/20 transition text-sm font-medium"
                >
                  <FiPlus className="w-4 h-4" />
                  Request to Join
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Team Join Request Modal */}
      {selectedTeam && (
        <TeamJoinRequestModal
          isOpen={showRequestModal}
          onClose={() => {
            setShowRequestModal(false);
            setSelectedTeam(null);
          }}
          team={selectedTeam}
          onSubmit={handleSubmitRequest}
        />
      )}
    </>
  );
};

export default AvailableTeamsSection;
