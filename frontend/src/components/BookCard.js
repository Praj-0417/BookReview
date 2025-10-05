import React from 'react';
import { Link } from 'react-router-dom';
import RatingBadge from './RatingBadge';

const BookCard = ({ book }) => {
  return (
    <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white/80 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:bg-gray-800 dark:border-gray-700">
      <div>
        {book.coverImage && (
          <img
            src={`http://localhost:5000/${book.coverImage.replace(/\\/g, '/')}`}
            alt={book.title}
            className="w-full h-48 object-cover rounded-lg mb-4"
          />
        )}
        <div className="mb-2 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
          <span className="rounded-full bg-blue-100 px-2 py-0.5 text-blue-700 dark:bg-blue-900 dark:text-blue-300">{book.genre}</span>
          <span>{book.year}</span>
        </div>
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{book.title}</h3>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">by {book.author}</p>
        <p className="mt-3 h-16 overflow-hidden text-sm text-slate-500 dark:text-slate-400">{book.description}</p>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <RatingBadge rating={book.averageRating || 0} />
        <span className="text-xs text-slate-500 dark:text-slate-400">{book.reviewsCount || 0} reviews</span>
      </div>
      <Link
        to={`/books/${book._id}`}
        className="mt-4 inline-flex items-center justify-center rounded-lg bg-blue-600 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
      >
        View Details
      </Link>
    </div>
  );
};

export default BookCard;
