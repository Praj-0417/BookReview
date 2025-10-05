import React, { useState, useEffect, useCallback } from 'react';
import api from '../api';
import BookCard from '../components/BookCard';

const HomePage = () => {
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [total, setTotal] = useState(0);
  const [genres, setGenres] = useState([]);
  const [query, setQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchBooks = useCallback(async (searchQuery) => {
    setLoading(true);
    try {
      const params = { page, limit: 5 };
      if (searchQuery) params.search = searchQuery;
      if (selectedGenre) params.genre = selectedGenre;
      if (sortBy) params.sortBy = sortBy;

      const { data } = await api.get('/books', { params });

      const booksPayload = Array.isArray(data?.data) ? data.data : [];
      setBooks(booksPayload);

      setPagination(data?.pagination || {});

      const derivedTotal = typeof data?.total === 'number' ? data.total : booksPayload.length;
      setTotal(derivedTotal);

      if (!selectedGenre && !sortBy && !searchQuery) { // Only update genres on initial load
        setGenres(Array.isArray(data?.genres) ? data.genres : []);
      }
    } catch (err) {
      console.error('Failed to fetch books', err);
      // Reset to safe defaults so the UI doesn't break when the API fails
      setBooks([]);
      setPagination({});
    } finally {
      setLoading(false);
    }
  }, [page, selectedGenre, sortBy]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchBooks(query);
    }, 500); // Debounce search

    return () => clearTimeout(timer);
  }, [query, fetchBooks]);


  const handleSearchChange = (e) => {
    setQuery(e.target.value);
    setPage(1);
  };

  const handleGenreChange = (e) => {
    setSelectedGenre(e.target.value);
    setPage(1);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setPage(1);
  };

  const handleClearFilters = () => {
    setQuery('');
    setSelectedGenre('');
    setSortBy('');
    setPage(1);
  };

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-8 text-white shadow-lg">
        <h1 className="text-3xl font-semibold">Discover your next favorite book</h1>
        <p className="mt-2 max-w-2xl text-sm text-white/80">
          Browse community-curated reviews, rate the books you love, and keep track of your own reading journey.
        </p>
        <div className="mt-6 flex flex-col gap-3 rounded-2xl bg-white/90 p-4 text-slate-900 shadow-sm sm:flex-row">
          <input
            type="text"
            value={query}
            onChange={handleSearchChange}
            placeholder="Search by title or author..."
            className="w-full rounded-lg border border-slate-200 px-4 py-2 focus:border-blue-500 focus:outline-none"
          />
          <button
            type="button"
            onClick={handleClearFilters}
            className="rounded-lg border border-slate-200 px-6 py-2 font-medium text-slate-600 transition hover:bg-slate-100"
          >
            Clear
          </button>
        </div>
      </section>

      <section className="flex flex-wrap items-center gap-4 rounded-2xl bg-white/70 p-4 shadow">
        <div className="flex flex-1 flex-wrap gap-4">
          <label className="flex items-center gap-2 text-sm text-slate-600">
            Genre
            <select
              value={selectedGenre}
              onChange={handleGenreChange}
              className="rounded-lg border border-slate-200 px-3 py-2 focus:border-blue-500 focus:outline-none"
            >
              <option value="">All genres</option>
              {genres.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-600">
            Sort by
            <select
              value={sortBy}
              onChange={handleSortChange}
              className="rounded-lg border border-slate-200 px-3 py-2 focus:border-blue-500 focus:outline-none"
            >
              <option value="">Newest</option>
              <option value="rating">Average rating</option>
              <option value="year">Published year</option>
            </select>
          </label>
        </div>
        <div className="text-xs text-slate-500">
          Showing {books.length} of {total} books
        </div>
      </section>

      {loading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="h-56 animate-pulse rounded-xl bg-slate-200" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {books.map((book) => (
            <BookCard key={book._id} book={book} />
          ))}
          {!books.length && (
            <div className="col-span-full rounded-2xl border border-dashed border-slate-200 p-10 text-center text-slate-500">
              No books match your filters yet. Try adjusting the search or add a new book!
            </div>
          )}
        </div>
      )}

      <div className="flex items-center justify-between">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={!pagination.prev}
          className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-xs text-slate-500">Page {page}</span>
        <button
          onClick={() => setPage((prev) => prev + 1)}
          disabled={!pagination.next}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default HomePage;
