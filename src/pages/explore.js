import Head from "next/head";
import Sidebar from "@/components/sidebar";
import Posts from "@/components/posts";
import Other from "@/components/other";

export default function ExplorePage() {
  return (
    <>
      <Head>
        <title>Explore — VibeShare</title>
        <meta name="description" content="Discover trending vibes on VibeShare." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="main">
        <div className="app">
          <Sidebar />

          <div style={{
            flex: 1,
            marginLeft: 264,
            marginRight: 320,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "32px 32px 96px",
            overflowY: "auto",
            gap: 24,
          }}>
            {/* Search Bar */}
            <div style={{
              position: "sticky",
              top: 16,
              zIndex: 30,
              width: "100%",
              maxWidth: 560,
              marginBottom: 32,
            }}>
              <div className="glass-panel" style={{
                display: "flex",
                alignItems: "center",
                borderRadius: "var(--radius-full)",
                overflow: "hidden",
                boxShadow: "var(--ambient-glow)",
                padding: "0 16px",
              }}>
                <span className="material-symbols-outlined" style={{ color: "var(--surface-tint)", fontSize: "1.25rem" }}>
                  search
                </span>
                <input
                  type="text"
                  placeholder="Search the void..."
                  style={{
                    flex: 1,
                    background: "none",
                    border: "none",
                    outline: "none",
                    color: "var(--on-surface)",
                    fontFamily: "var(--font-body)",
                    fontSize: "0.875rem",
                    padding: "16px 12px",
                    letterSpacing: "0.02em",
                  }}
                  onFocus={(e) => {
                    window.location.href = "/search";
                  }}
                  readOnly
                />
              </div>
            </div>

            {/* Feed Header */}
            <div style={{
              width: "100%",
              maxWidth: 560,
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              marginBottom: 16,
            }}>
              <h2 style={{
                fontSize: "2rem",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                color: "var(--on-surface)",
              }}>
                Trending{" "}
                <span style={{ color: "var(--surface-tint)" }}>Vibes</span>
              </h2>
              <span style={{
                fontSize: "0.75rem",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                color: "var(--on-surface-variant)",
                fontWeight: 500,
              }}>
                Live Feed
              </span>
            </div>

            <Posts />
          </div>

          <Other />
        </div>
      </main>
    </>
  );
}
