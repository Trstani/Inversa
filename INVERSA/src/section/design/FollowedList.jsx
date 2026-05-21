import React from "react";

import FollowedProjectItem
from "../../components/FollowedProjectItem";

export default function FollowedList({
  followedProjects = [],
}) {

  if (
    followedProjects.length === 0
  ) {

    return (
      <p className="text-sm text-slate-500">
        Projects you follow will appear here
      </p>
    );
  }

  return (

    <div
      className="
        max-h-[260px]
        space-y-3
        overflow-y-auto
        pr-1
      "
    >

      {followedProjects.map(
        (project) => (

          <FollowedProjectItem
            key={project.id}
            project={project}
          />

        )
      )}

    </div>
  );
}