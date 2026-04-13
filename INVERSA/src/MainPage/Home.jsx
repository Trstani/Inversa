import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

import {
  loadPublishedProjects
} from '../utils/dataManager/projectManager';
import {
  loadFollowedProjects
} from '../utils/dataManager/projectFollowManager';
import {
  loadReadingHistory,
  getContinueReading
} from '../utils/dataManager/readingHistoryManager';

import BentoGrid from "../section/BentoGrid";
import ProjectCarousel from "../section/ProjectCarousel";
import Recommendation from "../section/Recommendation";

const Home = () => {

  const { user, isAuthenticated } = useAuth();

  const [projects, setProjects] = useState([]);
  const [follows, setFollows] = useState([]);
  const [history, setHistory] = useState([]);
  const [continueReading, setContinueReading] = useState(null);

  useEffect(() => {

    const fetchData = async () => {

      const data = await loadPublishedProjects();
      setProjects(data);

      if (isAuthenticated && user) {

        // FOLLOW
        const followed = await loadFollowedProjects(user.id);
        setFollows(followed.slice(0, 3));

        // HISTORY
        const hist = await loadReadingHistory(user.id);
        setHistory(hist.slice(0, 3));

        // CONTINUE READING
        const cont = await getContinueReading(user.id);
        setContinueReading(cont);

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
        history={history}
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