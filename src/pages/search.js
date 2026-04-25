import Head from "next/head";
import { useState, useEffect } from "react";
import { useSafeAuth } from "@/lib/clerk-hooks";
import { searchUsers } from "@/lib/api";
import Sidebar from "@/components/sidebar";
import Link from "next/link";
import Image from "next/image";

export default function SearchPage() {
  const { getToken } = useSafeAuth();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim().length < 2) {
        setResults([]);
        setHasSearched(false);
        return;
      }
      setIsSearching(true);
      setHasSearched(true);
      try {
        const token = await getToken();
        const data = await searchUsers(query.trim(), token);
        setResults(data);
      } catch {
        setResults([]);
      }
      setIsSearching(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [query, getToken]);

  return (
    <>
      <Head>
        <title>Search — VibeShare</title>
        <meta name="description" content="Discover people on VibeShare." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="main">
        <div className="app">
          <Sidebar />

          <section className="search-section">
            <div className="search-header">
              <h1 className="search-title">
                Discover <span className="gradient-text">People</span>
              </h1>
              <p className="search-subtitle">
                Find creators, artists, and communities that resonate with your vibe.
              </p>
            </div>

            {/* Search Bar — Glass Panel */}
            <div className="search-bar">
              <div className="glass-panel" style={{
                display: "flex",
                alignItems: "center",
                borderRadius: "var(--radius-full)",
                overflow: "hidden",
                boxShadow: "var(--ambient-glow)",
                padding: "0 16px",
              }}>
                <span className="material-symbols-outlined search-icon">
                  search
                </span>
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search the void..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  style={{ background: "none", border: "none" }}
                />
                {query && (
                  <button className="search-clear" onClick={() => setQuery("")}>
                    <span className="material-symbols-outlined" style={{ fontSize: "1.1rem" }}>
                      close
                    </span>
                  </button>
                )}
              </div>
            </div>

            {/* Results */}
            {isSearching ? (
              <div className="search-loading">
                <span className="material-symbols-outlined" style={{ fontSize: "2.5rem", animation: "spin 1s linear infinite" }}>
                  progress_activity
                </span>
                <p>Scanning the void...</p>
              </div>
            ) : results.length > 0 ? (
              <div className="search-results">
                {results.map((user, i) => (
                  <Link
                    key={i}
                    href={`/users/${user.username}`}
                    className="search-result-card"
                  >
                    {user.pfp && (
                      <Image
                        width={48}
                        height={48}
                        className="search-result-img"
                        src={user.pfp}
                        alt={user.name}
                      />
                    )}
                    <div className="search-result-info">
                      <p className="search-result-name">{user.name}</p>
                      <p className="search-result-username">@{user.username}</p>
                    </div>
                    <button className="suggest-follow-btn">Follow</button>
                  </Link>
                ))}
              </div>
            ) : hasSearched ? (
              <div className="search-empty">
                <span className="material-symbols-outlined" style={{ fontSize: "2.5rem" }}>
                  person_search
                </span>
                <p>No creators found for &ldquo;{query}&rdquo;</p>
              </div>
            ) : (
              <div className="search-empty">
                <span className="material-symbols-outlined" style={{ fontSize: "3rem", opacity: 0.3 }}>
                  explore
                </span>
                <h3 style={{ color: "var(--on-surface-variant)", fontWeight: 600, fontSize: "1rem" }}>
                  Search for creators
                </h3>
                <p style={{ fontSize: "0.8125rem" }}>Type a name or username to discover people</p>
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
}
