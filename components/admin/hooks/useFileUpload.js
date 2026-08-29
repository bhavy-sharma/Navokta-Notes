import { useState } from 'react';
import toast from 'react-hot-toast';

export function useFileUpload() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState('');

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

  const uploadFile = async (fileToUpload) => {
    if (!fileToUpload) {
      toast.error('Please select a PDF file!');
      return null;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', fileToUpload);
      
      const response = await fetch('/api/uploadCloud', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Cloudinary upload failed');
      }
      
      setUploadedUrl(data.url);
      toast.success('File uploaded successfully!');
      return data.url;
    } catch (err) {
      console.error('Cloudinary upload error:', err);
      toast.error('Upload failed: ' + (err.message || 'Unknown error'));
      return null;
    } finally {
      setUploading(false);
    }
  };

  const resetUpload = () => {
    setFile(null);
    setUploadedUrl('');
  };

  return {
    file,
    uploading,
    uploadedUrl,
    handleFileChange,
    uploadFile,
    resetUpload,
    setUploadedUrl,
  };
}