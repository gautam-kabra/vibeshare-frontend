import { useState, useEffect } from "react";
import { useUserSearch } from "@/lib/hooks";
import Image from "next/image";
import Link from "next/link";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const { results, isLoading } = useUserSearch(debouncedQuery);

  // Debounce the search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 400);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <section className="search-section">
      <div className="search-header">
        <h1 className="search-title">
          <span className="gradient-text">Discover</span> People
        </h1>
        <p className="search-subtitle">Find and connect with other users</p>
      </div>

      <div className="search-bar">
        <i className="bx bx-search search-icon"></i>
        <input
          type="text"
          className="search-input"
          placeholder="Search by name or username..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
        {query && (
          <button className="search-clear" onClick={() => setQuery("")}>
            <i className="bx bx-x"></i>
          </button>
        )}
      </div>

      {/* Results */}
      <div className="search-results">
        {isLoading && (
          <div className="search-loading">
            <i className="bx bx-loader-alt bx-spin"></i>
            <p>Searching...</p>
          </div>
        )}

        {!isLoading && debouncedQuery.length >= 2 && results.length === 0 && (
          <div className="search-empty">
            <i className="bx bx-user-x"></i>
            <p>No users found for &quot;{debouncedQuery}&quot;</p>
          </div>
        )}

        {!isLoading &&
          results.map((user, index) => (
            <Link
              key={index}
              href={`/users/${user.username}`}
              className="search-result-card"
            >
              {user.img && (
                <Image
                  width={48}
                  height={48}
                  className="search-result-img"
                  src={user.img}
                  alt={user.name}
                />
              )}
              <div className="search-result-info">
                <p className="search-result-name">{user.name}</p>
                <p className="search-result-username">@{user.username}</p>
                {user.bio && (
                  <p className="search-result-bio">{user.bio}</p>
                )}
              </div>
            </Link>
          ))}

        {!debouncedQuery && (
          <div className="search-empty">
            <i className="bx bx-search-alt"></i>
            <p>Start typing to search for users</p>
          </div>
        )}
      </div>
    </section>
  );
}
