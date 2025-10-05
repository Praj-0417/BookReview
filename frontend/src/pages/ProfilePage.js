import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import api from '../api';
import RatingBadge from '../components/RatingBadge';

const ProfilePage = () => {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;
    const fetchProfile = async () => {
      setIsFetching(true);
      try {
        const { data } = await api.get('/auth/me');
        setProfile(data);
        setError('');
      } catch (err) {
        console.error(err);
        setError('Failed to load profile');
      } finally {
        setIsFetching(false);
      }
    };
    fetchProfile();
  }, [user]);

  const handleDeleteBook = async (bookId) => {
    if (!window.confirm('Delete this book? This will remove all associated reviews.')) return;
    try {
      await api.delete(`/books/${bookId}`);
      setProfile((prev) => ({
        ...prev,
        books: prev.books.filter((book) => book._id !== bookId),
        booksCount: prev.booksCount - 1,
      }));
    } catch (err) {
      console.error('Failed to delete book', err);
      alert('Failed to delete book');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Delete this review?')) return;
    try {
      await api.delete(`/reviews/${reviewId}`);
      setProfile((prev) => ({
        ...prev,
        reviews: prev.reviews.filter((review) => review._id !== reviewId),
        reviewsCount: prev.reviewsCount - 1,
      }));
    } catch (err) {
      console.error('Failed to delete review', err);
      alert('Failed to delete review');
    }
  };

  if (loading || isFetching) {
    return <div className="rounded-2xl bg-white/80 p-10 text-center shadow">Loading profile...</div>;
  }

  if (error) {
    return <div className="rounded-2xl bg-red-100 p-6 text-center text-red-700">{error}</div>;
  }

  if (!profile) return null;

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-white p-8 shadow">
        <h1 className="text-3xl font-semibold text-slate-900">Welcome back, {profile.user.name} 👋</h1>
        <p className="mt-2 text-sm text-slate-500">{profile.user.email}</p>
        <div className="mt-4">
          <Link to="/edit-profile" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
            Edit Profile
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-blue-50 p-4">
            <div className="text-xs uppercase tracking-wide text-blue-600">Books added</div>
            <div className="mt-2 text-2xl font-semibold text-blue-700">{profile.booksCount}</div>
          </div>
          <div className="rounded-2xl bg-purple-50 p-4">
            <div className="text-xs uppercase tracking-wide text-purple-600">Reviews written</div>
            <div className="mt-2 text-2xl font-semibold text-purple-700">{profile.reviewsCount}</div>
          </div>
          <div className="rounded-2xl bg-emerald-50 p-4">
            <div className="text-xs uppercase tracking-wide text-emerald-600">Member since</div>
            <div className="mt-2 text-2xl font-semibold text-emerald-700">
              {profile.user.createdAt ? new Date(profile.user.createdAt).toLocaleDateString() : '—'}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-3xl bg-white p-6 shadow">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900">Your books</h2>
          <Link to="/add-book" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
            Add another book
          </Link>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {profile.books.map((book) => (
            <div key={book._id} className="flex flex-col justify-between rounded-2xl border border-slate-100 bg-slate-50/70 p-4 shadow-sm">
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>{book.genre}</span>
                  <span>{book.year}</span>
                </div>
                <h3 className="mt-2 text-lg font-semibold text-slate-900">{book.title}</h3>
                <p className="text-sm text-slate-600">by {book.author}</p>
                <p className="mt-3 text-sm text-slate-500">{book.description}</p>
              </div>
              <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
                <RatingBadge rating={book.averageRating || 0} />
                <span>{book.reviewsCount} reviews</span>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <Link to={`/edit-book/${book._id}`} className="flex-1 rounded-lg border border-blue-500 px-4 py-2 text-center text-sm font-medium text-blue-600 hover:bg-blue-50">
                  Edit
                </Link>
                <button
                  onClick={() => handleDeleteBook(book._id)}
                  className="flex-1 rounded-lg border border-red-500 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {!profile.books.length && (
            <div className="col-span-full rounded-2xl border border-dashed border-slate-200 p-10 text-center text-slate-500">
              You haven’t added any books yet.
            </div>
          )}
        </div>
      </section>

      <section className="rounded-3xl bg-white p-6 shadow">
        <h2 className="text-xl font-semibold text-slate-900">Your reviews</h2>
        <div className="mt-4 space-y-4">
          {profile.reviews.map((review) => (
            <div key={review._id} className="rounded-2xl border border-slate-100 bg-slate-50/70 p-5 shadow-sm">
              <div className="flex items-center justify-between text-sm text-slate-500">
                <Link to={`/books/${review.bookId._id}`} className="font-medium text-blue-600 hover:underline">
                  {review.bookId.title}
                </Link>
                <RatingBadge rating={review.rating} />
              </div>
              <p className="mt-3 text-sm text-slate-600">{review.reviewText}</p>
              <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                <span>Reviewed on {new Date(review.createdAt).toLocaleDateString()}</span>
                <div className="flex items-center gap-2">
                  <Link to={`/books/${review.bookId._id}`} className="text-blue-600 hover:underline">Edit review</Link>
                  <button onClick={() => handleDeleteReview(review._id)} className="text-red-500 hover:underline">Delete</button>
                </div>
              </div>
            </div>
          ))}
          {!profile.reviews.length && (
            <div className="rounded-2xl border border-dashed border-slate-200 p-10 text-center text-slate-500">
              You haven’t written any reviews yet.
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ProfilePage;
