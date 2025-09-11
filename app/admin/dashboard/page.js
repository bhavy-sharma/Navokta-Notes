'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [option, setOption] = useState(null)
  const [uploadData, setUploadData] = useState({
    subject: '',
    courseName: '',
    semester: '',
    fileType: 'PDF',
    link: '',
  });
  const [newCourse, setNewCourse] = useState({
    courseName: '',
    semester: '',
    description: '',
  });
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
    const file = e.target.files[0];
    setUploadData((prev) => ({ ...prev, file }));
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

      if (data.secure_url) {
        setUploadedUrl(data.secure_url);
        return data.secure_url;
      } else {
        throw new Error(data.error?.message || 'Upload failed');
      }
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

    // If file selected but not uploaded yet, upload it
    if (uploadData.file && !uploadedUrl) {
      fileUrl = await handleCloudinaryUpload();
      if (!fileUrl) return;
    }

    // For YouTube/External, use the link from input. For PDF, use uploaded URL.
    const finalLink =
      uploadData.fileType === 'PDF' ? fileUrl : uploadData.link;

    if (!finalLink) {
      alert('Please provide a valid link or upload a file.');
      return;
    }

    const payload = {
      subject: uploadData.subject,
      courseName: uploadData.courseName,
      semester: parseInt(uploadData.semester, 10),
      fileType: uploadData.fileType,
      link: finalLink,
    };

    try {
      const token = localStorage.getItem('navokta_token');
      if (!token) {
        alert('Authentication token not found. Please login again.');
        router.push('/auth/login');
        return;
      }

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (res.ok) {
        alert('✅ Resource uploaded successfully!');
        // Reset form
        setUploadData({
          subject: '',
          courseName: '',
          semester: '',
          fileType: 'PDF',
          link: '',
        });
        setUploadedUrl('');
        // Optionally clear file input
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) fileInput.value = '';
      } else {
        alert('Error: ' + result.message);
      }
    } catch (err) {
      alert('Network error: ' + err.message);
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
      const token = localStorage.getItem('navokta_token');
      if (!token) {
        alert('Authentication token not found. Please login again.');
        router.push('/auth/login');
        return;
      }

      const res = await fetch('/api/admin/add-course', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
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
        fetchCourses(); // Refresh list
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
      const token = localStorage.getItem('navokta_token');
      if (!token) {
        alert('Authentication token not found. Please login again.');
        router.push('/auth/login');
        return;
      }

      const response = await fetch('/api/admin/add-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
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
          localStorage.removeItem('navokta_token');
          localStorage.removeItem('navokta_user');
          router.push('/auth/login');
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


  if (!user)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        Loading...
      </div>
    );

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
                Welcome back,{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                  {user.name}
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