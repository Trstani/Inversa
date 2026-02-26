import React from "react";
import { useNavigate } from "react-router-dom";

const RoleAction = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-8">

        {/* Create Project */}
        <div
          onClick={() => navigate("/dashboard/initiator")}
          className="cursor-pointer rounded-2xl p-10 bg-gradient-to-br from-light-accent to-indigo-600 text-white hover:scale-105 transition"
        >
          <div className="h-40 bg-white/10 rounded-xl mb-6 flex items-center justify-center">
            <span>Create Illustration</span>
          </div>
          <h3 className="text-2xl font-bold">Create Project</h3>
          <p className="mt-2 opacity-90">
            Start your own collaborative story as an Initiator.
          </p>
        </div>

        {/* Join Project */}
        <div
          onClick={() => navigate("/dashboard/collaborator")}
          className="cursor-pointer rounded-2xl p-10 bg-gradient-to-br from-indigo-600 to-purple-600 text-white hover:scale-105 transition"
        >
          <div className="h-40 bg-white/10 rounded-xl mb-6 flex items-center justify-center">
            <span>Join Illustration</span>
          </div>
          <h3 className="text-2xl font-bold">Join Project</h3>
          <p className="mt-2 opacity-90">
            Contribute to existing projects as a collaborator.
          </p>
        </div>

      </div>
    </section>
  );
};

export default RoleAction;
