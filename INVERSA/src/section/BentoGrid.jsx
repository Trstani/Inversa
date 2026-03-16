import React from "react";
import { useNavigate } from "react-router-dom";
import CardProjectMini from "../components/CardProjectMini";
import HistoryCarousel from "./design/HistoryCarousel";
import createImg from '../assets/icon/create.png';
import collabImg from '../assets/icon/collab.png';
import heroimg from '../assets/icon/heroimg.jpg';

const BentoGrid = ({
  isAuthenticated,
  totalProjects = 120,
  totalCreators = "1.2k",
  follows = [],
  history = [],
  continueReading = null
}) => {

  const navigate = useNavigate();

  return (
    <section className="py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

          {/* HERO */}
          <div
            className="md:col-span-2 md:row-span-2 rounded-2xl p-6 text-white flex flex-col justify-between shadow-lg bg-cover bg-center relative overflow-hidden"
            style={{ backgroundImage: `url(${heroimg})` }}
          >

            {/* overlay gelap */}
            <div className="absolute inset-0 bg-indigo-800/40"></div>

            {/* content */}
            <div className="relative z-10">

              <h2 className="text-3xl font-bold mb-2">
                Collaborate & Create
              </h2>

              <p className="text-lg opacity-90">
                Join a community of creators. Start your project or contribute
                to others.
              </p>

            </div>

            <div className="flex gap-4 mt-4 relative z-10">

              <div className="bg-white/20 rounded-lg px-4 py-2">
                <span className="text-2xl font-bold">{totalProjects}+</span>
                <span className="ml-2">Projects</span>
              </div>

              <div className="bg-white/20 rounded-lg px-4 py-2">
                <span className="text-2xl font-bold">{totalCreators}</span>
                <span className="ml-2">Creators</span>
              </div>

            </div>

            <button
              onClick={() => navigate("/explore")}
              className="relative z-10 bg-white text-indigo-700 px-6 py-2 rounded-full font-semibold mt-4 self-start hover:bg-opacity-90 transition shadow-md"
            >
              Explore All
            </button>

          </div>

          {/* CREATE */}
          {isAuthenticated ? (
            <div
              onClick={() => navigate("/dashboard/initiator")}
              className="cursor-pointer rounded-2xl p-6 bg-gradient-to-br from-amber-500 to-orange-600 text-white hover:scale-105 transition flex flex-col shadow-lg"
            >

              <div className="h-24 bg-white/10 rounded-xl mb-4 flex items-center justify-center">
                <img src={createImg} alt="create project" className="h-40 w-40 object-contain" />
              </div>

              <h3 className="text-xl font-bold">Create Project</h3>
              <p className="mt-1 text-sm opacity-90">
                Start your own story
              </p>

            </div>
          ) : (
            <div
              onClick={() => navigate("/login")}
              className="cursor-pointer rounded-2xl p-6 bg-gradient-to-br from-gray-700 to-gray-900 text-white hover:scale-105 transition flex flex-col items-center justify-center shadow-lg"
            >
              <h3 className="text-xl font-bold">Sign In</h3>
              <p className="mt-1 text-sm opacity-90">
                to start creating
              </p>
            </div>
          )}

          {/* JOIN */}
          {isAuthenticated ? (
            <div
              onClick={() => navigate("/dashboard/collaborator")}
              className="cursor-pointer rounded-2xl p-6 bg-gradient-to-br from-indigo-600 to-purple-600 text-white hover:scale-105 transition flex flex-col shadow-lg"
            >

              <div className="h-24 bg-white/10 rounded-xl mb-4 flex items-center justify-center">
                <img src={collabImg} alt="join project" className="h-40 w-40 object-contain" />
              </div>

              <h3 className="text-xl font-bold">Join Project</h3>
              <p className="mt-1 text-sm opacity-90">
                Contribute to others
              </p>

            </div>
          ) : (
            <div
              onClick={() => navigate("/register")}
              className="cursor-pointer rounded-2xl p-6 bg-gradient-to-br from-green-600 to-teal-600 text-white hover:scale-105 transition flex flex-col items-center justify-center shadow-lg"
            >
              <h3 className="text-xl font-bold">Sign Up</h3>
              <p className="mt-1 text-sm opacity-90">
                Join the community
              </p>
            </div>
          )}

          {/* FOLLOW */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-md">

            <h4 className="font-semibold text-lg mb-3">
              ⭐ Followed
            </h4>

            {follows.length === 0 ? (
              <p className="text-sm opacity-70">
                Follow stories to see them here
              </p>
            ) : (
              follows.slice(0, 3).map((project, index) => (
                <CardProjectMini
                  key={project.id}
                  project={project}
                  rank={index + 1}
                />
              ))
            )}

          </div>

          {/* HISTORY */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md flex flex-col">

            <h4 className="font-semibold text-lg mb-2 p-4">
              🕘 Recently Read
            </h4>

            <div className="pb-2">
              <HistoryCarousel history={history} />
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default BentoGrid;