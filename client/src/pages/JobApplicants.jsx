import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Mail, ArrowLeft } from "lucide-react";
import API from "../api/axios";
import Navbar from "../components/Navbar";

function JobApplicants() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchApplicants();
  }, []);

  const fetchApplicants = async () => {
    try {
      const res = await API.get(`/jobs/${id}/applicants`);
      setJob(res.data.job);
      setApplicants(res.data.applicants);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (appId, status) => {
    setMessage("");
    try {
      await API.patch(`/jobs/applications/${appId}/status`, { status });
      setApplicants((prev) =>
        prev.map((a) => (a._id === appId ? { ...a, status } : a))
      );
      setMessage(`Marked as ${status}`);
    } catch (err) {
      setMessage(err.response?.data?.message || "Could not update");
    }
  };

  const statusStyle = {
    applied: "bg-gray-100 text-gray-600 border border-gray-300",
    shortlisted: "bg-blue-50 text-blue-700",
    interview: "bg-yellow-50 text-yellow-700",
    selected: "bg-green-50 text-green-700",
    rejected: "bg-red-50 text-red-700",
  };

  const statuses = ["applied", "shortlisted", "interview", "selected", "rejected"];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-12">
        <Link
          to="/jobs"
          className="text-sm text-gray-500 flex items-center gap-1 mb-4 hover:text-black transition-colors"
        >
          <ArrowLeft size={14} /> Back to my postings
        </Link>

        {job && (
          <>
            <h1 className="font-[Fraunces] text-3xl text-black mb-1">{job.title}</h1>
            <p className="text-gray-500 mb-8">
              {job.company} · {applicants.length} applicant(s)
            </p>
          </>
        )}

        {message && (
          <div className="bg-gray-100 text-black text-sm px-4 py-3 rounded-md mb-4 border border-gray-200">
            {message}
          </div>
        )}

        {loading ? (
          <p className="text-gray-500">Loading applicants...</p>
        ) : applicants.length === 0 ? (
          <p className="text-gray-500">No one has applied yet.</p>
        ) : (
          <div className="space-y-4">
            {applicants.map((app) => (
              <div
                key={app._id}
                className="bg-white border border-gray-300 rounded-lg p-6 flex justify-between items-center"
              >
                <div>
                  <h2 className="font-[Fraunces] text-lg text-black">
                    {app.student?.name}
                  </h2>
                  <p className="text-gray-500 text-sm flex items-center gap-1 mt-1">
                    <Mail size={14} /> {app.student?.email}
                  </p>
                  <span
                    className={`inline-block mt-2 text-xs px-3 py-1 rounded-full capitalize ${statusStyle[app.status]}`}
                  >
                    {app.status}
                  </span>
                </div>

                <select
                  value={app.status}
                  onChange={(e) => updateStatus(app._id, e.target.value)}
                  className="text-sm border border-gray-300 rounded-md px-3 py-2 capitalize focus:outline-none focus:ring-2 focus:ring-black"
                >
                  {statuses.map((s) => (
                    <option key={s} value={s} className="capitalize">
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default JobApplicants;