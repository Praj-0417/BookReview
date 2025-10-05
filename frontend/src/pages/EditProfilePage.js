import React, { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import api from '../api';

const EditProfilePage = () => {
  const { user, fetchMe } = useContext(AuthContext);
  const [name, setName] = useState(user ? user.name : '');
  const [email, setEmail] = useState(user ? user.email : '');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsSubmitting(true);
    try {
      await api.put('/auth/updatedetails', {
        name: name.trim(),
        email: email.trim(),
      });
      await fetchMe();
      setMessage('Profile updated successfully!');
    } catch (err) {
      const msg = err?.response?.data?.error || 'Failed to update profile. Please try again.';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-8 shadow-xl backdrop-blur dark:border-gray-700 dark:bg-gray-900/90">
        <div className="space-y-2 text-center">
          <h2 className="text-3xl font-semibold text-slate-900 dark:text-white">Update your LogikSutra identity</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Details marked with <span className="text-red-500">*</span> help the community connect with you better.</p>
        </div>
        {message && (
          <div className="my-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-700/60 dark:bg-green-900/30 dark:text-green-200">
            {message}
          </div>
        )}
        {error && (
          <div className="my-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-700/60 dark:bg-red-900/30 dark:text-red-200">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-2">
            <label htmlFor="name" className="flex items-center justify-between text-sm font-medium text-slate-700 dark:text-slate-200">
              <span>Name</span>
              <span className="text-xs text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-slate-200/80 bg-white px-4 py-2.5 text-slate-900 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-gray-700 dark:bg-gray-800 dark:text-slate-100 dark:focus:border-indigo-400 dark:focus:ring-indigo-500/40"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="flex items-center justify-between text-sm font-medium text-slate-700 dark:text-slate-200">
              <span>Email address</span>
              <span className="text-xs text-red-500">*</span>
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-200/80 bg-white px-4 py-2.5 text-slate-900 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-gray-700 dark:bg-gray-800 dark:text-slate-100 dark:focus:border-indigo-400 dark:focus:ring-indigo-500/40"
            />
          </div>
          <div className="flex items-center justify-end gap-3">
            <button
              type="reset"
              onClick={() => {
                setName(user ? user.name : '');
                setEmail(user ? user.email : '');
              }}
              className="rounded-xl border border-slate-200 px-5 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 dark:border-gray-700 dark:text-slate-300 dark:hover:bg-gray-800"
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-indigo-600 px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-white disabled:cursor-not-allowed disabled:opacity-70 dark:focus:ring-offset-gray-900"
            >
              {isSubmitting ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfilePage;
