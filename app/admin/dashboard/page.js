'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signIn } from 'next-auth/react'; // 👈 Added

export default function AdminDashboard() {
  const { data: session, status } = useSession(); // 👈 Replaces localStorage auth
  const [courses, setCourses] = useState([]);
  const [option, setOption] = useState([]);
  const [uploadData, setUploadData] = useState({
    subject: '',
    courseName: '',
    semester: '',
    fileType: 'PDF',
    link: '',
  });
  const [file, setFile] = useState(null); // 👈 For PDF upload
  const [newCourse, setNewCourse] = useState({
    courseName: '',
    semester: '',
    description: '',
  });
  const [newAdmin, setNewAdmin] = useState({ name: '', email: '', password: '' });
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState('');
  const router = useRouter();

  // 👇 Redirect if not authenticated or not admin
  // useEffect(() => {
  //   if (status === 'authenticated') {
  //     if (session.user.role !== 'admin') {
  //       alert('Access denied. Admins only.');
  //       router.push('/');
  //     }
  //   }
  // }, [session, status, router]);

  // 👇 Fetch courses once authenticated
  useEffect(() => {
    // if (status === 'authenticated' && session.user.role === 'admin') {   //ya line error da rahi ha 
    //   fetchCourses();
    // }
    fetchCourses();
  }, [status, session]);

 const fetchCourses = async () => {
  if (!session || !session.accessToken) return; // ✅ wait for session

  try {
    const res = await fetch('/api/courses', {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    });
    const data = await res.json();
    if (res.ok) setCourses(data);
  } catch (err) {
    console.error('Failed to load courses:', err);
    alert('Failed to load courses');
  }
};

  // 👇 No more localStorage logout — use next-auth signOut (you can add it if needed)
  // For now, we'll just redirect to home. You can import `signOut` if you want to invalidate session.

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && !selectedFile.name.toLowerCase().endsWith('.pdf')) {
      alert('Please select a PDF file only!');
      setFile(null);
      return;
    }
    setFile(selectedFile);
    // Optional: clear uploadedUrl if new file selected
    setUploadedUrl('');
  };

  // 👇 Upload to your /api/upload endpoint (Google Drive or whatever backend you have)
 // Upload PDF to Google Drive and return the file URL
const handleApiUpload = async () => {
  if (!file) return null;

  setUploading(true);
  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await fetch("/api/admin/upload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.accessToken}`, // DO NOT set Content-Type manually
      },
      body: formData, // Browser sets correct multipart/form-data
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Upload failed");

    setUploadedUrl(data.file.webViewLink); // Update UI
    return data.file.webViewLink; // Return to use in MongoDB
  } catch (err) {
    alert("Upload failed: " + err.message);
    return null;
  } finally {
    setUploading(false);
  }
};

