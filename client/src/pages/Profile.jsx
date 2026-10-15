import { useState, useEffect } from "react";
import { User, Hash, Building2, Calendar, Award, Phone } from "lucide-react";
import API from "../api/axios";
import Navbar from "../components/Navbar";

const Github = ({ size = 18, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
        <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
);

const Linkedin = ({ size = 18, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect width="4" height="12" x="2" y="9" />
        <circle cx="4" cy="4" r="2" />
    </svg>
);

function Profile() {
    const [formData, setFormData] = useState({
        registerNumber: "",
        department: "",
        batch: "",
        cgpa: "",
        phone: "",
        skills: "",
        github: "",
        linkedin: "",
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await API.get("/users/me");
            const u = res.data;
            setFormData({
                registerNumber: u.registerNumber || "",
                department: u.department || "",
                batch: u.batch || "",
                cgpa: u.cgpa ?? "",
                phone: u.phone || "",
                skills: (u.skills || []).join(", "),
                github: u.github || "",
                linkedin: u.linkedin || "",
            });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage("");
        setError("");

        try {
            const payload = {
                ...formData,
                cgpa: formData.cgpa ? parseFloat(formData.cgpa) : null,
                skills: formData.skills
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
            };

            await API.put("/users/profile", payload);
            setMessage("Profile updated successfully!");
        } catch (err) {
            setError(err.response?.data?.message || "Could not update profile");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white">
                <Navbar />
                <p className="text-gray-500 text-center mt-12">Loading profile...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <div className="max-w-xl mx-auto px-6 py-12">
                <h1 className="font-[Fraunces] text-3xl text-black mb-1">Your profile</h1>
                <p className="text-gray-500 mb-8">Keep this updated so recruiters see accurate info.</p>

                {error && (
                    <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-md mb-4">{error}</div>
                )}
                {message && (
                    <div className="bg-gray-100 text-black text-sm px-4 py-3 rounded-md mb-4 border border-gray-200">
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4 border border-gray-300 rounded-lg p-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-black mb-1">Register number</label>
                            <div className="relative">
                                <Hash size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    name="registerNumber"
                                    value={formData.registerNumber}
                                    onChange={handleChange}
                                    placeholder="21CS001"
                                    className="w-full pl-10 pr-4 py-2.5 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm text-black mb-1">Batch</label>
                            <div className="relative">
                                <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    name="batch"
                                    value={formData.batch}
                                    onChange={handleChange}
                                    placeholder="2022-2026"
                                    className="w-full pl-10 pr-4 py-2.5 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-black mb-1">Department</label>
                        <div className="relative">
                            <Building2 size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                name="department"
                                value={formData.department}
                                onChange={handleChange}
                                placeholder="Computer Science"
                                className="w-full pl-10 pr-4 py-2.5 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-black mb-1">CGPA</label>
                            <div className="relative">
                                <Award size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    max="10"
                                    name="cgpa"
                                    value={formData.cgpa}
                                    onChange={handleChange}
                                    placeholder="8.5"
                                    className="w-full pl-10 pr-4 py-2.5 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm text-black mb-1">Phone</label>
                            <div className="relative">
                                <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="9876543210"
                                    className="w-full pl-10 pr-4 py-2.5 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-black mb-1">Skills (comma separated)</label>
                        <div className="relative">
                            <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                name="skills"
                                value={formData.skills}
                                onChange={handleChange}
                                placeholder="React, Node.js, MongoDB"
                                className="w-full pl-10 pr-4 py-2.5 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-black mb-1">GitHub URL</label>
                        <div className="relative">
                            <Github size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="url"
                                name="github"
                                value={formData.github}
                                onChange={handleChange}
                                placeholder="https://github.com/yourusername"
                                className="w-full pl-10 pr-4 py-2.5 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-black mb-1">LinkedIn URL</label>
                        <div className="relative">
                            <Linkedin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="url"
                                name="linkedin"
                                value={formData.linkedin}
                                onChange={handleChange}
                                placeholder="https://linkedin.com/in/yourusername"
                                className="w-full pl-10 pr-4 py-2.5 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full bg-black text-white py-2.5 rounded-md font-medium hover:bg-gray-800 transition-colors disabled:opacity-60"
                    >
                        {saving ? "Saving..." : "Save profile"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Profile;