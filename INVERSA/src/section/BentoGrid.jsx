import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FiPlus,
  FiStar,
  FiClock,
  FiLogIn,
  FiUserPlus,
  FiUserCheck,
  FiArrowRight,
  FiAward,
} from "react-icons/fi";
import CardProjectMini from "../components/CardProjectMini";
import HistoryCarousel from "./design/HistoryCarousel";
import createImg from "../assets/icon/create.png";
import collabImg from "../assets/icon/collab.png";
import heroimg from "../assets/icon/heroimg.jpg";

const BentoGrid = ({
  isAuthenticated,
  totalProjects = 120,
  totalCreators = "1.2k",
  follows = [],
  history = [],
  continueReading = null,
}) => {
  const navigate = useNavigate();

  return (
    <section className="py-10 md:py-16 relative">
      {/* Latar belakang modern: gradient mesh + blur bulatan */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 -left-20 w-[500px] h-[500px] bg-purple-300/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-amber-200/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {/* HERO – glass overlay & animated border */}
          <div className="sm:col-span-2 sm:row-span-2 relative rounded-3xl overflow-hidden group shadow-2xl shadow-indigo-500/10">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage: `url(${heroimg})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/70 via-indigo-800/60 to-purple-900/50 backdrop-blur-[2px]" />

            <div className="relative z-10 flex flex-col justify-between h-full p-6 md:p-8">
              <div>
                <span className="inline-flex items-center gap-1 px-3 py-1 mb-4 text-xs font-medium bg-white/20 backdrop-blur-md rounded-full text-white/90">
                  <FiAward className="w-3.5 h-3.5" />
                  Platform Kolaborasi #1
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-3">
                  Collaborate <br className="hidden sm:block" />& Create
                </h2>
                <p className="text-white/80 text-sm md:text-base max-w-md">
                  Join a community of creators. Start your project or contribute
                  to others.
                </p>
              </div>

              <div>
                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl px-4 py-3 border border-white/10">
                    <span className="text-2xl font-bold text-white">
                      {totalProjects}+
                    </span>
                    <span className="ml-2 text-sm text-white/70">Projects</span>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl px-4 py-3 border border-white/10">
                    <span className="text-2xl font-bold text-white">
                      {totalCreators}
                    </span>
                    <span className="ml-2 text-sm text-white/70">Creators</span>
                  </div>
                </div>
                <button
                  onClick={() => navigate("/explore")}
                  className="inline-flex items-center gap-1 bg-white text-indigo-700 px-6 py-3 rounded-full font-semibold hover:bg-opacity-90 transition-all hover:shadow-lg hover:scale-105 active:scale-95 text-sm"
                >
                  Explore All
                  <FiArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="absolute inset-0 rounded-3xl pointer-events-none border-2 border-transparent group-hover:border-white/20 transition-colors duration-500" />
          </div>

          {/* CREATE / SIGN IN */}
          {isAuthenticated ? (
            <div
              onClick={() => navigate("/dashboard/initiator")}
              className="cursor-pointer rounded-3xl p-5 md:p-6 bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 transition-all duration-300 hover:-translate-y-1 active:scale-[0.98] flex flex-col group"
            >
              <div className="h-20 md:h-24 bg-white/10 backdrop-blur-sm rounded-2xl mb-5 flex items-center justify-center transition-transform group-hover:scale-105">
                <img
                  src={createImg}
                  alt="create project"
                  className="h-28 md:h-32 w-28 md:w-32 object-contain drop-shadow-lg"
                />
              </div>
              <h3 className="text-xl font-bold">Create Project</h3>
              <p className="mt-1 text-sm text-white/80">Start your own story</p>
              <div className="mt-4 flex justify-end">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/20 text-white group-hover:bg-white/30 transition-colors">
                  <FiPlus className="w-4 h-4" />
                </span>
              </div>
            </div>
          ) : (
            <div
              onClick={() => navigate("/login")}
              className="cursor-pointer rounded-3xl p-5 md:p-6 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 active:scale-[0.98] flex flex-col items-center justify-center text-center"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-500 rounded-full mb-4 flex items-center justify-center text-white">
                <FiLogIn className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                Sign In
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                to start creating
              </p>
            </div>
          )}

          {/* JOIN / SIGN UP */}
          {isAuthenticated ? (
            <div
              onClick={() => navigate("/dashboard/collaborator")}
              className="cursor-pointer rounded-3xl p-5 md:p-6 bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 transition-all duration-300 hover:-translate-y-1 active:scale-[0.98] flex flex-col group"
            >
              <div className="h-20 md:h-24 bg-white/10 backdrop-blur-sm rounded-2xl mb-5 flex items-center justify-center transition-transform group-hover:scale-105">
                <img
                  src={collabImg}
                  alt="join project"
                  className="h-28 md:h-32 w-28 md:w-32 object-contain drop-shadow-lg"
                />
              </div>
              <h3 className="text-xl font-bold">Join Project</h3>
              <p className="mt-1 text-sm text-white/80">
                Contribute to others
              </p>
              <div className="mt-4 flex justify-end">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/20 text-white group-hover:bg-white/30 transition-colors">
                  <FiUserCheck className="w-4 h-4" />
                </span>
              </div>
            </div>
          ) : (
            <div
              onClick={() => navigate("/register")}
              className="cursor-pointer rounded-3xl p-5 md:p-6 bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-teal-500/20 hover:shadow-teal-500/30 transition-all duration-300 hover:-translate-y-1 active:scale-[0.98] flex flex-col items-center justify-center text-center"
            >
              <div className="w-12 h-12 bg-white/20 rounded-full mb-4 flex items-center justify-center text-white">
                <FiUserPlus className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">Sign Up</h3>
              <p className="mt-1 text-sm text-white/80">Join the community</p>
            </div>
          )}

          {/* FOLLOWED – Glass card */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-5 shadow-xl shadow-gray-200/50 dark:shadow-gray-900/30 border border-white/20 dark:border-gray-700/50">
            <h4 className="font-semibold text-lg mb-4 flex items-center gap-2 text-gray-800 dark:text-gray-100">
              <FiStar className="w-5 h-5 text-amber-500" />
              Followed
            </h4>
            {follows.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Follow stories to see them here
              </p>
            ) : (
              <div className="space-y-3">
                {follows.slice(0, 3).map((project, index) => (
                  <CardProjectMini
                    key={project.id}
                    project={project}
                    rank={index + 1}
                  />
                ))}
              </div>
            )}
          </div>

          {/* HISTORY – Glass card */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-5 shadow-xl shadow-gray-200/50 dark:shadow-gray-900/30 border border-white/20 dark:border-gray-700/50 flex flex-col">
            <h4 className="font-semibold text-lg mb-3 flex items-center gap-2 text-gray-800 dark:text-gray-100">
              <FiClock className="w-5 h-5 text-indigo-500" />
              Recently Read
            </h4>
            <div className="flex-1 min-h-0">
              <HistoryCarousel history={history} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BentoGrid;