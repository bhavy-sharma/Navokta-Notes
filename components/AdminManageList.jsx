import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export default function AdminManageList() {
  const [courses, setCourses] = useState([]);
  const [resources, setResources] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [activeTab, setActiveTab] = useState('courses');
  
  // Modals state
  const [editCourse, setEditCourse] = useState(null);
  const [editResource, setEditResource] = useState(null);
  const [editAdmin, setEditAdmin] = useState(null);

  useEffect(() => {
    fetchCourses();
    fetchResources();
    fetchAdmins();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await fetch('/api/courses');
      const data = await res.json();
      console.log('Fetched courses:', data);
      if (res.ok) {
        setCourses(Array.isArray(data) ? data : data.data || []);
      }
    } catch(err) { console.error('Fetch Courses Error:', err); }
  };

  const fetchResources = async () => {
    try {
      const res = await fetch('/api/resource');
      const json = await res.json();
      console.log('Fetched resources:', json);
      if (res.ok && json.data) {
        setResources(json.data);
      }
    } catch(err) { console.error('Fetch Resources Error:', err); }
  };

  const fetchAdmins = async () => {
    try {
      const res = await fetch('/api/admin/manage-admin');
      const data = await res.json();
      console.log('Fetched admins:', data);
      if (res.ok) setAdmins(Array.isArray(data) ? data : []);
    } catch(err) { console.error('Fetch Admins Error:', err); }
  };

  // --- Handlers ---
  const handleUpdateCourse = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/manage-course', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editCourse._id, courseName: editCourse.courseName, semester: editCourse.semester, description: editCourse.description })
      });
      if(res.ok) { toast.success('Course updated'); setEditCourse(null); fetchCourses(); }
      else { toast.error('Update failed'); }
    } catch(err) { toast.error(err.message); }
  };

  const handleDeleteCourse = async (id) => {
    if(!confirm("Are you sure you want to delete this course?")) return;
    try {
      const res = await fetch('/api/admin/manage-course', { method: 'DELETE', body: JSON.stringify({id}) });
      if(res.ok) { toast.success('Deleted successfully'); fetchCourses(); }
      else toast.error('Failed to delete');
    } catch(err) { toast.error(err.message); }
  };

  const handleUpdateResource = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/manage-resource', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editResource._id, subject: editResource.subject, fileType: editResource.fileType, link: editResource.link })
      });
      if(res.ok) { toast.success('Resource updated'); setEditResource(null); fetchResources(); }
      else { toast.error('Update failed'); }
    } catch(err) { toast.error(err.message); }
  };

  const handleDeleteResource = async (id) => {
    if(!confirm("Are you sure?")) return;
    try {
      const res = await fetch('/api/admin/manage-resource', { method: 'DELETE', body: JSON.stringify({id}) });
      if(res.ok) { toast.success('Deleted successfully'); fetchResources(); }
      else toast.error('Failed to delete');
    } catch(err) { toast.error(err.message); }
  };

  const handleUpdateAdmin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/manage-admin', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editAdmin._id, name: editAdmin.name, email: editAdmin.email, password: editAdmin.password })
      });
      if(res.ok) { toast.success('Admin updated'); setEditAdmin(null); fetchAdmins(); }
      else { toast.error('Update failed'); }
    } catch(err) { toast.error(err.message); }
  };

  const handleDeleteAdmin = async (id) => {
    if(!confirm("Are you sure?")) return;
    try {
      const res = await fetch('/api/admin/manage-admin', { method: 'DELETE', body: JSON.stringify({id}) });
      if(res.ok) { toast.success('Deleted successfully'); fetchAdmins(); }
      else toast.error('Failed to delete');
    } catch(err) { toast.error(err.message); }
  };

  return (
    <div className="mt-12 bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-3xl p-8 mb-12">
      <h3 className="text-2xl font-bold text-white mb-6">Manage Existing Records</h3>
      
      {/* Tabs Menu */}
      <div className="flex space-x-4 mb-6 border-b border-gray-700 pb-2">
        <button onClick={() => setActiveTab('courses')} className={`px-4 py-2 font-medium rounded-t-lg transition-colors ${activeTab === 'courses' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}>Courses</button>
        <button onClick={() => setActiveTab('resources')} className={`px-4 py-2 font-medium rounded-t-lg transition-colors ${activeTab === 'resources' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}>Resources</button>
        <button onClick={() => setActiveTab('admins')} className={`px-4 py-2 font-medium rounded-t-lg transition-colors ${activeTab === 'admins' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}>Admins</button>
      </div>

      {/* TABS CONTENT */}
      {activeTab === 'courses' && (
        <div className="overflow-x-auto text-white">
          {courses.length === 0 ? (
            <div className="text-gray-400 italic py-4">No courses found or loading...</div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="py-2">Name</th><th className="py-2">Semester</th><th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map(course => (
                  <tr key={course._id} className="border-b border-gray-800 hover:bg-white/5 transition">
                    <td className="py-3 px-2">{course.courseName}</td>
                    <td className="py-3 px-2">Sem {course.semester}</td>
                    <td className="py-3 px-2 flex space-x-2">
                      <button onClick={() => setEditCourse(course)} className="px-3 py-1 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-lg hover:bg-blue-600/40 hover:text-white transition text-sm">Edit</button>
                      <button onClick={() => handleDeleteCourse(course._id)} className="px-3 py-1 bg-red-600/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-600/40 hover:text-white transition text-sm">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {editCourse && (
            <form onSubmit={handleUpdateCourse} className="mt-4 p-4 border border-blue-500/30 rounded-lg space-y-3">
              <h4 className="font-semibold text-blue-300">Edit Course</h4>
              <input type="text" value={editCourse.courseName} onChange={(e) => setEditCourse({...editCourse, courseName: e.target.value})} className="w-full p-2 bg-gray-900 border border-gray-700 rounded text-white" />
              <input type="number" value={editCourse.semester} onChange={(e) => setEditCourse({...editCourse, semester: e.target.value})} className="w-full p-2 bg-gray-900 border border-gray-700 rounded text-white" />
              <div className="flex space-x-2">
                <button type="submit" className="px-4 py-2 bg-blue-600 rounded">Save</button>
                <button type="button" onClick={() => setEditCourse(null)} className="px-4 py-2 bg-gray-700 rounded">Cancel</button>
              </div>
            </form>
          )}
        </div>
      )}

      {activeTab === 'resources' && (
        <div className="overflow-x-auto text-white">
          {resources.length === 0 ? (
            <div className="text-gray-400 italic py-4">No resources found or loading...</div>
          ) : (
            <table className="w-full text-left max-h-96 block overflow-y-auto">
              <thead className="sticky top-0 bg-gray-900 border-b border-gray-700">
                <tr>
                  <th className="py-2 px-3">Subject</th>
                  <th className="py-2 px-3">Course</th>
                  <th className="py-2 px-3">Type</th>
                  <th className="py-2 px-3">Actions</th>
                </tr>
              </thead>
              <tbody className="w-full table">
                {resources.map(res => (
                  <tr key={res._id} className="border-b border-gray-800 hover:bg-white/5 transition">
                    <td className="py-3 px-3">{res.subject}</td>
                    <td className="py-3 px-3">{res.courseName} - Sem {res.semester}</td>
                    <td className="py-3 px-3 text-xs font-semibold uppercase tracking-wider text-purple-400">{res.fileType}</td>
                    <td className="py-3 px-3 flex space-x-2">
                       <button onClick={() => setEditResource(res)} className="px-3 py-1 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-lg hover:bg-blue-600/40 hover:text-white transition text-sm">Edit</button>
                       <button onClick={() => handleDeleteResource(res._id)} className="px-3 py-1 bg-red-600/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-600/40 hover:text-white transition text-sm">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {editResource && (
             <form onSubmit={handleUpdateResource} className="mt-4 p-4 border border-blue-500/30 rounded-lg space-y-3">
             <h4 className="font-semibold text-blue-300">Edit Resource</h4>
             <input type="text" value={editResource.subject} onChange={(e) => setEditResource({...editResource, subject: e.target.value})} className="w-full p-2 bg-gray-900 border border-gray-700 rounded text-white" />
             <input type="text" value={editResource.link} onChange={(e) => setEditResource({...editResource, link: e.target.value})} className="w-full p-2 bg-gray-900 border border-gray-700 rounded text-white" />
             <div className="flex space-x-2">
               <button type="submit" className="px-4 py-2 bg-blue-600 rounded">Save</button>
               <button type="button" onClick={() => setEditResource(null)} className="px-4 py-2 bg-gray-700 rounded">Cancel</button>
             </div>
           </form>
          )}
        </div>
      )}

      {activeTab === 'admins' && (
        <div className="overflow-x-auto text-white">
          {admins.length === 0 ? (
            <div className="text-gray-400 italic py-4">No admins found or loading...</div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="py-2 px-3">Name</th><th className="py-2 px-3">Email</th><th className="py-2 px-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {admins.map(adm => (
                  <tr key={adm._id} className="border-b border-gray-800 hover:bg-white/5 transition">
                    <td className="py-3 px-3">{adm.name}</td>
                    <td className="py-3 px-3">{adm.email}</td>
                    <td className="py-3 px-3 flex space-x-2">
                       <button onClick={() => setEditAdmin(adm)} className="px-3 py-1 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-lg hover:bg-blue-600/40 hover:text-white transition text-sm">Edit</button>
                       <button onClick={() => handleDeleteAdmin(adm._id)} className="px-3 py-1 bg-red-600/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-600/40 hover:text-white transition text-sm">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {editAdmin && (
             <form onSubmit={handleUpdateAdmin} className="mt-4 p-4 border border-blue-500/30 rounded-lg space-y-3">
             <h4 className="font-semibold text-blue-300">Edit Admin</h4>
             <input type="text" value={editAdmin.name} onChange={(e) => setEditAdmin({...editAdmin, name: e.target.value})} className="w-full p-2 bg-gray-900 border border-gray-700 rounded text-white" />
             <input type="text" value={editAdmin.email} onChange={(e) => setEditAdmin({...editAdmin, email: e.target.value})} className="w-full p-2 bg-gray-900 border border-gray-700 rounded text-white" />
             <input type="password" placeholder="New Password (optional)" value={editAdmin.password || ''} onChange={(e) => setEditAdmin({...editAdmin, password: e.target.value})} className="w-full p-2 bg-gray-900 border border-gray-700 rounded text-white" />
             <div className="flex space-x-2">
               <button type="submit" className="px-4 py-2 bg-blue-600 rounded">Save</button>
               <button type="button" onClick={() => setEditAdmin(null)} className="px-4 py-2 bg-gray-700 rounded">Cancel</button>
             </div>
           </form>
          )}
        </div>
      )}
    </div>
  );
}
