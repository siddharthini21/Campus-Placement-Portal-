import { useState, useEffect } from "react";
import { FileText, Upload, CheckCircle } from "lucide-react";
import API from "../api/axios";
import Navbar from "../components/Navbar";

function UploadResume() {
    const [file, setFile] = useState(null);
    const [currentResume, setCurrentResume] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const fetchProfile = async () => {
        try {
            const res = await API.get("/users/me");
            setCurrentResume(res.data.resumeUrl);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setError("");
        setMessage("");
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) {
            setError("Please select a file first");
            return;
        }

        const formData = new FormData();
        formData.append("resume", file);

        setLoading(true);
        setError("");
        setMessage("");

        try {
            const res = await API.post("/users/upload-resume", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setCurrentResume(res.data.resumeUrl);
            setMessage("Resume uploaded successfully!");
            setFile(null);
        } catch (err) {
            setError(err.response?.data?.message || "Upload failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <div className="max-w-xl mx-auto px-6 py-12">
                <h1 className="font-[Fraunces] text-3xl text-black mb-1">Your resume</h1>
                <p className="text-gray-500 mb-8">Upload a PDF or Word document (max 5MB).</p>

                {currentResume && (
                    <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 mb-6 flex items-center gap-3">
                        <CheckCircle size={20} className="text-black shrink-0" />
                        <div>
                            <p className="text-sm text-black font-medium">Resume on file</p>
                            <a
                                href={
                                    currentResume.startsWith("http")
                                        ? currentResume
                                        : `${import.meta.env.VITE_SERVER_URL || "http://127.0.0.1:5000"}${currentResume}`
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-gray-600 underline"
                            >
                                View current resume
                            </a>
                        </div>
                    </div>
                )}

            {error && (
                <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-md mb-4">{error}</div>
            )}
            {message && (
                <div className="bg-gray-100 text-black text-sm px-4 py-3 rounded-md mb-4 border border-gray-200">
                    {message}
                </div>
            )}

            <form onSubmit={handleUpload} className="border border-gray-300 rounded-lg p-6">
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg py-10 cursor-pointer hover:border-black transition-colors">
                    <FileText size={32} className="text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">
                        {file ? file.name : "Click to choose a file"}
                    </span>
                    <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                </label>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-6 bg-black text-white py-2.5 rounded-md font-medium hover:bg-gray-800 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                >
                    <Upload size={16} />
                    {loading ? "Uploading..." : "Upload resume"}
                </button>
            </form>
        </div>
    </div >
  );
}

export default UploadResume;