import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const AddBookPage = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [genre, setGenre] = useState('');
  const [year, setYear] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

    const formData = new FormData();
    formData.append('title', title.trim());
    formData.append('author', author.trim());
    formData.append('description', description.trim());
    formData.append('genre', genre.trim());
    formData.append('year', year);
    if (coverImage) {
      formData.append('coverImage', coverImage);
    }

    try {
      await api.post('/books', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      navigate('/');
    } catch (error) {
      if (error.response && error.response.data.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors([{ msg: 'Failed to add book. Please try again.' }]);
      }
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-8 shadow-xl backdrop-blur dark:border-gray-700 dark:bg-gray-900/90">
        <div className="space-y-2 text-center">
          <h2 className="text-3xl font-semibold text-slate-900 dark:text-white">Add a new title to LogikSutra</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Share books that inspire mindful thinking. Fields marked with <span className="text-red-500">*</span> are required.
          </p>
        </div>
        {errors.length > 0 && (
          <div className="my-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-700/60 dark:bg-red-900/30 dark:text-red-200" role="alert">
            <ul className="space-y-1 text-left">
              {errors.map((error, i) => (
                <li key={i}>{error.msg}</li>
              ))}
            </ul>
          </div>
        )}
        <form onSubmit={handleSubmit} className="mt-8 space-y-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="title" className="flex items-center justify-between text-sm font-medium text-slate-700 dark:text-slate-200">
                <span>Title</span>
                <span className="text-xs text-red-500">*</span>
              </label>
              <input
                id="title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border border-slate-200/80 bg-white px-4 py-2.5 text-slate-900 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-gray-700 dark:bg-gray-800 dark:text-slate-100 dark:focus:border-indigo-400 dark:focus:ring-indigo-500/40"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="author" className="flex items-center justify-between text-sm font-medium text-slate-700 dark:text-slate-200">
                <span>Author</span>
                <span className="text-xs text-red-500">*</span>
              </label>
              <input
                id="author"
                type="text"
                required
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full rounded-xl border border-slate-200/80 bg-white px-4 py-2.5 text-slate-900 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-gray-700 dark:bg-gray-800 dark:text-slate-100 dark:focus:border-indigo-400 dark:focus:ring-indigo-500/40"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="description" className="flex items-center justify-between text-sm font-medium text-slate-700 dark:text-slate-200">
              <span>Description</span>
              <span className="text-xs text-red-500">*</span>
            </label>
            <textarea
              id="description"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
              className="w-full rounded-xl border border-slate-200/80 bg-white px-4 py-2.5 text-slate-900 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-gray-700 dark:bg-gray-800 dark:text-slate-100 dark:focus:border-indigo-400 dark:focus:ring-indigo-500/40"
              placeholder="What makes this book a worthy addition to LogikSutra?"
            />
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="genre" className="flex items-center justify-between text-sm font-medium text-slate-700 dark:text-slate-200">
                <span>Genre</span>
                <span className="text-xs text-red-500">*</span>
              </label>
              <input
                id="genre"
                type="text"
                required
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full rounded-xl border border-slate-200/80 bg-white px-4 py-2.5 text-slate-900 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-gray-700 dark:bg-gray-800 dark:text-slate-100 dark:focus:border-indigo-400 dark:focus:ring-indigo-500/40"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="year" className="flex items-center justify-between text-sm font-medium text-slate-700 dark:text-slate-200">
                <span>Published year</span>
                <span className="text-xs text-red-500">*</span>
              </label>
              <input
                id="year"
                type="number"
                required
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full rounded-xl border border-slate-200/80 bg-white px-4 py-2.5 text-slate-900 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-gray-700 dark:bg-gray-800 dark:text-slate-100 dark:focus:border-indigo-400 dark:focus:ring-indigo-500/40"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="coverImage" className="flex items-center justify-between text-sm font-medium text-slate-700 dark:text-slate-200">
              <span>Cover image</span>
              <span className="text-xs text-slate-400 dark:text-slate-500">(optional)</span>
            </label>
            <input
              id="coverImage"
              type="file"
              accept="image/*"
              onChange={(e) => setCoverImage(e.target.files[0])}
              className="block w-full rounded-xl border border-dashed border-slate-300 bg-white px-4 py-4 text-sm text-slate-600 transition hover:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-gray-600 dark:bg-gray-800 dark:text-slate-300 dark:hover:border-indigo-500/60 dark:focus:ring-indigo-500/40"
            />
            <p className="text-xs text-slate-400 dark:text-slate-500">Upload a square image (JPG or PNG) to showcase the cover.</p>
          </div>
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="rounded-xl border border-slate-200 px-5 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 dark:border-gray-700 dark:text-slate-300 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-indigo-600 px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900"
            >
              Add book
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBookPage;
