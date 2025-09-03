'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [uploadData, setUploadData] = useState({
    title: '',
    course: '', // selected course
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
      router.push('/admin/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 'admin') {
      alert('Access denied');
      router.push('/');
    } else {
      setUser(parsedUser);
    }

    // Load courses
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
    router.push('/admin/login');
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
  courseCode: uploadData.course, // e.g., 'bca'
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
        setUploadData({ title: '', course: '', type: 'pdf', url: '', file: null });
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

  if (!user) return <div className="text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-black text-white" style={{
      background: 'radial-gradient(circle at center, #0a0a0a, #000)',
    }}>
      {/* Header */}
      <div className="border-b border-red-800/50 px-6 py-5">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-red-400 to-pink-400 text-transparent bg-clip-text">
            Admin Dashboard
          </h1>
          <div className="text-sm text-gray-400 mt-2 md:mt-0">
            Role: <strong className="text-red-300">Admin</strong>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 max-w-6xl">

        {/* Welcome */}
        <div className="bg-gradient-to-r from-red-900/30 to-pink-900/30 border border-red-800/50 rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-semibold">
            Welcome, <span className="text-red-300">{user.name}</span>
          </h2>
          <p className="text-gray-400">Upload notes, manage courses & admins.</p>
        </div>

        {/* Upload Section */}
        <section className="bg-black/40 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">📤 Upload New Resource</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Title (e.g., DBMS Notes)"
              value={uploadData.title}
              onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
              className="w-full px-4 py-2 bg-black/60 border border-gray-700 rounded-lg text-white"
              required
            />

            <select
              value={uploadData.course}
              onChange={(e) => setUploadData({ ...uploadData, course: e.target.value })}
              className="w-full px-4 py-2 bg-black/60 border border-gray-700 rounded-lg text-white"
              required
            >
              <option value="">Select Course</option>
              {courses.map((course) => (
                <option key={course.code} value={course.code}>
                  {course.name}
                </option>
              ))}
            </select>

            <select
              value={uploadData.type}
              onChange={(e) => setUploadData({ ...uploadData, type: e.target.value })}
              className="w-full px-4 py-2 bg-black/60 border border-gray-700 rounded-lg text-white"
            >
              <option value="pdf">PDF Notes</option>
              <option value="pyq">PYQs</option>
              <option value="video">YouTube Video</option>
              <option value="link">External Link</option>
            </select>

            {(uploadData.type === 'pdf' || uploadData.type === 'pyq') && (
              <>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="w-full px-4 py-2 bg-black/60 border border-gray-700 rounded-lg text-white"
                />
                {uploading && <div className="text-blue-400">Uploading to Cloudinary...</div>}
                {uploadedUrl && <div className="text-green-400 text-sm">✅ Uploaded!</div>}
              </>
            )}

            {uploadData.type === 'video' && (
              <input
                type="url"
                placeholder="YouTube URL"
                value={uploadData.url}
                onChange={(e) => setUploadData({ ...uploadData, url: e.target.value })}
                className="w-full px-4 py-2 bg-black/60 border border-gray-700 rounded-lg text-white"
                required
              />
            )}

            <button
              type="submit"
              disabled={uploading}
              className="bg-gradient-to-r from-red-600 to-pink-600 text-white px-6 py-2 rounded-lg hover:shadow-lg disabled:opacity-70"
            >
              {uploading ? 'Uploading...' : 'Upload Resource'}
            </button>
          </form>
        </section>

        {/* Add Course */}
        <section className="bg-black/40 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">➕ Add New Course</h3>
          <form onSubmit={handleAddCourse} className="space-y-4 max-w-md">
            <input
              type="text"
              placeholder="Course Name (e.g., BCA)"
              value={newCourse.name}
              onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
              className="w-full px-4 py-2 bg-black/60 border border-gray-700 rounded-lg text-white"
              required
            />
            <input
              type="text"
              placeholder="Code (e.g., bca)"
              value={newCourse.code}
              onChange={(e) => setNewCourse({ ...newCourse, code: e.target.value.toLowerCase() })}
              className="w-full px-4 py-2 bg-black/60 border border-gray-700 rounded-lg text-white"
              required
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg hover:shadow-lg"
            >
              Add Course
            </button>
          </form>
        </section>

        {/* Add Admin */}
        <section className="bg-black/40 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4">➕ Add New Admin</h3>
          <form onSubmit={handleAddAdmin} className="space-y-4 max-w-md">
            <input
              type="text"
              placeholder="Name"
              value={newAdmin.name}
              onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
              className="w-full px-4 py-2 bg-black/60 border border-gray-700 rounded-lg text-white"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={newAdmin.email}
              onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
              className="w-full px-4 py-2 bg-black/60 border border-gray-700 rounded-lg text-white"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={newAdmin.password}
              onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
              className="w-full px-4 py-2 bg-black/60 border border-gray-700 rounded-lg text-white"
              required
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-green-600 to-teal-600 text-white px-6 py-2 rounded-lg hover:shadow-lg"
            >
              Add Admin
            </button>
          </form>
        </section>

        {/* Logout */}
        <div className="mt-8 text-center">
          <button
            onClick={handleLogout}
            className="px-6 py-2 bg-red-900 text-red-200 rounded-full hover:bg-red-800"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}