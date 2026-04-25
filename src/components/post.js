import { useEffect, useState, useCallback, useRef } from "react";
import { useSafeAuth } from "@/lib/clerk-hooks";
import { useComments } from "@/lib/hooks";
import { likePost, checkLiked, createComment, deletePost } from "@/lib/api";
import { useSWRConfig } from "swr";
import CommentSpan from "./comment";
import Link from "next/link";
import Image from "next/image";

export default function Post({
  shared = false,
  name,
  username,
  text,
  pfp,
  img,
  email = "none",
  post_email = "",
  post_id,
  likes,
  comment_count = 0,
  onDeleted,
}) {
  const { getToken } = useSafeAuth();
  const { mutate } = useSWRConfig();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes || 0);
  const [likeLoaded, setLikeLoaded] = useState(false);
  const [commentsVisible, setCommentsVisible] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [repostCopied, setRepostCopied] = useState(false);
  const menuRef = useRef(null);
  const { comments, mutate: mutateComments } = useComments(
    commentsVisible ? post_id : null
  );

  const isOwner = email !== "none" && email === post_email;

  useEffect(() => {
    async function loadLikeStatus() {
      if (email !== "none" && post_id) {
        try {
          const data = await checkLiked(post_id, email);
          setLiked(data.liked);
          setLikeLoaded(true);
        } catch {
          setLikeLoaded(true);
        }
      }
    }
    loadLikeStatus();
  }, [email, post_id]);

  // Close menu on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const handleLike = useCallback(async () => {
    if (email === "none" || !likeLoaded) return;
    const wasLiked = liked;
    setLiked(!wasLiked);
    setLikeCount((prev) => (wasLiked ? prev - 1 : prev + 1));
    try {
      const token = await getToken();
      const data = await likePost(post_id, email, token);
      setLikeCount(data.likes);
    } catch {
      setLiked(wasLiked);
      setLikeCount((prev) => (wasLiked ? prev + 1 : prev - 1));
    }
  }, [liked, likeLoaded, email, post_id, getToken]);

  const handleComment = useCallback(async () => {
    if (email === "none") return;
    const trimmed = commentText.trim();
    if (!trimmed) return;
    setIsSubmitting(true);
    try {
      const token = await getToken();
      await createComment(
        { postId: post_id, userEmail: email, text: trimmed, name },
        token
      );
      setCommentText("");
      mutate("trending-tags"); // Refresh hashtags
      mutateComments();
    } catch (err) {
      console.error("Comment failed:", err);
    }
    setIsSubmitting(false);
  }, [commentText, email, post_id, name, getToken, mutateComments]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleComment();
    }
  };

  const handleDelete = useCallback(async () => {
    if (!isOwner) return;
    if (!window.confirm("Are you sure you want to delete this pulse?")) return;
    try {
      const token = await getToken();
      await deletePost(post_id, email, token);
      mutate("trending-tags"); // Refresh hashtags
      if (onDeleted) onDeleted(post_id);
    } catch (err) {
      console.error("Delete failed:", err);
    }
    setMenuOpen(false);
  }, [isOwner, post_id, email, getToken, onDeleted]);

  const handleRepost = useCallback(() => {
    const url = `${window.location.origin}/posts/${post_id}`;
    navigator.clipboard.writeText(url).then(() => {
      setRepostCopied(true);
      setTimeout(() => setRepostCopied(false), 2000);
    });
  }, [post_id]);

  const liveCommentCount = commentsVisible
    ? comments.length
    : comment_count;

  return (
    <>
      <article className={shared ? "post shared-post" : "post"}>
        {/* Header */}
        <div className="post-head">
          <Link href={`/users/${username}`} className="post-author">
            <div className="post-author-avatar-ring">
              {pfp && (
                <Image
                  width={40}
                  height={40}
                  className="author-img"
                  src={pfp}
                  alt={name || "User"}
                />
              )}
            </div>
            <div className="author-info">
              <p className="author-name">{name}</p>
              <p className="author-username">@{username}</p>
            </div>
          </Link>

          {/* Three-dot menu */}
          <div className="post-menu-container" ref={menuRef}>
            <button
              className="post-link-icon"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <span className="material-symbols-outlined">more_horiz</span>
            </button>

            {menuOpen && (
              <div className="post-dropdown-menu">
                <Link href={`/posts/${post_id}`} className="post-dropdown-item">
                  <span className="material-symbols-outlined">open_in_new</span>
                  View Post
                </Link>
                <button className="post-dropdown-item" onClick={handleRepost}>
                  <span className="material-symbols-outlined">link</span>
                  Copy Link
                </button>
                {isOwner && (
                  <button
                    className="post-dropdown-item post-dropdown-danger"
                    onClick={handleDelete}
                  >
                    <span className="material-symbols-outlined">delete</span>
                    Delete
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        {text && (
          <div className="post-content">
            <p>{text}</p>
          </div>
        )}

        {/* Image */}
        {img && (
          <div className="post-image-container">
            <img
              src={img}
              className="post-img"
              alt="Post image"
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>
        )}

        {/* Actions */}
        {!shared && (
          <div className="post-footer">
            <div className="post-actions">
              <div className="post-actions-left">
                <button
                  className={`action-btn like-btn ${liked ? "liked" : ""}`}
                  onClick={handleLike}
                >
                  <span
                    className="material-symbols-outlined"
                    style={
                      liked
                        ? { fontVariationSettings: "'FILL' 1" }
                        : undefined
                    }
                  >
                    favorite
                  </span>
                  <span>{likeCount || ""}</span>
                </button>

                <button
                  className="action-btn"
                  onClick={() => setCommentsVisible(!commentsVisible)}
                >
                  <span className="material-symbols-outlined">
                    chat_bubble
                  </span>
                  <span>{liveCommentCount || ""}</span>
                </button>

                <button
                  className={`action-btn ${repostCopied ? "repost-copied" : ""}`}
                  onClick={handleRepost}
                  title="Copy post link"
                >
                  <span className="material-symbols-outlined">repeat</span>
                  <span>{repostCopied ? "Copied!" : ""}</span>
                </button>
              </div>

              <button className="action-btn" onClick={handleRepost}>
                <span className="material-symbols-outlined">share</span>
              </button>
            </div>

            {/* Comment Input */}
            <div className="comment-input-wrapper">
              <input
                className="comment-input"
                maxLength={150}
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Write a comment..."
                disabled={isSubmitting}
              />
              <button
                className="comment-send-btn"
                onClick={handleComment}
                disabled={isSubmitting || !commentText.trim()}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "0.9rem" }}>
                  send
                </span>
              </button>
            </div>

            {!commentsVisible && (
              <button
                className="view-comments-btn"
                onClick={() => setCommentsVisible(true)}
              >
                View comments
              </button>
            )}
          </div>
        )}
      </article>

      {/* Comments */}
      {!shared && commentsVisible && (
        <div className="comments-section">
          {comments.length === 0 ? (
            <p className="no-comments">No comments yet. Be the first!</p>
          ) : (
            comments.map((comment, i) => (
              <CommentSpan
                key={i}
                name={comment.name}
                email={comment.email}
                text={comment.text}
              />
            ))
          )}
        </div>
      )}
    </>
  );
}
