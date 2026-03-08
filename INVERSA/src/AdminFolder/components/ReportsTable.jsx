import ReportRow from "./ReportRow";

const ReportsTable = ({ reports, reloadReports }) => {

  return (

    <table className="w-full border">

      <thead>

        <tr>
          <th className="p-3 border">Project</th>
          <th className="p-3 border">Reporter</th>
          <th className="p-3 border">Reason</th>
          <th className="p-3 border">Note</th>
          <th className="p-3 border">Date</th>
          <th className="p-3 border">Action</th>
        </tr>

      </thead>

      <tbody>

        {reports.map((report, index) => (

          <ReportRow
            key={index}
            report={report}
            onAction={reloadReports}
          />

        ))}

      </tbody>

    </table>

  );
};

export default ReportsTable;