'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const ALLOWED_ADMIN_EMAIL = 'codershab@gmail.com';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Data States
  const [courses, setCourses] = useState([]);
  const [notes, setNotes] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [option, setOption] = useState([]);

  // Form States
  const [uploadData, setUploadData] = useState({
    subject: '', courseName: '', semester: '', fileType: 'PDF', link: '',
  });
  const [file, setFile] = useState(null);
  
  const [newCourse, setNewCourse] = useState({ courseName: '', semester: '', description: '' });
  const [newAdmin, setNewAdmin] = useState({ name: '', email: '', password: '' });
  
  // Edit States (for Update operations)
  const [editingNote, setEditingNote] = useState(null);
  const [editingCourse, setEditingCourse] = useState(null);
  const [editingAdmin, setEditingAdmin] = useState(null);
  
  // UI States
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState('');

  // 🔐 Initial Auth Check & Data Fetch
  useEffect(() => {
    const currentUser = { email: ALLOWED_ADMIN_EMAIL, name: 'Admin User', role: 'admin' };

    if (currentUser.email !== ALLOWED_ADMIN_EMAIL) {
      toast.error('Access denied. Admins only.');
      router.push('/');
      setLoading(false);
      return;
    }

    fetchCourses();
    fetchNotes();
    fetchAdmins();
    setLoading(false);
  }, [router]);

  // 📡 Fetch Functions (Read)
  const fetchCourses = async () => {
    try {
      const res = await fetch('/api/courses');
      if (res.ok) setCourses(await res.json());
    } catch (err) { console.error('Failed to load courses:', err); }
  };

  const fetchNotes = async () => {
    try {
      const res = await fetch('/api/notes'); 
      if (res.ok) setNotes(await res.json());
    } catch (err) { console.error('Failed to load notes:', err); }
  };

  const fetchAdmins = async () => {
    try {
      const res = await fetch('/api/admins');
      if (res.ok) setAdmins(await res.json());
    } catch (err) { console.error('Failed to load admins:', err); }
  };

  // 🔄 Dynamic Semester Options
  useEffect(() => {
    if (!uploadData.courseName && !editingNote?.courseName) {
      setOption([]);
      return;
    }
    const targetCourseName = editingNote ? editingNote.courseName : uploadData.courseName;
    const course = courses.find((item) => item.courseName === targetCourseName);
    
    if (course) {
      setOption(Array.from({ length: course.semester }, (_, i) => i + 1));
    } else {
      setOption([]);
    }
  }, [uploadData.courseName, editingNote?.courseName, courses]);

  // 📁 File Handling
  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && !selectedFile.name.toLowerCase().endsWith('.pdf')) {
      toast.error('Please select a PDF file only!');
      setFile(null);
      return;
    }
    setFile(selectedFile);
    setUploadedUrl('');
  };

  const handleCloudinaryUpload = async () => {
    if (!file) { toast.error("Please select a PDF file!"); return null; }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/uploadCloud", { method: "POST", body: formData });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Cloudinary upload failed");
      setUploadedUrl(data.url);
      return data.url;
    } catch (err) {
      console.error("Cloudinary upload error:", err);
      toast.error("Upload failed: " + (err.message || "Unknown error"));
      return null;
    } finally {
      setUploading(false);
    }
  };

  // ➕ CREATE Operations
  const handleSubmitNote = async (e) => {
    e.preventDefault();
    let finalLink = uploadData.link;

    if (uploadData.fileType === 'PDF') {
      if (!file && !uploadedUrl) { toast.error('Please select a PDF file!'); return; }
      if (file && !uploadedUrl) {
        finalLink = await handleCloudinaryUpload();
        if (!finalLink) return;
      } else if (uploadedUrl) {
        finalLink = uploadedUrl;
      }
    }

    if (!finalLink) { toast.error('Please provide a valid link or upload a file.'); return; }

    const payload = {
      subject: uploadData.subject,
      courseName: uploadData.courseName,
      semester: parseInt(uploadData.semester, 10),
      fileType: uploadData.fileType,
      link: finalLink,
    };

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (res.ok) {
        toast.success('Resource uploaded successfully!');
        setUploadData({ subject: '', courseName: '', semester: '', fileType: 'PDF', link: '' });
        setUploadedUrl('');
        setFile(null);
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) fileInput.value = '';
        fetchNotes();
      } else {
        toast.error('Error: ' + result.message);
      }
    } catch (err) {
      toast.error('Network error: ' + err.message);
    }
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    if (!newCourse.courseName || !newCourse.semester) { toast.error('Please fill in all required fields'); return; }
    try {
      const res = await fetch('/api/admin/add-course', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newCourse, semester: parseInt(newCourse.semester, 10) }),
      });
      const result = await res.json();
      if (res.ok) {
        toast.success('Course added successfully!');
        setNewCourse({ courseName: '', semester: '', description: '' });
        fetchCourses();
      } else {
        toast.error('Error: ' + result.message);
      }
    } catch (err) {
      toast.error('Network error: ' + err.message);
    }
  };

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    const { name, email, password } = newAdmin;
    if (!name || !email || !password) { toast.error('All fields are required'); return; }
    try {
      const response = await fetch('/api/admin/add-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(`Admin "${data.user.name}" created successfully!`);
        setNewAdmin({ name: '', email: '', password: '' });
        fetchAdmins();
      } else {
        toast.error(`Error: ${data.message || 'Unknown error occurred'}`);
      }
    } catch (err) {
      console.error('Error adding admin:', err);
      toast.error('Network error: ' + err.message);
    }
  };

  // ✏️ UPDATE Operations
  const handleUpdateNote = async (e) => {
    e.preventDefault();
    if (!editingNote) return;
    
    // If it's a PDF and a new file is selected, upload it first
    let finalLink = editingNote.link;
    if (editingNote.fileType === 'PDF' && file) {
      const uploaded = await handleCloudinaryUpload();
      if (uploaded) finalLink = uploaded;
    }

    const payload = {
      subject: editingNote.subject,
      courseName: editingNote.courseName,
      semester: parseInt(editingNote.semester, 10),
      fileType: editingNote.fileType,
      link: finalLink,
    };

    try {
      const res = await fetch(`/api/notes/${editingNote._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (res.ok) {
        toast.success('Resource updated successfully!');
        setEditingNote(null);
        setFile(null);
        fetchNotes();
      } else {
        toast.error('Error: ' + result.error);
      }
    } catch (err) {
      toast.error('Network error: ' + err.message);
    }
  };

  const handleUpdateCourse = async (e) => {
    e.preventDefault();
    if (!editingCourse) return;
    try {
      const res = await fetch(`/api/courses/${editingCourse._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseName: editingCourse.courseName,
          semester: parseInt(editingCourse.semester, 10),
          description: editingCourse.description,
        }),
      });
      const result = await res.json();
      if (res.ok) {
        toast.success('Course updated successfully!');
        setEditingCourse(null);
        fetchCourses();
      } else {
        toast.error('Error: ' + result.error);
      }
    } catch (err) {
      toast.error('Network error: ' + err.message);
    }
  };

  const handleUpdateAdmin = async (e) => {
    e.preventDefault();
    if (!editingAdmin) return;
    try {
      const payload = {
        name: editingAdmin.name,
        email: editingAdmin.email,
      };
      // Only include password if it was actually changed/filled out
      if (editingAdmin.password && editingAdmin.password.trim() !== '') {
        payload.password = editingAdmin.password;
      }

      const res = await fetch(`/api/admins/${editingAdmin._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (res.ok) {
        toast.success('Admin updated successfully!');
        setEditingAdmin(null);
        fetchAdmins();
      } else {
        toast.error('Error: ' + result.error);
      }
    } catch (err) {
      toast.error('Network error: ' + err.message);
    }
  };

  // 🗑️ DELETE Operations
  const deleteNote = async (id) => {
    if (!confirm('Are you sure you want to delete this note?')) return;
    try {
      const res = await fetch(`/api/notes/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || 'Note deleted successfully');
        setNotes(notes.filter(n => n._id !== id));
      } else {
        toast.error(data.error || 'Failed to delete note');
      }
    } catch (err) { toast.error('Network error: ' + err.message); }
  };

  const deleteCourse = async (id) => {
    if (!confirm('Are you sure you want to delete this course?')) return;
    try {
      const res = await fetch(`/api/courses/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || 'Course deleted successfully');
        setCourses(courses.filter(c => c._id !== id));
      } else {
        toast.error(data.error || 'Failed to delete course');
      }
    } catch (err) { toast.error('Network error: ' + err.message); }
  };

  const deleteAdmin = async (id) => {
    if (!confirm('Are you sure you want to delete this admin?')) return;
    try {
      const res = await fetch(`/api/admins/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || 'Admin deleted successfully');
        setAdmins(admins.filter(a => a._id !== id));
      } else {
        toast.error(data.error || 'Failed to delete admin');
      }
    } catch (err) { toast.error('Network error: ' + err.message); }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <p className="text-gray-400 animate-pulse">Loading admin dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col md:flex-row">
      
      {/* 📱 Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-black/40 backdrop-blur-sm border-b md:border-b-0 md:border-r border-purple-500/20 flex-shrink-0">
        <div className="p-4 md:p-6 border-b border-purple-500/20">
          <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 text-transparent bg-clip-text">
            Admin Panel
          </h1>
        </div>
        <nav className="flex md:flex-col p-2 md:p-4 space-x-2 md:space-x-0 md:space-y-2 overflow-x-auto">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: '📊' },
            { id: 'notes', label: 'Notes Management', icon: '📝' },
            { id: 'courses', label: 'Course Management', icon: '📚' },
            { id: 'admins', label: 'Admin Management', icon: '👥' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center space-x-3 px-4 py-2 md:py-3 rounded-xl transition-all duration-200 whitespace-nowrap ${
                activeTab === item.id
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span>{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="hidden md:block p-4 border-t border-purple-500/20 mt-auto">
          <button
            onClick={() => router.push('/')}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all duration-200"
          >
            <span>🚪</span>
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* 🖥️ Main Content Area */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        
        {/* 📊 Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-3xl p-8 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-white mb-2">
                Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Admin</span>
              </h2>
              <p className="text-gray-300 text-lg">Manage courses, upload resources, and add new administrators.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-3xl p-6">
                <div className="text-gray-400 text-sm font-medium mb-2">Total Courses</div>
                <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">{courses.length}</div>
              </div>
              <div className="bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-3xl p-6">
                <div className="text-gray-400 text-sm font-medium mb-2">Total Notes</div>
                <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">{notes.length}</div>
              </div>
              <div className="bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-3xl p-6">
                <div className="text-gray-400 text-sm font-medium mb-2">Total Admins</div>
                <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-400">{admins.length}</div>
              </div>
            </div>
          </div>
        )}

        {/* 📝 Notes Management Tab */}
        {activeTab === 'notes' && (
          <div className="space-y-8">
            {/* Create / Update Form */}
            <div className="bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-3xl p-6 md:p-8">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                <span className={`w-8 h-8 bg-gradient-to-r ${editingNote ? 'from-amber-500 to-orange-500' : 'from-purple-500 to-pink-500'} rounded-lg flex items-center justify-center mr-3 text-sm`}>
                  {editingNote ? '✏️' : '📤'}
                </span>
                {editingNote ? 'Update Resource' : 'Upload New Resource'}
              </h3>
              
              <form onSubmit={editingNote ? handleUpdateNote : handleSubmitNote} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Subject</label>
                  <input 
                    type="text" 
                    placeholder="e.g., Database Management Systems" 
                    value={editingNote ? editingNote.subject : uploadData.subject} 
                    onChange={(e) => editingNote ? setEditingNote({...editingNote, subject: e.target.value}) : setUploadData({ ...uploadData, subject: e.target.value })} 
                    className="w-full px-4 py-3 bg-black/60 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500" 
                    required 
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Course</label>
                    <select 
                      value={editingNote ? editingNote.courseName : uploadData.courseName} 
                      onChange={(e) => editingNote ? setEditingNote({...editingNote, courseName: e.target.value}) : setUploadData({ ...uploadData, courseName: e.target.value })} 
                      className="w-full px-4 py-3 bg-black/60 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500" 
                      required
                    >
                      <option value="">Select Course</option>
                      {courses.map((course) => (
                        <option key={course._id} value={course.courseName}>{course.courseName} (Sem {course.semester})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Semester</label>
                    <select 
                      value={editingNote ? editingNote.semester : uploadData.semester} 
                      onChange={(e) => editingNote ? setEditingNote({...editingNote, semester: parseInt(e.target.value, 10)}) : setUploadData({ ...uploadData, semester: parseInt(e.target.value, 10) })} 
                      className="w-full px-4 py-3 bg-black/60 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500" 
                      required
                    >
                      <option value="">Select Semester</option>
                      {option.map((sem) => (<option key={sem} value={sem}>Semester {sem}</option>))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Resource Type</label>
                  <select 
                    value={editingNote ? editingNote.fileType : uploadData.fileType} 
                    onChange={(e) => {
                      const val = e.target.value;
                      editingNote ? setEditingNote({...editingNote, fileType: val, link: ''}) : setUploadData({ ...uploadData, fileType: val, link: '' });
                    }} 
                    className="w-full px-4 py-3 bg-black/60 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500" 
                    required
                  >
                    <option value="PDF">PDF Notes</option>
                    <option value="YouTubeLink">YouTube Video</option>
                    <option value="ExternalLink">External Link</option>
                  </select>
                </div>
                
                {(editingNote ? editingNote.fileType : uploadData.fileType) === 'PDF' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      {editingNote ? 'Replace PDF File (Optional)' : 'Upload PDF File'}
                    </label>
                    <input 
                      type="file" 
                      accept=".pdf" 
                      onChange={handleFileChange} 
                      className="w-full px-4 py-3 bg-black/60 border border-gray-600 rounded-xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-purple-500 file:text-white hover:file:bg-purple-600" 
                      required={!editingNote && !uploadedUrl} 
                    />
                    {uploading && <div className="flex items-center mt-2 text-blue-400"><svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Uploading...</div>}
                    {uploadedUrl && <div className="flex items-center mt-2 text-green-400">✅ New file uploaded successfully!</div>}
                  </div>
                )}
                
                {(editingNote ? editingNote.fileType : uploadData.fileType) !== 'PDF' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      {(editingNote ? editingNote.fileType : uploadData.fileType) === 'YouTubeLink' ? 'YouTube URL' : 'External Link'}
                    </label>
                    <input 
                      type="url" 
                      placeholder={(editingNote ? editingNote.fileType : uploadData.fileType) === 'YouTubeLink' ? 'https://youtube.com/watch?v=...' : 'https://example.com/resource'} 
                      value={editingNote ? editingNote.link : uploadData.link} 
                      onChange={(e) => editingNote ? setEditingNote({...editingNote, link: e.target.value}) : setUploadData({ ...uploadData, link: e.target.value })} 
                      className="w-full px-4 py-3 bg-black/60 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500" 
                      required 
                    />
                  </div>
                )}
                
                <div className="flex gap-4">
                  <button 
                    type="submit" 
                    disabled={uploading} 
                    className={`flex-1 text-white py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed ${
                      editingNote ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:shadow-amber-500/25' : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-purple-500/25'
                    }`}
                  >
                    {uploading ? 'Processing...' : (editingNote ? 'Update Resource' : 'Upload Resource')}
                  </button>
                  {editingNote && (
                    <button 
                      type="button" 
                      onClick={() => { setEditingNote(null); setFile(null); setUploadedUrl(''); }}
                      className="px-6 py-3 bg-gray-600 text-white rounded-xl font-medium hover:bg-gray-700 transition-all duration-200"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Existing Notes Table */}
            <div className="bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-3xl p-6 md:p-8">
              <h3 className="text-xl font-semibold text-white mb-4">Existing Notes</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-gray-300">
                  <thead className="text-gray-400 border-b border-purple-500/20">
                    <tr>
                      <th className="pb-3">Subject</th>
                      <th className="pb-3">Course</th>
                      <th className="pb-3">Sem</th>
                      <th className="pb-3">Type</th>
                      <th className="pb-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-purple-500/10">
                    {notes.length === 0 ? (
                      <tr><td colSpan="5" className="py-4 text-center text-gray-500">No notes found.</td></tr>
                    ) : (
                      notes.map((note) => (
                        <tr key={note._id} className={`hover:bg-white/5 transition-colors ${editingNote?._id === note._id ? 'bg-amber-500/10' : ''}`}>
                          <td className="py-3">{note.subject}</td>
                          <td className="py-3">{note.courseName}</td>
                          <td className="py-3">{note.semester}</td>
                          <td className="py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${note.fileType === 'PDF' ? 'bg-red-500/20 text-red-300' : note.fileType === 'YouTubeLink' ? 'bg-red-600/20 text-red-400' : 'bg-blue-500/20 text-blue-300'}`}>
                              {note.fileType.replace('Link', '')}
                            </span>
                          </td>
                          <td className="py-3 text-right space-x-2">
                            <button onClick={() => { setEditingNote(note); setFile(null); setUploadedUrl(''); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 px-3 py-1 rounded-lg transition-colors">Edit</button>
                            <button onClick={() => deleteNote(note._id)} className="text-red-400 hover:text-red-300 hover:bg-red-500/10 px-3 py-1 rounded-lg transition-colors">Delete</button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 📚 Course Management Tab */}
        {activeTab === 'courses' && (
          <div className="space-y-8">
            <div className="bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-3xl p-6 md:p-8">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                <span className={`w-8 h-8 bg-gradient-to-r ${editingCourse ? 'from-amber-500 to-orange-500' : 'from-blue-500 to-cyan-500'} rounded-lg flex items-center justify-center mr-3 text-sm`}>
                  {editingCourse ? '✏️' : '➕'}
                </span>
                {editingCourse ? 'Update Course/Semester' : 'Add New Course/Semester'}
              </h3>
              <form onSubmit={editingCourse ? handleUpdateCourse : handleAddCourse} className="space-y-4 max-w-2xl">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Course Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g., BCA" 
                    value={editingCourse ? editingCourse.courseName : newCourse.courseName} 
                    onChange={(e) => editingCourse ? setEditingCourse({...editingCourse, courseName: e.target.value}) : setNewCourse({ ...newCourse, courseName: e.target.value })} 
                    className="w-full px-4 py-3 bg-black/60 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Total Semesters</label>
                  <input 
                    type="number" 
                    min="1" max="10" 
                    placeholder="e.g., 6" 
                    value={editingCourse ? editingCourse.semester : (newCourse.semester || '')} 
                    onChange={(e) => editingCourse ? setEditingCourse({...editingCourse, semester: parseInt(e.target.value, 10) || ''}) : setNewCourse({ ...newCourse, semester: parseInt(e.target.value, 10) || '' })} 
                    className="w-full px-4 py-3 bg-black/60 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Description (Optional)</label>
                  <textarea 
                    placeholder="Brief description..." 
                    value={editingCourse ? editingCourse.description : (newCourse.description || '')} 
                    onChange={(e) => editingCourse ? setEditingCourse({...editingCourse, description: e.target.value}) : setNewCourse({ ...newCourse, description: e.target.value })} 
                    className="w-full px-4 py-3 bg-black/60 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none" 
                    rows="3" 
                  />
                </div>
                <div className="flex gap-4">
                  <button type="submit" className={`flex-1 md:flex-none px-8 text-white py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200 ${editingCourse ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:shadow-amber-500/25' : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:shadow-blue-500/25'}`}>
                    {editingCourse ? 'Update Course' : 'Add Course'}
                  </button>
                  {editingCourse && (
                    <button type="button" onClick={() => setEditingCourse(null)} className="px-6 py-3 bg-gray-600 text-white rounded-xl font-medium hover:bg-gray-700 transition-all duration-200">Cancel</button>
                  )}
                </div>
              </form>
            </div>

            {/* Existing Courses Table */}
            <div className="bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-3xl p-6 md:p-8">
              <h3 className="text-xl font-semibold text-white mb-4">Existing Courses</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-gray-300">
                  <thead className="text-gray-400 border-b border-purple-500/20">
                    <tr>
                      <th className="pb-3">Course Name</th>
                      <th className="pb-3">Semesters</th>
                      <th className="pb-3">Description</th>
                      <th className="pb-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-purple-500/10">
                    {courses.length === 0 ? (
                      <tr><td colSpan="4" className="py-4 text-center text-gray-500">No courses found.</td></tr>
                    ) : (
                      courses.map((course) => (
                        <tr key={course._id} className={`hover:bg-white/5 transition-colors ${editingCourse?._id === course._id ? 'bg-amber-500/10' : ''}`}>
                          <td className="py-3 font-medium text-white">{course.courseName}</td>
                          <td className="py-3">{course.semester}</td>
                          <td className="py-3 text-gray-400 text-sm max-w-xs truncate">{course.description || 'N/A'}</td>
                          <td className="py-3 text-right space-x-2">
                            <button onClick={() => { setEditingCourse(course); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 px-3 py-1 rounded-lg transition-colors">Edit</button>
                            <button onClick={() => deleteCourse(course._id)} className="text-red-400 hover:text-red-300 hover:bg-red-500/10 px-3 py-1 rounded-lg transition-colors">Delete</button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 👥 Admin Management Tab */}
        {activeTab === 'admins' && (
          <div className="space-y-8">
            <div className="bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-3xl p-6 md:p-8">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                <span className={`w-8 h-8 bg-gradient-to-r ${editingAdmin ? 'from-amber-500 to-orange-500' : 'from-green-500 to-teal-500'} rounded-lg flex items-center justify-center mr-3 text-sm`}>
                  {editingAdmin ? '✏️' : '🛡️'}
                </span>
                {editingAdmin ? 'Update Admin' : 'Add New Admin'}
              </h3>
              <form onSubmit={editingAdmin ? handleUpdateAdmin : handleAddAdmin} className="space-y-4 max-w-2xl">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                  <input 
                    type="text" 
                    placeholder="Full name" 
                    value={editingAdmin ? editingAdmin.name : newAdmin.name} 
                    onChange={(e) => editingAdmin ? setEditingAdmin({...editingAdmin, name: e.target.value}) : setNewAdmin({ ...newAdmin, name: e.target.value })} 
                    className="w-full px-4 py-3 bg-black/60 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <input 
                    type="email" 
                    placeholder="admin@example.com" 
                    value={editingAdmin ? editingAdmin.email : newAdmin.email} 
                    onChange={(e) => editingAdmin ? setEditingAdmin({...editingAdmin, email: e.target.value}) : setNewAdmin({ ...newAdmin, email: e.target.value })} 
                    className="w-full px-4 py-3 bg-black/60 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Password {editingAdmin && <span className="text-gray-500 text-xs font-normal">(Leave blank to keep current)</span>}
                  </label>
                  <input 
                    type="password" 
                    placeholder={editingAdmin ? "•••••••• (Optional)" : "••••••••"} 
                    value={editingAdmin ? editingAdmin.password : newAdmin.password} 
                    onChange={(e) => editingAdmin ? setEditingAdmin({...editingAdmin, password: e.target.value}) : setNewAdmin({ ...newAdmin, password: e.target.value })} 
                    className="w-full px-4 py-3 bg-black/60 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500" 
                    required={!editingAdmin} 
                  />
                </div>
                <div className="flex gap-4">
                  <button type="submit" className={`flex-1 md:flex-none px-8 text-white py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200 ${editingAdmin ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:shadow-amber-500/25' : 'bg-gradient-to-r from-green-500 to-teal-500 hover:shadow-green-500/25'}`}>
                    {editingAdmin ? 'Update Admin' : 'Add Admin'}
                  </button>
                  {editingAdmin && (
                    <button type="button" onClick={() => setEditingAdmin(null)} className="px-6 py-3 bg-gray-600 text-white rounded-xl font-medium hover:bg-gray-700 transition-all duration-200">Cancel</button>
                  )}
                </div>
              </form>
            </div>

            {/* Existing Admins Table */}
            <div className="bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-3xl p-6 md:p-8">
              <h3 className="text-xl font-semibold text-white mb-4">Existing Admins</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-gray-300">
                  <thead className="text-gray-400 border-b border-purple-500/20">
                    <tr>
                      <th className="pb-3">Name</th>
                      <th className="pb-3">Email</th>
                      <th className="pb-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-purple-500/10">
                    {admins.length === 0 ? (
                      <tr><td colSpan="3" className="py-4 text-center text-gray-500">No admins found.</td></tr>
                    ) : (
                      admins.map((admin) => (
                        <tr key={admin._id} className={`hover:bg-white/5 transition-colors ${editingAdmin?._id === admin._id ? 'bg-amber-500/10' : ''}`}>
                          <td className="py-3 font-medium text-white">{admin.name}</td>
                          <td className="py-3">{admin.email}</td>
                          <td className="py-3 text-right space-x-2">
                            {admin.email === ALLOWED_ADMIN_EMAIL ? (
                              <span className="text-gray-500 text-sm px-3 py-1 bg-white/5 rounded-lg border border-white/10">Super Admin</span>
                            ) : (
                              <>
                                <button onClick={() => { setEditingAdmin(admin); }} className="text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 px-3 py-1 rounded-lg transition-colors">Edit</button>
                                <button onClick={() => deleteAdmin(admin._id)} className="text-red-400 hover:text-red-300 hover:bg-red-500/10 px-3 py-1 rounded-lg transition-colors">Delete</button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}