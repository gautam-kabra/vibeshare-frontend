import Link from "next/link";
import Image from "next/image";

export default function GridPost({ post_id, img, text, likes, comment_count }) {
  // If there's no image, we show a stylized text preview
  const hasImage = !!img;

  return (
    <Link href={`/posts/${post_id}`} className="grid-post">
      {hasImage ? (
        <div className="grid-post-image-wrapper">
          <img src={img} alt="Post thumbnail" className="grid-post-img" />
        </div>
      ) : (
        <div className="grid-post-text-fallback">
          <p className="fallback-text">{text?.substring(0, 50)}{text?.length > 50 ? "..." : ""}</p>
        </div>
      )}

      {/* Hover Overlay */}
      <div className="grid-post-overlay">
        <div className="overlay-item">
          <span className="material-symbols-outlined">favorite</span>
          <span className="count-text">{likes || 0}</span>
        </div>
        <div className="overlay-item">
          <span className="material-symbols-outlined">chat_bubble</span>
          <span className="count-text">{comment_count || 0}</span>
        </div>
      </div>
    </Link>
  );
}
