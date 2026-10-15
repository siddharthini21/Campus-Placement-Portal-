import { useEffect, useState } from "react";
import { Trash2, Ban, CheckCircle2 } from "lucide-react";
import API from "../api/axios";
import Navbar from "../components/Navbar";

function AdminPanel() {
    const [tab, setTab] = useState("students");
    const [students, setStudents] = useState([]);
    const [recruiters, setRecruiters] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetchAll();
    }, []);

    const fetchAll = async () => {
        setLoading(true);
        try {
            const [s, r, j] = await Promise.all([
                API.get("/admin/students"),
                API.get("/admin/recruiters"),
                API.get("/admin/jobs"),
            ]);
            setStudents(s.data);
            setRecruiters(r.data);
            setJobs(j.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const toggleBlock = async (id, type) => {
        try {
            const res = await API.patch(`/admin/users/${id}/block`);
            const updater = type === "student" ? setStudents : setRecruiters;
            updater((prev) =>
                prev.map((u) => (u._id === id ? { ...u, isBlocked: res.data.isBlocked } : u))
            );
            setMessage(res.data.message);
        } catch (err) {
            setMessage(err.response?.data?.message || "Could not update");
        }
    };

    const deleteUser = async (id, type) => {
        if (!confirm("Delete this user permanently?")) return;
        try {
            await API.delete(`/admin/users/${id}`);
            const updater = type === "student" ? setStudents : setRecruiters;
            updater((prev) => prev.filter((u) => u._id !== id));
            setMessage("User deleted");
        } catch (err) {
            setMessage(err.response?.data?.message || "Could not delete");
        }
    };

    const deleteJob = async (id) => {
        if (!confirm("Delete this job posting permanently?")) return;
        try {
            await API.delete(`/admin/jobs/${id}`);
            setJobs((prev) => prev.filter((j) => j._id !== id));
            setMessage("Job deleted");
        } catch (err) {
            setMessage(err.response?.data?.message || "Could not delete");
        }
    };

    const tabs = [
        { key: "students", label: `Students (${students.length})` },
        { key: "recruiters", label: `Recruiters (${recruiters.length})` },
        { key: "jobs", label: `Jobs (${jobs.length})` },
    ];

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <div className="max-w-4xl mx-auto px-6 py-12">
                <h1 className="font-[Fraunces] text-3xl text-black mb-1">Admin panel</h1>
                <p className="text-gray-500 mb-6">Manage students, recruiters, and job postings.</p>

                {message && (
                    <div className="bg-gray-100 text-black text-sm px-4 py-3 rounded-md mb-4 border border-gray-200">
                        {message}
                    </div>
                )}

                <div className="flex gap-2 mb-6 border-b border-gray-200">
                    {tabs.map((t) => (
                        <button
                            key={t.key}
                            onClick={() => setTab(t.key)}
                            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${tab === t.key
                                    ? "border-black text-black"
                                    : "border-transparent text-gray-500 hover:text-black"
                                }`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <p className="text-gray-500">Loading...</p>
                ) : (
                    <>
                        {tab === "students" && (
                            <div className="space-y-3">
                                {students.length === 0 && <p className="text-gray-500">No students yet.</p>}
                                {students.map((s) => (
                                    <div
                                        key={s._id}
                                        className="flex justify-between items-center border border-gray-300 rounded-lg p-4"
                                    >
                                        <div>
                                            <p className="text-black font-medium">
                                                {s.name}{" "}
                                                {s.isBlocked && (
                                                    <span className="text-xs text-red-600 ml-2">(Blocked)</span>
                                                )}
                                            </p>
                                            <p className="text-sm text-gray-500">{s.email}</p>
                                            <p className="text-xs text-gray-400">
                                                {s.department || "No department"} · CGPA {s.cgpa ?? "N/A"}
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => toggleBlock(s._id, "student")}
                                                className="p-2 border border-gray-300 rounded-md hover:bg-gray-50"
                                                title={s.isBlocked ? "Unblock" : "Block"}
                                            >
                                                {s.isBlocked ? <CheckCircle2 size={16} /> : <Ban size={16} />}
                                            </button>
                                            <button
                                                onClick={() => deleteUser(s._id, "student")}
                                                className="p-2 border border-gray-300 rounded-md hover:bg-red-50 text-red-600"
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {tab === "recruiters" && (
                            <div className="space-y-3">
                                {recruiters.length === 0 && <p className="text-gray-500">No recruiters yet.</p>}
                                {recruiters.map((r) => (
                                    <div
                                        key={r._id}
                                        className="flex justify-between items-center border border-gray-300 rounded-lg p-4"
                                    >
                                        <div>
                                            <p className="text-black font-medium">
                                                {r.name}{" "}
                                                {r.isBlocked && (
                                                    <span className="text-xs text-red-600 ml-2">(Blocked)</span>
                                                )}
                                            </p>
                                            <p className="text-sm text-gray-500">{r.email}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => toggleBlock(r._id, "recruiter")}
                                                className="p-2 border border-gray-300 rounded-md hover:bg-gray-50"
                                                title={r.isBlocked ? "Unblock" : "Block"}
                                            >
                                                {r.isBlocked ? <CheckCircle2 size={16} /> : <Ban size={16} />}
                                            </button>
                                            <button
                                                onClick={() => deleteUser(r._id, "recruiter")}
                                                className="p-2 border border-gray-300 rounded-md hover:bg-red-50 text-red-600"
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {tab === "jobs" && (
                            <div className="space-y-3">
                                {jobs.length === 0 && <p className="text-gray-500">No jobs posted yet.</p>}
                                {jobs.map((j) => (
                                    <div
                                        key={j._id}
                                        className="flex justify-between items-center border border-gray-300 rounded-lg p-4"
                                    >
                                        <div>
                                            <p className="text-black font-medium">{j.title}</p>
                                            <p className="text-sm text-gray-500">
                                                {j.company} · Posted by {j.postedBy?.name || "Unknown"}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => deleteJob(j._id)}
                                            className="p-2 border border-gray-300 rounded-md hover:bg-red-50 text-red-600"
                                            title="Delete job"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default AdminPanel;