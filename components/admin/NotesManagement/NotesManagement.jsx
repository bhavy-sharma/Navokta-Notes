'use client';

import { useState } from 'react';
import NoteForm from './NoteForm';
import NotesTable from './NotesTable';

export default function NotesManagement({
  courses,
  notes,
  onUpload,
  onUpdate,
  onDelete,
  refreshNotes,
  setNotes,
}) {
  const [editingNote, setEditingNote] = useState(null);

  const handleEdit = (note) => {
    setEditingNote(note);
    // Scroll to form on mobile
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
      <NoteForm
        courses={courses}
        onSubmit={onUpload}
        onUpdate={handleUpdate}
        editingNote={editingNote}
        setEditingNote={setEditingNote}
        onCancelEdit={handleCancelEdit}
      />
      <NotesTable
        notes={notes}
        onDelete={onDelete}
        onEdit={handleEdit}
        editingNoteId={editingNote?._id}
      />
    </div>
  );
}