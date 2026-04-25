import Head from "next/head";
import { useRouter } from "next/router";
import { useSafeUser, useSafeAuth } from "@/lib/clerk-hooks";
import { useUserProfile, useUserPosts, useFollowStats } from "@/lib/hooks";
import { followUser, unfollowUser, checkFollowing } from "@/lib/api";
import { useState, useCallback, useEffect } from "react";
import Sidebar from "@/components/sidebar";
import Link from "next/link";
import Image from "next/image";
import Post from "@/components/post";
import GridPost from "@/components/grid-post";
import FollowButton from "@/components/FollowButton";
import UserListModal from "@/components/UserListModal";

export default function UserProfilePage() {
  const router = useRouter();
  const { username } = router.query;
  const { user: currentUser, isSignedIn } = useSafeUser();
  const { getToken } = useSafeAuth();
  const { profile, isLoading } = useUserProfile(username);
  const { posts, mutate: mutatePosts } = useUserPosts(username);
  const { stats, mutate: mutateFollowStats } = useFollowStats(username);
  const [viewMode, setViewMode] = useState("grid");
  const [modalType, setModalType] = useState(null);

  const handlePostDeleted = (deletedPostId) => {
    mutatePosts(
      (data) => ({
        ...data,
        posts: data.posts.filter((p) => p.post_id !== deletedPostId),
      }),
      false
    );
  };

  function handleFollowToggle() {
    mutateFollowStats();
  }

  const currentEmail = currentUser?.primaryEmailAddress?.emailAddress || "";
  const isOwnProfile = profile && profile.email === currentEmail;

  if (!username) return null;

  return (
    <>
      <Head>
        <title>
          {profile ? `${profile.name} — VibeShare` : "Profile — VibeShare"}
        </title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="main">
        <div className="app">
          <Sidebar />

          <section className="profile-section">
            {isLoading ? (
              <div className="profile-cover">
                <div className="skeleton-block" style={{ width: 160, height: 160, borderRadius: "50%" }}></div>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
                  <div className="skeleton-line" style={{ width: "40%", height: 32 }}></div>
                  <div className="skeleton-line" style={{ width: "25%", height: 16 }}></div>
                  <div className="skeleton-line" style={{ width: "60%", height: 14 }}></div>
                </div>
              </div>
            ) : profile ? (
              <>
                <div className="profile-cover">
                  <div className="profile-cover-bg"></div>

                  <div className="profile-avatar-wrapper">
                    <div className="profile-avatar-glow"></div>
                    {profile.pfp && (
                      <Image
                        className="profile-avatar"
                        width={160}
                        height={160}
                        src={profile.pfp}
                        alt={profile.name}
                      />
                    )}
                  </div>

                  <div className="profile-info">
                    <h1 className="profile-name">{profile.name}</h1>
                    <p className="profile-email">@{profile.username}</p>
                    <p className="profile-bio">
                      {profile.bio || "Digital creator on VibeShare. Building the future of visual connection. 🌌✨"}
                    </p>
                    <div className="profile-stats">
                      <div className="profile-stat">
                        <span className="stat-number">{posts.length}</span>
                        <span className="stat-label">Posts</span>
                      </div>
                      <div 
                        className="profile-stat clickable" 
                        onClick={() => setModalType("followers")}
                        style={{ cursor: "pointer" }}
                      >
                        <span className="stat-number">{stats?.followers || 0}</span>
                        <span className="stat-label">Followers</span>
                      </div>
                      <div 
                        className="profile-stat clickable" 
                        onClick={() => setModalType("following")}
                        style={{ cursor: "pointer" }}
                      >
                        <span className="stat-number">{stats?.following || 0}</span>
                        <span className="stat-label">Following</span>
                      </div>
                    </div>
                  </div>

                  <div className="profile-actions">
                    {!isOwnProfile && isSignedIn && (
                      <FollowButton 
                        targetEmail={profile.email} 
                        onToggle={handleFollowToggle}
                        className="profile-follow-btn"
                      />
                    )}
                    <Link href="/explore" className="back-btn">
                      <span className="material-symbols-outlined" style={{ fontSize: "1.1rem" }}>
                        arrow_back
                      </span>
                      Back
                    </Link>
                  </div>
                </div>

                <div style={{
                  padding: "48px 24px",
                  maxWidth: 1280,
                  margin: "0 auto",
                  width: "100%",
                }}>
                  <h2 style={{
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    color: "var(--on-background)",
                    letterSpacing: "-0.02em",
                    marginBottom: 32,
                    borderBottom: "1px solid var(--outline)",
                    paddingBottom: 16,
                  }}>
                    Recent Pulses
                  </h2>

                  <div className="view-toggle-tabs">
                    <button 
                      className={`view-tab ${viewMode === 'grid' ? 'active' : ''}`}
                      onClick={() => setViewMode('grid')}
                    >
                      <span className="material-symbols-outlined">grid_view</span>
                      Posts
                    </button>
                    <button 
                      className={`view-tab ${viewMode === 'list' ? 'active' : ''}`}
                      onClick={() => setViewMode('list')}
                    >
                      <span className="material-symbols-outlined">reorder</span>
                      Detailed
                    </button>
                  </div>

                  {posts.length > 0 ? (
                    viewMode === 'grid' ? (
                      <div className="profile-grid-container">
                        {posts.map((post, i) => (
                          <GridPost
                            key={i}
                            post_id={post.post_id}
                            img={post.img}
                            text={post.text}
                            likes={post.likes}
                            comment_count={post.comment_count}
                          />
                        ))}
                      </div>
                    ) : (
                      <div style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 24,
                      }}>
                        {posts.map((post, i) => (
                          <Post
                            key={i}
                            name={post.name}
                            username={post.username}
                            text={post.text}
                            pfp={post.pfp}
                            img={post.img}
                            email={currentEmail}
                            post_email={post.user_email || ""}
                            post_id={post.post_id}
                            likes={post.likes}
                            comment_count={post.comment_count || 0}
                            onDeleted={handlePostDeleted}
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
                      <p>This creator hasn&apos;t shared any pulses yet.</p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="empty-state" style={{ paddingTop: 120 }}>
                <span className="material-symbols-outlined" style={{ fontSize: "3rem" }}>
                  person_off
                </span>
                <h3>User not found</h3>
                <Link href="/explore" className="back-btn" style={{ marginTop: 16 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "1.1rem" }}>
                    arrow_back
                  </span>
                  Back to Explore
                </Link>
              </div>
            )}
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