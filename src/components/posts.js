import { useSafeUser } from "@/lib/clerk-hooks";
import { usePosts } from "@/lib/hooks";
import Post from "./post";

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

export default function Posts() {
  const { posts, isLoading, mutate } = usePosts();
  const { user } = useSafeUser();

  const email = user?.primaryEmailAddress?.emailAddress || "none";

  const handlePostDeleted = (deletedPostId) => {
    mutate(
      (data) => ({
        ...data,
        posts: data.posts.filter((p) => p.post_id !== deletedPostId),
      }),
      false
    );
  };

  if (isLoading) {
    return (
      <>
        <SkeletonPost />
        <SkeletonPost />
        <SkeletonPost />
      </>
    );
  }

  if (!posts.length) {
    return (
      <div className="empty-state">
        <span className="material-symbols-outlined" style={{ fontSize: "3rem" }}>
          forum
        </span>
        <h3>No vibes yet</h3>
        <p>Be the first to share a pulse!</p>
      </div>
    );
  }

  return (
    <>
      {posts.map((post) => (
        <Post
          key={post.post_id}
          name={post.name}
          email={email}
          post_email={post.user_email || ""}
          likes={post.likes}
          comment_count={post.comment_count || 0}
          post_id={post.post_id}
          username={post.username}
          text={post.text}
          pfp={post.pfp}
          img={post.img}
          onDeleted={handlePostDeleted}
        />
      ))}
    </>
  );
}