// Submit resource metadata (PDF / YouTube / External) to MongoDB
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!session) {
    alert("Please log in first!");
    return;
  }

  let finalLink = uploadData.link;

  // Handle PDF file upload
  if (uploadData.fileType === "PDF") {
    if (!file && !uploadedUrl) {
      alert("Please select a PDF file!");
      return;
    }

    if (file && !uploadedUrl) {
      finalLink = await handleApiUpload(); // Upload PDF & get URL
      if (!finalLink) return;
    } else if (uploadedUrl) {
      finalLink = uploadedUrl; // Use already uploaded file URL
    }
  }
  console.log("ya finelLINk ha",finalLink)

  if (!finalLink) {
    alert("Please provide a valid link or upload a file.");
    return;
  }

  const payload = {
    subject: uploadData.subject,
    courseName: uploadData.courseName,
    semester: parseInt(uploadData.semester, 10),
    fileType: uploadData.fileType,
    link: finalLink, // Save the correct link in MongoDB
  };

  try {
    const res = await fetch("/api/admin/upload", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify(payload),
    });

    const result = await res.json();
    if (res.ok) {
      alert("✅ Resource uploaded successfully!");
      // Reset form
      setUploadData({
        subject: "",
        courseName: "",
        semester: "",
        fileType: "PDF",
        link: "",
      });
      setUploadedUrl("");
      setFile(null);
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = "";
    } else {
      alert("Error: " + (result.message || "Unknown error"));
    }
  } catch (err) {
    alert("Network error: " + err.message);
  }
};

  // Add new course (semester entry)
  const handleAddCourse = async (e) => {
    e.preventDefault();
    if (!newCourse.courseName || !newCourse.semester) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const res = await fetch('/api/admin/add-course', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify({
          courseName: newCourse.courseName,
          semester: parseInt(newCourse.semester, 10),
          description: newCourse.description || '',
        }),
      });

      const result = await res.json();
      if (res.ok) {
        alert('✅ Semester added successfully!');
        setNewCourse({ courseName: '', semester: '', description: '' });
        fetchCourses();
      } else {
        alert('Error: ' + result.message);
      }
    } catch (err) {
      alert('Network error: ' + err.message);
    }
  };

  // Add new admin
  const handleAddAdmin = async (e) => {
    e.preventDefault();
    const { name, email, password } = newAdmin;

    if (!name || !email || !password) {
      alert('All fields are required');
      return;
    }

    try {
      const response = await fetch('/api/admin/add-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(`✅ Admin "${data.user.name}" created successfully!`);
        setNewAdmin({ name: '', email: '', password: '' });
      } else {
        let errorMessage = data.message || 'Unknown error occurred';

        if (data.error === 'invalid_token') {
          errorMessage = 'Your session has expired. Please login again.';
          // next-auth will handle session — no need to clear localStorage
          router.push('/');
        } else if (data.error === 'insufficient_permissions') {
          errorMessage = 'You do not have permission to add admins.';
        } else if (data.error === 'user_exists') {
          errorMessage = 'An admin with this email already exists.';
        }

        alert(`Error: ${errorMessage}`);
      }
    } catch (err) {
      console.error('Error adding admin:', err);
      alert('Network error: ' + err.message);
    }
  };

  useEffect(() => {
    if (!uploadData.courseName) {
      setOption([]);
      return;
    }

    const course = courses.find(
      (item) => item.courseName === uploadData.courseName
    );

    if (course) {
      const semesterArray = Array.from({ length: course.semester }, (_, i) => i + 1);
      setOption(semesterArray);
    } else {
      setOption([]);
    }
  }, [uploadData.courseName, courses]);

  // 👇 Handle loading state
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <p className="text-gray-400">Loading session...</p>
      </div>
    );
  }

  // 👇 Show login if not authenticated
  if (status !== 'authenticated' || !session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
        <div className="bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-3xl p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold text-white mb-4">🔒 Admin Access Required</h2>
          <p className="text-gray-300 mb-6">Please log in with your admin account to access the dashboard.</p>
          <button
            onClick={() => signIn('google')}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all"
          >
            Login with Google
          </button>
        </div>
      </div>
    );
  }

  // 👇 If authenticated but not admin (extra safety)
  // if (session.user.role !== 'admin') {
  //   return (
  //     <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
  //       <div className="bg-black/40 backdrop-blur-sm border border-red-500/20 rounded-3xl p-8 text-center max-w-md">
  //         <h2 className="text-2xl font-bold text-red-400 mb-4">🚫 Access Denied</h2>
  //         <p className="text-gray-300">You do not have permission to access the admin dashboard.</p>
  //         <button
  //           onClick={() => router.push('/')}
  //           className="mt-6 px-6 py-3 bg-gray-600 text-white rounded-xl font-medium hover:bg-gray-700 transition-colors"
  //         >
  //           Go Home
  //         </button>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="border-b border-purple-500/30 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 text-transparent bg-clip-text">
                Admin Dashboard
              </h1>
              <p className="text-gray-400 mt-1">Manage your educational resources</p>
            </div>
            <div className="flex items-center space-x-4 mt-4 sm:mt-0">
              <div className="text-sm text-gray-300">
                <span className="text-purple-300 font-medium">{session.user.name}</span>
                <span className="mx-2">•</span>
                <span className="text-green-400">Online</span>
              </div>
              {/* 👇 Optional: Add signOut if you want to invalidate session */}
              <button
                onClick={() => {
                  // If you import signOut from 'next-auth/react', use it here
                  // signOut({ callbackUrl: '/' });
                  router.push('/'); // Simple redirect for now
                }}
                className="px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors border border-red-500/30"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Card */}
        <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-3xl p-8 mb-8 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Welcome back,{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                  {session.user.name}
                </span>
              </h2>
              <p className="text-gray-300 text-lg">
                Manage courses, upload resources, and add new administrators.
              </p>
            </div>
            <div className="mt-6 md:mt-0">
              <div className="bg-black/30 rounded-2xl p-4 border border-purple-500/20">
                <div className="text-center">
                  <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                    {courses.length}
                  </div>
                  <div className="text-sm text-gray-400">Courses</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-3xl p-8">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white">Upload New Resource</h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  placeholder="e.g., Database Management Systems"
                  value={uploadData.subject}
                  onChange={(e) =>
                    setUploadData({ ...uploadData, subject: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-black/60 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Course
                  </label>
                  <select
                    value={uploadData.courseName}
                    onChange={(e) =>
                      setUploadData({
                        ...uploadData,
                        courseName: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 bg-black/60 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  >
                    <option value="">Select Course</option>
                    {courses.map((course) => (
                      <option key={course._id} value={course.courseName}>
                        {course.courseName} (Sem {course.semester})
                        {course.description && (
                          <span className="ml-2 text-gray-400 text-xs">
                            — {course.description.substring(0, 30)}...
                          </span>
                        )}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Semester
                  </label>
                  <select
                    value={uploadData.semester}
                    onChange={(e) =>
                      setUploadData({
                        ...uploadData,
                        semester: parseInt(e.target.value, 10),
                      })
                    }
                    className="w-full px-4 py-3 bg-black/60 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  >
                    <option value="">Select Semester</option>
                    {option.map((sem) => (
                      <option key={sem} value={sem}>
                        Semester {sem}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Resource Type
                </label>
                <select
                  value={uploadData.fileType}
                  onChange={(e) =>
                    setUploadData({
                      ...uploadData,
                      fileType: e.target.value,
                      link: '',
                    })
                  }
                  className="w-full px-4 py-3 bg-black/60 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                >
                  <option value="PDF">PDF Notes</option>
                  <option value="YouTubeLink">YouTube Video</option>
                  <option value="ExternalLink">External Link</option>
                </select>
              </div>

              {/* PDF Upload */}
              {uploadData.fileType === 'PDF' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Upload PDF File
                  </label>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="w-full px-4 py-3 bg-black/60 border border-gray-600 rounded-xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-purple-500 file:text-white hover:file:bg-purple-600"
                    required={!uploadedUrl}
                  />
                  {uploading && (
                    <div className="flex items-center mt-2 text-blue-400">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Uploading...
                    </div>
                  )}
                  {uploadedUrl && (
                    <div className="flex items-center mt-2 text-green-400">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      File uploaded successfully!
                    </div>
                  )}
                </div>
              )}

              {/* YouTube or External Link */}
              {(uploadData.fileType === 'YouTubeLink' ||
                uploadData.fileType === 'ExternalLink') && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {uploadData.fileType === 'YouTubeLink'
                      ? 'YouTube URL'
                      : 'External Link'}
                  </label>
                  <input
                    type="url"
                    placeholder={
                      uploadData.fileType === 'YouTubeLink'
                        ? 'https://youtube.com/watch?v=...'
                        : 'https://example.com/resource'
                    }
                    value={uploadData.link}
                    onChange={(e) =>
                      setUploadData({ ...uploadData, link: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-black/60 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={uploading}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none transform hover:-translate-y-0.5"
              >
                {uploading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Uploading...
                  </span>
                ) : (
                  'Upload Resource'
                )}
              </button>
            </form>
          </div>

          {/* Side Panel */}
          <div className="space-y-8">
            {/* Add Course (Semester) */}
            <div className="bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-3xl p-8">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white">Add Semester</h3>
              </div>

              <form onSubmit={handleAddCourse} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Course Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., BCA"
                    value={newCourse.courseName}
                    onChange={(e) =>
                      setNewCourse({
                        ...newCourse,
                        courseName: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 bg-black/60 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Semester Number
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    placeholder="e.g., 1"
                    value={newCourse.semester || ''}
                    onChange={(e) =>
                      setNewCourse({
                        ...newCourse,
                        semester: parseInt(e.target.value, 10) || '',
                      })
                    }
                    className="w-full px-4 py-3 bg-black/60 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Description (Optional)</label>
                  <textarea
                    placeholder="e.g., Covers fundamentals of programming, data structures, and algorithms."
                    value={newCourse.description || ''}
                    onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                    className="w-full px-4 py-3 bg-black/60 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    rows="3"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-200 transform hover:-translate-y-0.5"
                >
                  Add Semester
                </button>
              </form>
            </div>

            {/* Add Admin */}
            <div className="bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-3xl p-8">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white">
                  Add New Admin
                </h3>
              </div>

              <form onSubmit={handleAddAdmin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    placeholder="Full name"
                    value={newAdmin.name}
                    onChange={(e) =>
                      setNewAdmin({ ...newAdmin, name: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-black/60 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="admin@example.com"
                    value={newAdmin.email}
                    onChange={(e) =>
                      setNewAdmin({ ...newAdmin, email: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-black/60 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={newAdmin.password}
                    onChange={(e) =>
                      setNewAdmin({ ...newAdmin, password: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-black/60 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-3 rounded-xl font-medium hover:shadow-lg hover:shadow-green-500/25 transition-all duration-200 transform hover:-translate-y-0.5"
                >
                  Add Admin
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}