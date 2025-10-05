import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import api from '../api';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState([]);
  const { setAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    try {
      const { data } = await api.post('/auth/register', {
        name: name.trim(),
        email: email.trim(),
        password,
      });
      setAuth(data.token);
      navigate('/');
    } catch (err) {
      if (err.response && err.response.data.errors) {
        setErrors(err.response.data.errors);
      } else {
        setErrors([{ msg: 'Registration failed. Please try again.' }]);
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-slate-100 px-4 py-12 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-slate-200/80 bg-white/90 p-8 shadow-xl backdrop-blur dark:border-gray-700 dark:bg-gray-900/90">
        <div className="space-y-2 text-center">
          <h2 className="text-3xl font-semibold text-slate-900 dark:text-white">Join the LogikSutra circle</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Create your library identity and start sharing mindful reviews.</p>
        </div>
        {errors.length > 0 && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-700/60 dark:bg-red-900/30 dark:text-red-200" role="alert">
            <ul className="space-y-1 text-left">
              {errors.map((error, i) => (
                <li key={i}>{error.msg}</li>
              ))}
            </ul>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="name" className="flex items-center justify-between text-sm font-medium text-slate-700 dark:text-slate-200">
              <span>Name</span>
              <span className="text-xs text-red-500">*</span>
            </label>
            <input
              id="name"
              name="name"
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
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-200/80 bg-white px-4 py-2.5 text-slate-900 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-gray-700 dark:bg-gray-800 dark:text-slate-100 dark:focus:border-indigo-400 dark:focus:ring-indigo-500/40"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="flex items-center justify-between text-sm font-medium text-slate-700 dark:text-slate-200">
              <span>Password</span>
              <span className="text-xs text-red-500">*</span>
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-200/80 bg-white px-4 py-2.5 text-slate-900 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-gray-700 dark:bg-gray-800 dark:text-slate-100 dark:focus:border-indigo-400 dark:focus:ring-indigo-500/40"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900"
            >
              Create account
            </button>
          </div>
        </form>
        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
          Already part of LogikSutra?{' '}
          <Link to="/login" className="font-medium text-indigo-600 transition hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
