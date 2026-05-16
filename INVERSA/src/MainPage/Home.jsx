import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { apiClient } from '../api/client';

import BentoGrid from "../section/BentoGrid";
import ProjectCarousel from "../section/ProjectCarousel";
import Recommendation from "../section/Recommendation";

const Home = () => {

  const { user, isAuthenticated } = useAuth();

  const [projects, setProjects] = useState([]);
  const [follows, setFollows] = useState([]);
  const [readingHistory, setReadingHistory] = useState([]);
  const [continueReading, setContinueReading] = useState(null);

  useEffect(() => {

    const fetchData = async () => {

      try {
        const response = await apiClient.projects.getPublished();
        const data = response.data || [];
        setProjects(data);

        if (isAuthenticated && user) {

          // FOLLOW - Get user's following projects
          try {
            const followingResponse = await apiClient.users.getFollowing(user.id);
            const followingUsers = followingResponse.data || [];
            
            // Get projects from followed users
            const followedProjects = data.filter(p => 
              followingUsers.some(fu => fu.id === p.initiator_id)
            );
            setFollows(followedProjects.slice(0, 3));
          } catch (err) {
            console.error('Error loading followed projects:', err);
          }

          // HISTORY - Get reading history
          try {
            const historyResponse = await apiClient.readingHistory.getHistory();
            const hist = historyResponse.data || [];
            setReadingHistory(hist.slice(0, 3));
          } catch (err) {
            console.error('Error loading reading history:', err);
          }

          // CONTINUE READING
          try {
            const continueResponse = await apiClient.readingHistory.getContinueReading();
            setContinueReading(continueResponse.data);
          } catch (err) {
            console.error('Error loading continue reading:', err);
          }

        }

      } catch (error) {
        console.error('Error fetching data:', error);
      }

    };

    fetchData();

  }, [isAuthenticated, user]);


  // TRENDING
  const trending = [...projects]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 9);

  // MOST LIKED
  const mostLiked = [...projects]
    .sort((a, b) => (b.likes || 0) - (a.likes || 0))
    .slice(0, 9);

  return (
    <div className="min-h-screen">

      {/* PERSONAL BENTO */}
      <BentoGrid
        isAuthenticated={isAuthenticated}
        totalProjects={projects.length}
        totalCreators="1.2k"

        follows={follows}
        history={readingHistory}
        continueReading={continueReading}
      />

      {/* FEATURED */}
      <ProjectCarousel />

      {/* DISCOVERY */}
      <Recommendation
        type="trending"
        projects={trending}
      />

      <Recommendation
        type="likes"
        projects={mostLiked}
      />

    </div>
  );

};

export default Home;