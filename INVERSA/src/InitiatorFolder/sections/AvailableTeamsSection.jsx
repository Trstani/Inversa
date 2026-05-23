import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiClient } from '../../api/client';
import { FiUsers } from 'react-icons/fi';
import TeamCard from '../../components/TeamCard';
import TeamJoinRequestModal from '../components/TeamJoinRequestModal';

const AvailableTeamsSection = () => {
  const { user } = useAuth();
  const [availableTeams, setAvailableTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRequests, setUserRequests] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [showRequestModal, setShowRequestModal] = useState(false);

  useEffect(() => { if (user?.id) loadAvailableTeams(); }, [user?.id]);

  const loadAvailableTeams = async () => {
    setLoading(true);
    try {
      const allTeams = (await apiClient.teams.getAll()).data || [];
      const available = allTeams.filter(team => Number(team.initiator_id) !== Number(user.id)); 
      
      setAvailableTeams(available);

      let requests = [];
      for (const team of allTeams) {
        try {
          const res = await apiClient.teams.getRequests(team.id);
          const teamRequests = res.data || [];
          const myReqs = teamRequests.filter(r => Number(r.user_id) === Number(user.id));
          requests.push(...myReqs);
        } catch (err) { console.error(err); }
      }
      setUserRequests(requests);
    } catch (error) { console.error('Error loading available teams:', error); }
    finally { setLoading(false); }
  };

  const handleRequestToJoin = (team) => { setSelectedTeam(team); setShowRequestModal(true); };

  const handleSubmitRequest = async (formData) => {
    try {
      await apiClient.teams.createRequest({ team_id: selectedTeam.id, role: formData.role, reason: formData.reason });
      await loadAvailableTeams();
      alert('Request sent successfully!');
    } catch (error) { console.error('Error sending request:', error); throw error; }
  };

  const getRequestStatus = (teamId) => userRequests.find(r => Number(r.team_id) === Number(teamId))?.status;

  if (loading) return <div className="text-center py-12"><p className="text-light-secondary dark:text-dark-secondary">Loading available teams...</p></div>;
  if (availableTeams.length === 0) return (
    <div className="text-center py-12">
      <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-light-accent/10 dark:bg-dark-accent/10 mx-auto mb-4">
        <FiUsers className="w-8 h-8 sm:w-10 sm:h-10 text-light-secondary dark:text-dark-secondary opacity-60" />
      </div>
      <p className="text-light-primary dark:text-dark-primary font-medium text-base sm:text-lg">No available teams at the moment</p>
      <p className="text-sm text-light-secondary dark:text-dark-secondary mt-2">Create a new team or wait for invitations</p>
    </div>
  );

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
        {availableTeams.map(team => {
          const status = getRequestStatus(team.id);
          return (
            <TeamCard
              key={team.id}
              team={team}
              requestStatus={status}
              onRequestToJoin={handleRequestToJoin}
              showRequestStatus={true}
            />
          );
        })}
      </div>
      {selectedTeam && (
        <TeamJoinRequestModal
          isOpen={showRequestModal}
          onClose={() => { setShowRequestModal(false); setSelectedTeam(null); }}
          team={selectedTeam}
          onSubmit={handleSubmitRequest}
        />
      )}
    </>
  );
};

export default AvailableTeamsSection;