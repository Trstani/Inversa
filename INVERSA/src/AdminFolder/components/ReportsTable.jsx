import { useState } from "react";
import { apiClient } from "../../api/client";

const ReportsTable = ({
  reports,
  reloadReports,
}) => {

  const [search, setSearch] =
    useState("");

  const [expandedProject, setExpandedProject] =
    useState(null);

  /*
  =========================
  GROUP REPORTS BY PROJECT
  =========================
  */

  const groupedReports =
    Object.values(

      reports.reduce(
        (acc, report) => {

          const title =
            report.project_title ||
            "Unknown Project";

          if (!acc[title]) {

            acc[title] = {

              project_id:
                report.project_id,

              project_title:
                title,

              total_reports: 0,

              last_report:
                report.created_at,

              hidden:
                report.hidden || false,

              reports: [],
            };
          }

          acc[title]
            .total_reports++;

          acc[title]
            .reports
            .push(report);

          /*
          =========================
          UPDATE LAST REPORT
          =========================
          */

          if (
            new Date(
              report.created_at
            ) >

            new Date(
              acc[title]
                .last_report
            )
          ) {

            acc[title]
              .last_report =
              report.created_at;
          }

          return acc;

        },
        {}
      )
    );

  /*
  =========================
  FILTER
  =========================
  */

  const filteredReports =
    groupedReports.filter(
      (group) =>

        group.project_title
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );

  /*
  =========================
  HIDE PROJECT
  =========================
  */

  const handleHideProject =
    async (projectId) => {

      try {

        await apiClient.projects.hide(
          projectId
        );

        alert(
          "Project hidden"
        );

        reloadReports();

      } catch (error) {

        console.error(error);

        alert(
          "Failed to hide project"
        );
      }
    };

  /*
  =========================
  RESTORE PROJECT
  =========================
  */

  const handleRestoreProject =
    async (projectId) => {

      try {

        await apiClient.projects.unhide(
          projectId
        );

        alert(
          "Project restored"
        );

        reloadReports();

      } catch (error) {

        console.error(error);

        alert(
          "Failed to restore project"
        );
      }
    };

  return (

    <div>

      {/* SEARCH */}

      <input
        type="text"
        placeholder="Search project title..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        className="
          w-full
          mb-4
          p-3
          border
          rounded-lg
          dark:bg-dark-background
        "
      />

      {/* TABLE */}

      <table className="w-full border">

        <thead>

          <tr>

            <th className="p-3 border">
              Project
            </th>

            <th className="p-3 border">
              Reports
            </th>

            <th className="p-3 border">
              Last Report
            </th>

            <th className="p-3 border">
              Status
            </th>

            <th className="p-3 border">
              Action
            </th>

          </tr>

        </thead>

        <tbody>

          {filteredReports.map(
            (group, index) => (

              <>
                {/* MAIN ROW */}

                <tr
                  key={index}
                  className="text-center"
                >

                  <td className="p-3 border">
                    {group.project_title}
                  </td>

                  <td className="p-3 border">
                    {group.total_reports}
                  </td>

                  <td className="p-3 border">

                    {new Date(
                      group.last_report
                    ).toLocaleDateString()}

                  </td>

                  <td className="p-3 border">

                    {group.hidden ? (

                      <span className="text-red-500 font-semibold">
                        Hidden
                      </span>

                    ) : (

                      <span className="text-green-500 font-semibold">
                        Active
                      </span>

                    )}

                  </td>

                  <td className="p-3 border">

                    <button

                      onClick={() =>

                        setExpandedProject(

                          expandedProject ===
                            group.project_id

                            ? null
                            : group.project_id
                        )
                      }

                      className="
                        bg-blue-500
                        hover:bg-blue-600
                        text-white
                        px-3 py-1
                        rounded
                      "
                    >

                      {expandedProject ===
                        group.project_id

                        ? "Close"
                        : "View"}

                    </button>

                  </td>

                </tr>

                {/* EXPANDED DETAILS */}

                {expandedProject ===
                  group.project_id && (

                    <tr>

                      <td
                        colSpan="5"
                        className="
                          border
                          p-4
                          bg-gray-50
                          dark:bg-dark-surface
                          text-left
                        "
                      >

                        {/* REPORT LIST */}

                        <div className="space-y-3 mb-6">

                          {group.reports.map(
                            (
                              report,
                              idx
                            ) => (

                              <div
                                key={idx}
                                className="
                                  border-b
                                  pb-3
                                "
                              >

                                <p>
                                  <strong>
                                    Reporter:
                                  </strong>{" "}

                                  {report.reporter_name}
                                </p>

                                <p>
                                  <strong>
                                    Reason:
                                  </strong>{" "}

                                  {report.reason}
                                </p>

                                {report.note && (

                                  <p>

                                    <strong>
                                      Note:
                                    </strong>{" "}

                                    {report.note}

                                  </p>
                                )}

                                <p className="text-sm text-gray-500 mt-1">

                                  {new Date(
                                    report.created_at
                                  ).toLocaleString()}

                                </p>

                              </div>
                            )
                          )}

                        </div>

                        {/* ACTION BUTTONS */}

                        <div className="flex gap-3">

                          {!group.hidden ? (

                            <button
                              onClick={() =>
                                handleHideProject(
                                  group.project_id
                                )
                              }
                              className="
                                bg-yellow-500
                                hover:bg-yellow-600
                                text-white
                                px-4 py-2
                                rounded
                              "
                            >
                              Hide Project
                            </button>

                          ) : (

                            <button
                              onClick={() =>
                                handleRestoreProject(
                                  group.project_id
                                )
                              }
                              className="
                                bg-green-500
                                hover:bg-green-600
                                text-white
                                px-4 py-2
                                rounded
                              "
                            >
                              Restore Project
                            </button>

                          )}

                        </div>

                      </td>

                    </tr>
                  )}
              </>
            )
          )}

        </tbody>

      </table>

    </div>
  );
};

export default ReportsTable;