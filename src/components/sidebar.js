import { useSafeUser } from "@/lib/clerk-hooks";
import { useClerk } from "@clerk/nextjs";
import { useEffect } from "react";
import { createUser } from "@/lib/api";
import Link from "next/link";
import { useRouter } from "next/router";

function generateUsername(email) {
  const base = email.split("@")[0];
  let hash = 0;
  for (let i = 0; i < email.length; i++) {
    const char = email.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash &= hash;
  }
  const hex = Math.abs(hash).toString(16);
  const suffix = `${hex[0]}${hex[1]}${hex[hex.length - 1]}`;
  return `${base}_${suffix}`;
}

export default function Sidebar() {
  const { isSignedIn, user } = useSafeUser();
  const { signOut } = useClerk();
  const router = useRouter();

  useEffect(() => {
    async function syncUser() {
      if (isSignedIn && user) {
        try {
          const email = user.primaryEmailAddress?.emailAddress || "";
          const name = user.fullName || user.firstName || "User";
          const username = generateUsername(email);
          const pfp = user.imageUrl || "";
          await createUser({ name, username, email, pfp, clerkId: user.id });
        } catch (err) {
          // silently fail or already exists
        }
      }
    }
    syncUser();
  }, [isSignedIn, user]);

  function isActive(path) {
    return router.pathname === path ? "sideicon active" : "sideicon";
  }

  return (
    <aside className="sidebar">
{/* Brand */}
      <div className="sidebar-brand">
        <div className="sidebar-brand-logo">
          <div className="vibe-pulse-ring">
            <span
              className="material-symbols-outlined"
              style={{
                fontSize: "1.25rem",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                height: "100%",
                background: "var(--surface)",
                borderRadius: "var(--radius-full)",
              }}
            >
              bolt
            </span>
          </div>
        </div>
        <div className="sidebar-brand-text">
          <span className="sidebar-brand-name">VibeShare</span>
          <span className="sidebar-brand-tagline">The Digital Pulse</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <Link className={isActive("/")} href="/">
          <span className="material-symbols-outlined">home</span>
          <span>Home</span>
        </Link>

        <Link className={isActive("/explore")} href="/explore">
          <span className="material-symbols-outlined">bolt</span>
          <span>Trending</span>
        </Link>

        <Link className={isActive("/search")} href="/search">
          <span className="material-symbols-outlined">search</span>
          <span>Search</span>
        </Link>

        <Link className={isActive("/new-post")} href="/new-post">
          <span className="material-symbols-outlined">add_circle</span>
          <span>Create</span>
        </Link>

        {isSignedIn ? (
          <Link className={isActive("/profile")} href="/profile">
            <span className="material-symbols-outlined">person</span>
            <span>Profile</span>
          </Link>
        ) : (
          <Link className={isActive("/login")} href="/login">
            <span className="material-symbols-outlined">login</span>
            <span>Sign In</span>
          </Link>
        )}
      </nav>

      {/* Bottom Section */}
      <div className="sidebar-bottom">
        <Link href="/new-post" className="sidebar-create-btn">
          <span>Create Post</span>
        </Link>
        
        {isSignedIn && (
          <button 
            onClick={() => signOut(() => router.push("/"))}
            className="sidebar-logout-btn"
          >
            <span className="material-symbols-outlined">logout</span>
            <span>Sign Out</span>
          </button>
        )}
      </div>
    </aside>
  );
}
