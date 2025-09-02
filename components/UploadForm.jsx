import { useState } from 'react';

export default function UploadForm({ course }) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('pdf');
  const [file, setFile] = useState(null);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('type', type);
    formData.append('course', course);
    if (file) formData.append('file', file);
    if (youtubeUrl) formData.append('youtubeUrl', youtubeUrl);

    const res = await fetch('/api/admin/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    setMessage(data.message);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white border rounded shadow">
      <h3 className="text-lg font-semibold mb-4">Upload Resource</h3>
      {message && <p className="text-sm mb-4">{message}</p>}

      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full mb-4 p-2 border rounded"
        required
      />

      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="w-full mb-4 p-2 border rounded"
      >
        <option value="pdf">PDF Notes</option>
        <option value="pyq">Previous Year Question</option>
        <option value="video">YouTube Video</option>
        <option value="other">Other</option>
      </select>

      {(type === 'pdf' || type === 'pyq') && (
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setFile(e.target.files[0])}
          className="w-full mb-4"
          required
        />
      )}

      {type === 'video' && (
        <input
          type="url"
          placeholder="YouTube URL (https://www.youtube.com/watch?v=...)"
          value={youtubeUrl}
          onChange={(e) => setYoutubeUrl(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
          required
        />
      )}

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Upload
      </button>
    </form>
  );
}