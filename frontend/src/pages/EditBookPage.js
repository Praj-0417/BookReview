import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';

const EditBookPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [genre, setGenre] = useState('');
  const [year, setYear] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/books/${id}`);
        const book = data?.data?.book;
        if (!book) {
          setError('Unable to find book details.');
          return;
        }
        setTitle(book.title);
        setAuthor(book.author);
        setDescription(book.description);
        setGenre(book.genre);
        setYear(book.year);
        setError('');
      } catch (err) {
        console.error(err);
        setError('Failed to load book details.');
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await api.put(`/books/${id}`, {
        title: title.trim(),
        author: author.trim(),
        description: description.trim(),
        genre: genre.trim(),
        year,
      });
      setSuccess('Book updated successfully.');
      navigate(`/books/${id}`);
    } catch (err) {
      console.error('Failed to edit book', err);
      const message = err?.response?.data?.error || 'Failed to update the book. Please try again.';
      setError(message);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-8 text-center text-slate-600 shadow-xl backdrop-blur dark:border-gray-700 dark:bg-gray-900/90 dark:text-slate-300">
          Loading book details...
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-8 shadow-xl backdrop-blur dark:border-gray-700 dark:bg-gray-900/90">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Edit book details</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Update required fields marked with <span className="text-red-500">*</span> and refine the book story.</p>
        </div>
        {error && (
          <div className="my-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-700/60 dark:bg-red-900/30 dark:text-red-200">
            {error}
          </div>
        )}
        {success && (
          <div className="my-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-700/60 dark:bg-green-900/30 dark:text-green-200">
            {success}
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
              Save changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBookPage;
