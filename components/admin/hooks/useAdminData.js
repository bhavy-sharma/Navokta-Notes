import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export function useAdminData(allowedAdminEmail, router) {
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [notes, setNotes] = useState([]);
  const [admins, setAdmins] = useState([]);

  // Auth check
  useEffect(() => {
    const currentUser = { email: allowedAdminEmail, name: 'Admin User', role: 'admin' };

    if (currentUser.email !== allowedAdminEmail) {
      toast.error('Access denied. Admins only.');
      router.push('/');
      setLoading(false);
      return;
    }

    fetchAllData();
  }, [router, allowedAdminEmail]);

  const fetchAllData = async () => {
    setLoading(true);
    await Promise.all([
      fetchCourses(),
      fetchNotes(),
      fetchAdmins()
    ]);
    setLoading(false);
  };

  // Fetch Functions
  const fetchCourses = async () => {
    try {
      const res = await fetch('/api/courses');
      if (res.ok) {
        const data = await res.json();
        setCourses(data);
        return data;
      }
    } catch (err) {
      console.error('Failed to load courses:', err);
      toast.error('Failed to load courses');
    }
  };

  const fetchNotes = async () => {
    try {
      const res = await fetch('/api/notes');
      if (res.ok) {
        const data = await res.json();
        setNotes(data);
        return data;
      }
    } catch (err) {
      console.error('Failed to load notes:', err);
      toast.error('Failed to load notes');
    }
  };

  const fetchAdmins = async () => {
    try {
      const res = await fetch('/api/admin');
      if (res.ok) {
        const data = await res.json();
        setAdmins(data);
        return data;
      } else {
        const error = await res.json();
        toast.error(error.error || 'Failed to load admins');
      }
    } catch (err) {
      console.error('Failed to load admins:', err);
      toast.error('Failed to load admins');
    }
  };

  // ============ ADMIN OPERATIONS ============
  
  const addAdmin = async (payload) => {
    try {
      const response = await fetch('/api/admin/add-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast.success(`Admin "${data.user?.name || 'New Admin'}" created successfully!`);
        // Refresh admins list
        await fetchAdmins();
        return data;
      } else {
        toast.error(`Error: ${data.message || 'Unknown error occurred'}`);
        return null;
      }
    } catch (err) {
      console.error('Error adding admin:', err);
      toast.error('Network error: ' + err.message);
      return null;
    }
  };

  const updateAdmin = async (id, payload) => {
    try {
      const res = await fetch(`/api/admin/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      
      const result = await res.json();
      
      if (res.ok) {
        toast.success('Admin updated successfully!');
        await fetchAdmins();
        return result;
      } else {
        toast.error('Error: ' + (result.error || 'Unknown error'));
        return null;
      }
    } catch (err) {
      console.error('Error updating admin:', err);
      toast.error('Network error: ' + err.message);
      return null;
    }
  };

  const deleteAdmin = async (id) => {
    try {
      const res = await fetch(`/api/admin/${id}`, { 
        method: 'DELETE' 
      });
      
      const data = await res.json();
      
      if (res.ok) {
        toast.success(data.message || 'Admin deleted successfully');
        // Update local state
        setAdmins(prev => prev.filter(a => a._id !== id));
        return true;
      } else {
        toast.error(data.error || 'Failed to delete admin');
        return false;
      }
    } catch (err) {
      console.error('Error deleting admin:', err);
      toast.error('Network error: ' + err.message);
      return false;
    }
  };

  // ============ COURSE OPERATIONS ============
  
  const addCourse = async (payload) => {
    try {
      const res = await fetch('/api/admin/add-course', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (res.ok) {
        toast.success('Course added successfully!');
        await fetchCourses();
        return result;
      } else {
        toast.error('Error: ' + result.message);
        return null;
      }
    } catch (err) {
      toast.error('Network error: ' + err.message);
      return null;
    }
  };

  const updateCourse = async (id, payload) => {
    try {
      const res = await fetch(`/api/courses/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (res.ok) {
        toast.success('Course updated successfully!');
        await fetchCourses();
        return result;
      } else {
        toast.error('Error: ' + result.error);
        return null;
      }
    } catch (err) {
      toast.error('Network error: ' + err.message);
      return null;
    }
  };

  const deleteCourse = async (id) => {
    try {
      const res = await fetch(`/api/courses/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || 'Course deleted successfully');
        setCourses(prev => prev.filter(c => c._id !== id));
        return true;
      } else {
        toast.error(data.error || 'Failed to delete course');
        return false;
      }
    } catch (err) {
      toast.error('Network error: ' + err.message);
      return false;
    }
  };

  // ============ NOTE OPERATIONS ============
  
  const uploadNote = async (payload) => {
    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (res.ok) {
        toast.success('Resource uploaded successfully!');
        await fetchNotes();
        return result;
      } else {
        toast.error('Error: ' + result.message);
        return null;
      }
    } catch (err) {
      toast.error('Network error: ' + err.message);
      return null;
    }
  };

  const updateNote = async (id, payload) => {
    try {
      const res = await fetch(`/api/notes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (res.ok) {
        toast.success('Resource updated successfully!');
        await fetchNotes();
        return result;
      } else {
        toast.error('Error: ' + result.error);
        return null;
      }
    } catch (err) {
      toast.error('Network error: ' + err.message);
      return null;
    }
  };

  const deleteNote = async (id) => {
    try {
      const res = await fetch(`/api/notes/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || 'Note deleted successfully');
        setNotes(prev => prev.filter(n => n._id !== id));
        return true;
      } else {
        toast.error(data.error || 'Failed to delete note');
        return false;
      }
    } catch (err) {
      toast.error('Network error: ' + err.message);
      return false;
    }
  };

  return {
    loading,
    courses,
    notes,
    admins,
    setCourses,
    setNotes,
    setAdmins,
    fetchCourses,
    fetchNotes,
    fetchAdmins,
    fetchAllData,
    uploadNote,
    updateNote,
    deleteNote,
    addCourse,
    updateCourse,
    deleteCourse,
    addAdmin,
    updateAdmin,
    deleteAdmin,
  };
}