// app/admin/dashboard/page.jsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [uploadData, setUploadData] = useState({
    title: '',
    course: '',
    semester: '',
    type: 'pdf',
    url: '',
    file: null,
  });
  const [newCourse, setNewCourse] = useState({ name: '', code: '' });
  const [newAdmin, setNewAdmin] = useState({ name: '', email: '', password: '' });
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState('');
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('navokta_user');
    const token = localStorage.getItem('navokta_token');

    if (!userData || !token) {
      router.push('/');
      return;
    }

    let parsedUser;
    try {
      parsedUser = JSON.parse(userData);
    } catch (err) {
      localStorage.removeItem('navokta_user');
      localStorage.removeItem('navokta_token');
      router.push('/');
      return;
    }

    if (parsedUser.role !== 'admin') {
      alert('Access denied');
      router.push('/');
    } else {
      setUser(parsedUser);
    }

    fetchCourses();
  }, [router]);

  const fetchCourses = async () => {
    try {
      const res = await fetch('/api/courses');
      const data = await res.json();
      if (res.ok) setCourses(data);
    } catch (err) {
      alert('Failed to load courses');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('navokta_token');
    localStorage.removeItem('navokta_user');
    router.push('/');
  };

  // Handle file input
  const handleFileChange = (e) => {
    setUploadData({ ...uploadData, file: e.target.files[0] });
  };

  // Upload file to Cloudinary
  const handleCloudinaryUpload = async () => {
    const file = uploadData.file;
    if (!file) return null;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'notes_upload');
    formData.append('folder', 'navokta_notes');

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/raw/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await res.json();
      setUploading(false);
      setUploadedUrl(data.secure_url);
      return data.secure_url;
    } catch (err) {
      setUploading(false);
      alert('Upload failed: ' + err.message);
      return null;
    }
  };

  // Submit resource
  const handleSubmit = async (e) => {
    e.preventDefault();
    let fileUrl = uploadedUrl;

    if (uploadData.file && !uploadedUrl) {
      fileUrl = await handleCloudinaryUpload();
      if (!fileUrl) return;
    }

    const payload = {
      title: uploadData.title,
      courseCode: uploadData.course,
      semester: parseInt(uploadData.semester), // Ensure semester is stored as integer
      type: uploadData.type,
      youtubeUrl: uploadData.type === 'video' ? uploadData.url : undefined,
      fileUrl,
    };

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('navokta_token')}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (res.ok) {
        alert('✅ Resource uploaded successfully!');
        setUploadData({
          title: '',
          course: '',
          semester: '',
          type: 'pdf',
          url: '',
          file: null,
        });
        setUploadedUrl('');
      } else {
        alert('Error: ' + result.message);
      }
    } catch (err) {
      alert('Network error');
    }
  };

  // Add new course
  const handleAddCourse = async (e) => {
    e.preventDefault();
    if (!newCourse.name || !newCourse.code) {
      alert('Name and code are required');
      return;
    }

    try {
      const res = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCourse),
      });

      const result = await res.json();
      if (res.ok) {
        alert(`✅ Course "${result.name}" added!`);
        setCourses([...courses, result]);
        setNewCourse({ name: '', code: '' });
      } else {
        alert('Error: ' + result.message);
      }
    } catch (err) {
      alert('Network error');
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

    const confirm = window.confirm(`Add ${name} as admin?`);
    if (!confirm) return;

    try {
      const res = await fetch('/api/admin/add-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('navokta_token')}`,
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        alert(`✅ Admin "${data.name}" created successfully!`);
        setNewAdmin({ name: '', email: '', password: '' });
      } else {
        alert('Error: ' + data.message);
      }
    } catch (err) {
      alert('Network error: ' + err.message);
    }
  };

  if (!user) return <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">Loading...</div>;

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
                <span className="text-purple-300 font-medium">{user.name}</span>
                <span className="mx-2">•</span>
                <span className="text-green-400">Online</span>
              </div>
              <button
                onClick={handleLogout}
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
                Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">{user.name}</span>
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
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white">Upload New Resource</h3>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                <input
                  type="text"
                  placeholder="e.g., Database Management Systems"
                  value={uploadData.title}
                  onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
                  className="w-full px-4 py-3 bg-black/60 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Course</label>
                  <select
                    value={uploadData.course}
                    onChange={(e) => setUploadData({ ...uploadData, course: e.target.value })}
                    className="w-full px-4 py-3 bg-black/60 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  >
                    <option value="">Select Course</option>
                    {courses.map((course) => (
                      <option key={course.code} value={course.code}>
                        {course.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Semester</label>
                  <select
                    value={uploadData.semester}
                    onChange={(e) => setUploadData({ ...uploadData, semester: e.target.value })}
                    className="w-full px-4 py-3 bg-black/60 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  >
                    <option value="">Select Semester</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((sem) => (
                      <option key={sem} value={sem}>
                        Semester {sem}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Resource Type</label>
                <select
                  value={uploadData.type}
                  onChange={(e) => setUploadData({ ...uploadData, type: e.target.value })}
                  className="w-full px-4 py-3 bg-black/60 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="pdf">PDF Notes</option>
                  <option value="pyq">Previous Year Questions</option>
                  <option value="video">YouTube Video</option>
                  <option value="link">External Link</option>
                </select>
              </div>

              {(uploadData.type === 'pdf' || uploadData.type === 'pyq') && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Upload File</label>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="w-full px-4 py-3 bg-black/60 border border-gray-600 rounded-xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-purple-500 file:text-white hover:file:bg-purple-600"
                  />
                  {uploading && (
                    <div className="flex items-center mt-2 text-blue-400">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Uploading...
                    </div>
                  )}
                  {uploadedUrl && (
                    <div className="flex items-center mt-2 text-green-400">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      File uploaded successfully!
                    </div>
                  )}
                </div>
              )}

              {uploadData.type === 'video' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">YouTube URL</label>
                  <input
                    type="url"
                    placeholder="https://youtube.com/watch?v=..."
                    value={uploadData.url}
                    onChange={(e) => setUploadData({ ...uploadData, url: e.target.value })}
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
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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
            {/* Add Course */}
            <div className="bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-3xl p-8">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white">Add New Course</h3>
              </div>
              
              <form onSubmit={handleAddCourse} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Course Name</label>
                  <input
                    type="text"
                    placeholder="e.g., BCA"
                    value={newCourse.name}
                    onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
                    className="w-full px-4 py-3 bg-black/60 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Course Code</label>
                  <input
                    type="text"
                    placeholder="e.g., bca"
                    value={newCourse.code}
                    onChange={(e) => setNewCourse({ ...newCourse, code: e.target.value.toLowerCase() })}
                    className="w-full px-4 py-3 bg-black/60 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-200 transform hover:-translate-y-0.5"
                >
                  Add Course
                </button>
              </form>
            </div>

            {/* Add Admin */}
            <div className="bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-3xl p-8">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white">Add New Admin</h3>
              </div>
              
              <form onSubmit={handleAddAdmin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                  <input
                    type="text"
                    placeholder="Full name"
                    value={newAdmin.name}
                    onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                    className="w-full px-4 py-3 bg-black/60 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    placeholder="admin@example.com"
                    value={newAdmin.email}
                    onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                    className="w-full px-4 py-3 bg-black/60 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={newAdmin.password}
                    onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
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