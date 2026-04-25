import Head from "next/head";
import { useRouter } from "next/router";
import { useSafeUser } from "@/lib/clerk-hooks";
import Sidebar from "@/components/sidebar";
import Post from "@/components/post";
import Other from "@/components/other";
import { usePost } from "@/lib/hooks";
import Link from "next/link";

function SkeletonPost() {
  return (
    <div className="skeleton-post">
      <div className="skeleton-header">
        <div className="skeleton-avatar"></div>
        <div className="skeleton-text-group">
          <div className="skeleton-line" style={{ width: "40%" }}></div>
          <div className="skeleton-line skeleton-line-short"></div>
        </div>
      </div>
      <div className="skeleton-line skeleton-line-full"></div>
      <div className="skeleton-line skeleton-line-medium"></div>
      <div className="skeleton-block"></div>
    </div>
  );
}

export default function PostDetailPage() {
  const router = useRouter();
  const { postid } = router.query;
  const { user } = useSafeUser();
  const { post, isLoading, isError } = usePost(postid ? Number(postid) : null);

  const email = user?.primaryEmailAddress?.emailAddress || "none";

  return (
    <>
      <Head>
        <title>
          {post?.name ? `${post.name}'s post — VibeShare` : "Post — VibeShare"}
        </title>
        <meta name="description" content="View a post on VibeShare." />
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
            padding: "48px 32px 96px",
            overflowY: "auto",
          }}>
            {/* Back link */}
            <div style={{ width: "100%", maxWidth: 680, marginBottom: 24 }}>
              <Link href="/explore" className="back-btn" style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 16px",
                borderRadius: "var(--radius-md)",
                background: "var(--surface-container-low)",
                color: "var(--on-surface-variant)",
                fontSize: "0.8125rem",
                fontWeight: 500,
                transition: "all 0.2s",
                border: "none",
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: "1rem" }}>
                  arrow_back
                </span>
                Back to Feed
              </Link>
            </div>

            {isLoading ? (
              <SkeletonPost />
            ) : isError || !post ? (
              <div className="empty-state">
                <span className="material-symbols-outlined" style={{ fontSize: "3rem" }}>
                  error_outline
                </span>
                <h3>Post not found</h3>
                <p>This pulse may have been removed or doesn&apos;t exist.</p>
              </div>
            ) : (
              <Post
                shared={false}
                name={post.name}
                email={email}
                likes={post.likes}
                post_id={post.post_id}
                username={post.username}
                text={post.text}
                pfp={post.pfp}
                img={post.img}
              />
            )}
          </div>

          <Other />
        </div>
      </main>
    </>
  );
}
