import { useState } from "react";

const ReportModal = ({ isOpen, onClose, onSubmit }) => {

  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");

  if (!isOpen) return null;

 const handleSubmit = async () => {

  if (!reason) {
    alert("Please select a reason");
    return;
  }

  try {

    await onSubmit({ reason, note });

    alert("Report submitted");

    setReason("");
    setNote("");

    onClose();

  } catch (err) {

    alert(err.message);

  }

};

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

      <div className="bg-white p-6 rounded-lg w-96 text-slate-950">

        <h2 className="text-lg font-semibold mb-4 text-red-600">
          Report Project
        </h2>

        <select
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full border p-2 rounded mb-3"
        >
          <option value="">Select reason</option>
          <option value="spam">Spam</option>
          <option value="inappropriate">Inappropriate content</option>
          <option value="copyright">Copyright violation</option>
          <option value="other">Other</option>
        </select>

        <textarea
          placeholder="Additional note (optional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          className="w-full border p-2 rounded mb-4"
        />

        <div className="flex justify-end gap-2">

          <button
            onClick={onClose}
            className="px-4 py-2 border rounded bg-slate-700 text-white"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            Submit Report
          </button>

        </div>

      </div>

    </div>
  );
};

export default ReportModal;