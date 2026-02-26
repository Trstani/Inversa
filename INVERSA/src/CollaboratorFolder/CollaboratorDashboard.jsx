import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loadProjects, loadCollaborationRequests, updateCollaborationRequest } from '../utils/dataManager';
import { FiSearch, FiCheck, FiX, FiBook, FiClock } from 'react-icons/fi';
import Button from '../components/Button';
import CardProject from '../components/CardProject';

const CollaboratorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [joinedProjects, setJoinedProjects] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [allProjects, setAllProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGenre, setFilterGenre] = useState('all');

  useEffect(() => {
    loadData();
  }, [user?.id]);

  const loadData = async () => {
    setLoading(true);
    const projects = await loadProjects();
    const requests = await loadCollaborationRequests();

    // Get projects user has joined (approved collaborations)
    const userJoinedProjects = projects.filter(p => 
      p.collaborators?.some(c => c.userId === user?.id && c.status === 'approved')
    );
    setJoinedProjects(userJoinedProjects);

    // Get pending requests from user
    const userPendingRequests = requests.filter(r => 
      r.userId === user?.id && r.status === 'pending'
    );
    setPendingRequests(userPendingRequests);

    // Get all projects for discovery (excluding joined ones)
    const availableProjects = projects.filter(p => 
      p.status === 'open' && 
      !p.collaborators?.some(c => c.userId === user?.id) &&
      !userPendingRequests.some(r => r.projectId === p.id)
    );
    setAllProjects(availableProjects);
    setLoading(false);
  };

  const handleCancelRequest = async (requestId) => {
    if (window.confirm('Cancel this collaboration request?')) {
      await updateCollaborationRequest(requestId, 'cancelled');
      await loadData();
    }
  };

  const filteredProjects = allProjects.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         p.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = filterGenre === 'all' || p.genre === filterGenre;
    return matchesSearch && matchesGenre;
  });

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-light-background dark:bg-dark-background py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-light-primary dark:text-dark-primary mb-2">
            Collaborator Dashboard
          </h1>
          <p className="text-light-secondary dark:text-dark-secondary">
            Discover and join collaborative writing projects
          </p>
        </div>

        {/* Pending Requests Section */}
        {pendingRequests.length > 0 && (
          <div className="card p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <FiClock /> Pending Requests ({pendingRequests.length})
            </h2>
            <div className="space-y-4">
              {pendingRequests.map((request) => {
                const project = allProjects.find(p => p.id === request.projectId) || 
                               joinedProjects.find(p => p.id === request.projectId);
                return (
                  <div key={request.id} className="flex items-center justify-between p-4 bg-light-surface dark:bg-dark-surface rounded-lg">
                    <div>
                      <p className="font-semibold">{project?.title || 'Unknown Project'}</p>
                      <p className="text-sm text-light-secondary dark:text-dark-secondary">
                        Requested as: <span className="font-medium">{request.requestedRole}</span>
                      </p>
                      <p className="text-xs text-light-secondary dark:text-dark-secondary">
                        Waiting for initiator approval...
                      </p>
                    </div>
                    <button
                      onClick={() => handleCancelRequest(request.id)}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
                    >
                      Cancel Request
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Joined Projects Section */}
        {joinedProjects.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <FiBook /> My Projects ({joinedProjects.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {joinedProjects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => navigate(`/project/${project.id}`)}
                  className="cursor-pointer"
                >
                  <CardProject project={project} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Discover Projects Section */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Discover Projects</h2>

          {/* Search & Filter */}
          <div className="card p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <FiSearch className="absolute left-3 top-3 text-light-secondary dark:text-dark-secondary" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-light-border dark:border-dark-border rounded-lg bg-white dark:bg-dark-surface"
                />
              </div>
              <select
                value={filterGenre}
                onChange={(e) => setFilterGenre(e.target.value)}
                className="px-4 py-2 border border-light-border dark:border-dark-border rounded-lg bg-white dark:bg-dark-surface"
              >
                <option value="all">All Genres</option>
                <option value="adventure">Adventure</option>
                <option value="comedy">Comedy</option>
                <option value="horror">Horror</option>
                <option value="romance">Romance</option>
                <option value="scifi">Sci-Fi</option>
              </select>
            </div>
          </div>

          {/* Projects Grid */}
          {filteredProjects.length === 0 ? (
            <div className="card p-8 text-center">
              <p className="text-light-secondary dark:text-dark-secondary mb-4">
                {allProjects.length === 0 
                  ? 'No projects available to join right now.' 
                  : 'No projects match your search.'}
              </p>
              {allProjects.length === 0 && (
                <Button onClick={() => navigate('/explore')}>
                  Explore More Projects
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => navigate(`/project/${project.id}`)}
                  className="cursor-pointer"
                >
                  <CardProject project={project} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CollaboratorDashboard;
