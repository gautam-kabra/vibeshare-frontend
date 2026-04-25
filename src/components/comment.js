export default function CommentSpan({ name, email, text }) {
  const initial = (name || email || "?").charAt(0).toUpperCase();

  return (
    <div className="comment">
      <div className="comment-header">
        <div className="comment-avatar">{initial}</div>
        <span className="comment-author">{name || email}</span>
      </div>
      <p className="comment-text">{text}</p>
    </div>
  );
}
