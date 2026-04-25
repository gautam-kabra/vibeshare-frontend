import Head from "next/head";
import { useSafeUser, useSafeAuth } from "@/lib/clerk-hooks";
import { useUserEmailProfile, useUserPosts, useFollowStats } from "@/lib/hooks";
import { updateUserUsername } from "@/lib/api";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Sidebar from "@/components/sidebar";
import Post from "@/components/post";
import FollowButton from "@/components/FollowButton";
import UserListModal from "@/components/UserListModal";
import { useRouter } from "next/router";

export default function ProfilePage() {
  const { user, isSignedIn } = useSafeUser();
  const { getToken } = useSafeAuth();
  const router = useRouter();
  const email = user?.primaryEmailAddress?.emailAddress || "";
  
  const { profile, isLoading, mutate: mutateProfile } = useUserEmailProfile(email);
  const { posts, mutate: mutatePosts } = useUserPosts(profile?.username);
  const { stats, mutate: mutateFollowStats } = useFollowStats(profile?.username);

  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  
  const [viewMode, setViewMode] = useState("grid");
  const [modalType, setModalType] = useState(null);

  async function handleSaveUsername() {
    if (!newUsername.trim()) return;
    setIsSaving(true);
    try {
      const token = await getToken();
      await updateUserUsername(email, newUsername.trim(), token);
      await mutateProfile();
      await mutatePosts();
      setIsEditing(false);
    } catch (err) {
      alert("Failed to update username. It might be taken.");
      console.error(err);
    }
    setIsSaving(false);
  }

  function handleFollowToggle() {
    mutateFollowStats();
    mutateProfile();
  }

  if (!user || isLoading) {
    return (
      <>
        <Head><title>Profile — VibeShare</title></Head>
        <main className="main">
          <div className="app">
            <Sidebar />
            <section className="profile-section">
              <div className="profile-cover">
                <div className="skeleton-block" style={{ width: 160, height: 160, borderRadius: "50%" }}></div>
              </div>
            </section>
          </div>
        </main>
      </>
    );
  }

  const displayName = profile?.name || user.fullName || user.firstName || "User";
  const username = profile?.username || email.split("@")[0];
  const profileEmail = profile?.email || email;

  return (
    <>
      <Head>
        <title>{displayName} — VibeShare</title>
        <meta name="description" content={`${displayName}'s profile on VibeShare`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="main">
        <div className="app">
          <Sidebar />

          <section className="profile-section">
            <div className="profile-cover">
              <div className="profile-cover-bg"></div>

              <div className="profile-avatar-wrapper">
                <div className="profile-avatar-glow"></div>
                <Image
                  className="profile-avatar"
                  width={160}
                  height={160}
                  src={profile?.pfp || user.imageUrl}
                  alt={displayName}
                />
              </div>

              <div className="profile-info">
                <h1 className="profile-name">{displayName}</h1>
                
                {isEditing ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                    <span style={{ color: "var(--on-surface-variant)" }}>@</span>
                    <input
                      type="text"
                      placeholder="New username"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid var(--primary)",
                        color: "var(--on-surface)",
                        padding: "4px 8px",
                        borderRadius: "var(--radius-sm)",
                        fontSize: "0.875rem"
                      }}
                    />
                    <button 
                      onClick={handleSaveUsername} 
                      disabled={isSaving}
                      className="suggest-follow-btn" 
                      style={{ padding: "4px 12px", background: "var(--primary)" }}>
                      {isSaving ? "..." : "Save"}
                    </button>
                    <button 
                      onClick={() => setIsEditing(false)}
                      style={{ color: "var(--on-surface-variant)", fontSize: "0.875rem" }}>
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <p className="profile-email">@{username}</p>
                    {profileEmail === email && (
                      <button 
                        onClick={() => {
                          setNewUsername(username);
                          setIsEditing(true);
                        }}
                        style={{ color: "var(--primary)", fontSize: "0.875rem", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center" }}>
                        <span className="material-symbols-outlined" style={{ fontSize: "1rem" }}>edit</span>
                      </button>
                    )}
                  </div>
                )}
                
                <p className="profile-bio">
                  {profile?.bio || "Digital creator exploring the intersection of art, technology, and the infinite void. ✨"}
                </p>

                <div className="profile-stats">
                  <div className="profile-stat">
                    <span className="stat-number">{posts?.length || 0}</span>
                    <span className="stat-label">Posts</span>
                  </div>
                  <div 
                    className="profile-stat clickable" 
                    onClick={() => username && setModalType("followers")}
                    style={{ cursor: "pointer" }}
                  >
                    <span className="stat-number">{stats?.followers || 0}</span>
                    <span className="stat-label">Followers</span>
                  </div>
                  <div 
                    className="profile-stat clickable" 
                    onClick={() => username && setModalType("following")}
                    style={{ cursor: "pointer" }}
                  >
                    <span className="stat-number">{stats?.following || 0}</span>
                    <span className="stat-label">Following</span>
                  </div>
                </div>
              </div>

              <div className="profile-actions">
                {profileEmail === email ? (
                  <Link href="/explore" className="back-btn">
                    <span className="material-symbols-outlined" style={{ fontSize: "1.1rem" }}>
                      arrow_back
                    </span>
                    Back to Feed
                  </Link>
                ) : (
                  <FollowButton 
                    targetEmail={profileEmail} 
                    onToggle={handleFollowToggle}
                    className="profile-follow-btn"
                  />
                )}
              </div>
            </div>

            <div style={{ padding: "48px 24px", maxWidth: 1280, margin: "0 auto", width: "100%" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32 }}>
                <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--on-background)", letterSpacing: "-0.02em" }}>
                  Recent Pulses
                </h2>
                <div className="view-toggle-tabs">
                  <button 
                    className={`view-tab ${viewMode === 'grid' ? 'active' : ''}`}
                    onClick={() => setViewMode('grid')}
                  >
                    <span className="material-symbols-outlined">grid_view</span>
                    Grid
                  </button>
                  <button 
                    className={`view-tab ${viewMode === 'list' ? 'active' : ''}`}
                    onClick={() => setViewMode('list')}
                  >
                    <span className="material-symbols-outlined">reorder</span>
                    List
                  </button>
                </div>
              </div>

              {posts && posts.length > 0 ? (
                viewMode === "grid" ? (
                  <div className="profile-grid-container" style={{ alignItems: "start" }}>
                    {posts.map((post, i) => (
                      <Post
                        key={i}
                        name={post.name}
                        username={post.username}
                        text={post.text}
                        pfp={post.pfp}
                        img={post.img}
                        email={email}
                        post_id={post.post_id}
                        likes={post.likes}
                        comment_count={post.comment_count || 0}
                        style={{ maxWidth: "100%", margin: 0 }}
                      />
                    ))}
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
                    {posts.map((post, i) => (
                      <Post
                        key={i}
                        name={post.name}
                        username={post.username}
                        text={post.text}
                        pfp={post.pfp}
                        img={post.img}
                        email={email}
                        post_id={post.post_id}
                        likes={post.likes}
                        comment_count={post.comment_count || 0}
                      />
                    ))}
                  </div>
                )
              ) : (
                <div className="empty-state">
                  <span className="material-symbols-outlined" style={{ fontSize: "3rem" }}>
                    collections
                  </span>
                  <h3>No posts yet</h3>
                  <p>Start creating to fill your gallery</p>
                  {profileEmail === email && (
                    <Link href="/new-post" className="vibrant-btn" style={{ padding: "12px 32px", borderRadius: "var(--radius-md)", marginTop: 8 }}>
                      Create Post
                    </Link>
                  )}
                </div>
              )}
            </div>
          </section>
        </div>
        
        {modalType && username && (
          <UserListModal 
            username={username} 
            type={modalType} 
            onClose={() => setModalType(null)} 
          />
        )}
      </main>
    </>
  );
}
