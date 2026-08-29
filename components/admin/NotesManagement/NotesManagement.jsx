'use client';

import { useState, useMemo } from 'react';
import NoteForm from './NoteForm';
import NotesTable from './NotesTable';
import SearchBar from '../SearchBar';

export default function NotesManagement({
  courses,
  notes,
  onUpload,
  onUpdate,
  onDelete,
  refreshNotes,
  setNotes,
  searchQuery,
  setSearchQuery,
}) {
  const [editingNote, setEditingNote] = useState(null);

  // Filter notes based on search query
  const filteredNotes = useMemo(() => {
    if (!searchQuery.trim()) return notes;
    
    const query = searchQuery.toLowerCase().trim();
    return notes.filter((note) => {
      return (
        note.subject?.toLowerCase().includes(query) ||
        note.courseName?.toLowerCase().includes(query) ||
        note.fileType?.toLowerCase().includes(query) ||
        note.semester?.toString().includes(query) ||
        note.link?.toLowerCase().includes(query)
      );
    });
  }, [notes, searchQuery]);

  const handleEdit = (note) => {
    setEditingNote(note);
    setTimeout(() => {
      const formElement = document.querySelector('.note-form-container');
      if (formElement) {
        formElement.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 200);
  };

  const handleUpdate = async (id, payload) => {
    const result = await onUpdate(id, payload);
    if (result) {
      setEditingNote(null);
    }
    return result;
  };

  const handleCancelEdit = () => {
    setEditingNote(null);
  };

  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8">
      {/* Search Bar */}
      <div className="bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-2xl sm:rounded-3xl p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
          <div className="flex-1 w-full">
            <SearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              placeholder="Search notes by subject, course, type..."
              totalItems={notes.length}
              filteredItems={filteredNotes.length}
            />
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500 whitespace-nowrap">
            <span className="hidden sm:inline">📝</span>
            <span>Total: <span className="text-white font-medium">{notes.length}</span></span>
          </div>
        </div>
      </div>

      <NoteForm
        courses={courses}
        onSubmit={onUpload}
        onUpdate={handleUpdate}
        editingNote={editingNote}
        setEditingNote={setEditingNote}
        onCancelEdit={handleCancelEdit}
      />
      
      <NotesTable
        notes={filteredNotes}
        onDelete={onDelete}
        onEdit={handleEdit}
        editingNoteId={editingNote?._id}
        searchQuery={searchQuery}
      />
    </div>
  );
}