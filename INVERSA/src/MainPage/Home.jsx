import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { loadProjects } from "../utils/dataManager";

import Hero from "../section/Hero";
import ProjectCarousel from "../section/ProjectCarousel";
import RoleAction from "../section/RoleAction";
import Recommendation from "../section/Recommendation";

import { FiTrendingUp, FiHeart } from "react-icons/fi";

const Home = () => {
  const { isAuthenticated } = useAuth();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const data = await loadProjects();
      setProjects(data);
    };
    fetchProjects();
  }, []);

  const trending = [...projects]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 9);

  const mostLiked = [...projects]
    .sort((a, b) => (b.likes || 0) - (a.likes || 0))
    .slice(0, 9);

  return (
    <div className="min-h-screen">
      <Hero />

      {isAuthenticated && <RoleAction />}

      <ProjectCarousel />

      <Recommendation type="trending" projects={trending} />
      
      <Recommendation type="likes" projects={mostLiked} />
    </div>
  );
};

export default Home;