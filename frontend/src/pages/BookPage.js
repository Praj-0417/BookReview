import React, { useState, useEffect, useContext, useMemo, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api';
import AuthContext from '../context/AuthContext';
import RatingBadge from '../components/RatingBadge';

const BookPage = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchBook = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/books/${id}`);
      const fetchedBook = data?.data?.book || null;
      const fetchedReviews = data?.data?.reviews || [];
      const fetchedAverage = data?.data?.averageRating ?? 0;

      setBook(fetchedBook);
      setReviews(fetchedReviews);
      setAverageRating(fetchedAverage);
      if (user) {
        const mine = fetchedReviews.find((r) => r.userId._id === user._id);
        if (mine) {
          setEditingReviewId(mine._id);
          setRating(mine.rating);
          setReviewText(mine.reviewText || '');
        } else {
          setEditingReviewId(null);
          setRating(0);
          setReviewText('');
        }
      } else {
        setEditingReviewId(null);
        setRating(0);
        setReviewText('');
      }
      setError('');
    } catch (err) {
      console.error(err);
      setError('Unable to load book details');
    } finally {
      setLoading(false);
    }
  }, [id, user]);

  useEffect(() => {
    fetchBook();
  }, [fetchBook]);

  const myReview = useMemo(() => {
    if (!user) return null;
    return reviews.find((review) => review.userId._id === user._id) || null;
  }, [reviews, user]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!rating) {
      setError('Please select a rating before submitting.');
      return;
    }
    try {
      const payload = {
        rating,
        reviewText: reviewText.trim(),
      };
      if (editingReviewId) {
        await api.put(`/reviews/${editingReviewId}`, payload);
      } else {
        await api.post(`/reviews/${id}`, payload);
      }
      await fetchBook();
      setError('');
    } catch (err) {
      console.error('Failed to submit review', err);
      const msg = err?.response?.data?.error || 'Failed to submit review';
      setError(msg);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Delete this review?')) return;
    try {
      await api.delete(`/reviews/${reviewId}`);
      await fetchBook();
    } catch (err) {
      console.error(err);
      alert('Failed to delete review');
    }
  };

  if (loading) {
    return <div className="rounded-2xl bg-white/80 p-10 text-center shadow">Loading book...</div>;
  }

  if (!book) {
    return <div className="rounded-2xl bg-red-100 p-6 text-center text-red-600">Book not found.</div>;
  }

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-white dark:bg-gray-800 p-8 shadow">
        <div className="flex flex-col md:flex-row md:items-start md:gap-8">
          {book.coverImage && (
            <img
              src={`http://localhost:5000/${book.coverImage.replace(/\\/g, '/')}`}
              alt={book.title}
              className="w-full md:w-1/3 rounded-lg shadow-lg"
            />
          )}
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-blue-600">{book.genre}</span>
              <span>{book.year}</span>
            </div>
            <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{book.title}</h1>
            <p className="text-lg text-slate-600 dark:text-slate-300">by {book.author}</p>
            <p className="mt-6 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{book.description}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <RatingBadge rating={averageRating} />
            <span className="text-xs text-slate-500 dark:text-slate-400">{reviews.length} review{reviews.length !== 1 && 's'}</span>
            {user && book.addedBy === user._id && (
              <Link
                to={`/edit-book/${book._id}`}
                className="rounded-lg border border-blue-500 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-400 dark:hover:bg-blue-900"
              >
                Edit book
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="rounded-3xl bg-white dark:bg-gray-800 p-6 shadow">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Community reviews</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Average rating {averageRating.toFixed(1)} / 5</p>
          </div>
          <span className="text-xs text-slate-400">Sorted by most recent</span>
        </div>

        <div className="mt-4 space-y-4">
          {reviews.map((review) => (
            <div key={review._id} className="rounded-2xl border border-slate-100 bg-slate-50/70 dark:bg-gray-700/50 dark:border-gray-700 p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">{review.userId.name}</p>
                  <p className="text-xs text-slate-400">Reviewed on {new Date(review.createdAt).toLocaleDateString()}</p>
                </div>
                <RatingBadge rating={review.rating} />
              </div>
              {review.reviewText ? (
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{review.reviewText}</p>
              ) : (
                <p className="mt-3 text-sm italic text-slate-400 dark:text-slate-500">No additional comments.</p>
              )}
              {user && user._id === review.userId._id && (
                <div className="mt-4 flex items-center gap-3 text-sm">
                  <button
                    onClick={() => {
                      setEditingReviewId(review._id);
                      setRating(review.rating);
                      setReviewText(review.reviewText || '');
                    }}
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Edit review
                  </button>
                  <button
                    onClick={() => handleDeleteReview(review._id)}
                    className="text-red-500 dark:text-red-400 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
          {!reviews.length && (
            <div className="rounded-2xl border border-dashed border-slate-200 dark:border-gray-700 p-8 text-center text-slate-500 dark:text-slate-400">
              No reviews yet. Be the first to share your thoughts!
            </div>
          )}
        </div>
      </section>

      <section className="rounded-3xl bg-white dark:bg-gray-800 p-6 shadow">
        {user ? (
          <form onSubmit={handleReviewSubmit} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                {editingReviewId ? 'Update your review' : 'Add your review'}
              </h3>
              {myReview && !editingReviewId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingReviewId(myReview._id);
                    setRating(myReview.rating);
                    setReviewText(myReview.reviewText);
                  }}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Edit existing review
                </button>
              )}
            </div>
            {error && (
              <div className="rounded-lg bg-red-100 px-4 py-2 text-sm text-red-700 dark:bg-red-900/40 dark:text-red-200">
                {error}
              </div>
            )}
            <div className="grid gap-4 md:grid-cols-2">
              <label className="flex flex-col text-sm text-slate-600 dark:text-slate-300">
                <span className="flex items-center gap-1">
                  Rating
                  <span className="text-red-500" aria-hidden="true">*</span>
                  <span className="sr-only">required</span>
                </span>
                <select
                  value={rating || ''}
                  onChange={(e) => setRating(Number(e.target.value))}
                  required
                  className="mt-1 rounded-lg border border-slate-200 px-3 py-2 focus:border-blue-500 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="" disabled>
                    Select rating
                  </option>
                  {[1, 2, 3, 4, 5].map((val) => (
                    <option key={val} value={val}>
                      {val}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col text-sm text-slate-600 dark:text-slate-300 md:col-span-2">
                <span>
                  Review
                  <span className="text-xs text-slate-400 dark:text-slate-500"> (optional)</span>
                </span>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  rows={4}
                  className="mt-1 rounded-lg border border-slate-200 px-3 py-2 focus:border-blue-500 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Share your thoughts about this book..."
                />
              </label>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
              >
                {editingReviewId ? 'Update review' : 'Submit review'}
              </button>
              {editingReviewId && (
                <button
                  type="button"
                  onClick={() => handleDeleteReview(editingReviewId)}
                  className="rounded-lg border border-red-500 px-6 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:border-red-400 dark:hover:bg-red-900"
                >
                  Delete review
                </button>
              )}
            </div>
          </form>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 dark:border-gray-700 p-8 text-center text-slate-500 dark:text-slate-400">
            <p>You need to be logged in to write a review.</p>
            <Link to="/login" className="mt-3 inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
              Log in to review
            </Link>
          </div>
        )}
      </section>
    </div>
  );
};

export default BookPage;
