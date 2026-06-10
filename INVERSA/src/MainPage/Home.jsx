import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { apiClient } from '../api/client';

import BentoGrid from "../section/BentoGrid";
import ProjectCarousel from "../section/ProjectCarousel";
import Recommendation from "../section/Recommendation";
import HomeTutorial from "../components/tutorial/HomeTutorial";

const Home = () => {

  const { user, isAuthenticated } = useAuth();

  const [projects, setProjects] = useState([]);
  const [follows, setFollows] = useState([]);
  const [readingHistory, setReadingHistory] = useState([]);
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

// Fungsi async untuk membuka menu dan menunggu animasi selesai
const handleOpenMobileMenu = () => {
  return new Promise((resolve) => {
    setMobileMenuOpen(true);
    // Sesuaikan timeout dengan durasi animasi buka menu (misal 350ms)
    setTimeout(resolve, 350);
  });
};

// Fungsi untuk menutup menu
const handleCloseMobileMenu = () => {
  setMobileMenuOpen(false);
};
 
  useEffect(() => {

    const done =
      localStorage.getItem(
        'inversa_home_tutorial'
      );

    if (!done) {
      setShowTutorial(true);
    }

  }, []);

  useEffect(() => {

    const fetchData = async () => {

      try {
        const response = await apiClient.projects.getPublished();
        const data = response.data || [];
        setProjects(data);

        if (isAuthenticated && user) {

          // FOLLOWED PROJECTS
          try {

            const followResponse =
              await apiClient.projects
                .getMyFollows();

            setFollows(
              followResponse.data || []
            );

          } catch (err) {

            console.error(
              "Error loading follows:",
              err
            );
          }

          // HISTORY - Get reading history
          try {
            const historyResponse = await apiClient.readingHistory.getHistory();
            const hist = historyResponse.data || [];
            setReadingHistory(hist.slice(0, 3));
          } catch (err) {
            console.error('Error loading reading history:', err);
          }

        }

      } catch (error) {
        console.error('Error fetching data:', error);
      }

    };

    fetchData();

  }, [isAuthenticated, user]);

  const handleTutorialNext =
  () => {

    if (
      tutorialStep >= 6
    ) {

      localStorage.setItem(
        'inversa_home_tutorial',
        'done'
      );

      setShowTutorial(false);

      return;
    }

    setTutorialStep(
      prev => prev + 1
    );

  };

  const handleTutorialSkip =
  () => {

    localStorage.setItem(
      'inversa_home_tutorial',
      'done'
    );

    setShowTutorial(false);

  };
  const handleTutorialPrevious = () => {
    if (tutorialStep > 0) setTutorialStep(prev => prev - 1);
  };



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
      {
        showTutorial && (

          <HomeTutorial
            step={tutorialStep}
            onNext={handleTutorialNext}
            onSkip={handleTutorialSkip}
            onPrevious={handleTutorialPrevious}
            openMobileMenu={handleOpenMobileMenu}
            closeMobileMenu={handleCloseMobileMenu}
          />

        )
      }

    </div>
    
  );

};

export default Home;