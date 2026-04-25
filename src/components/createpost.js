import { useState } from "react";
import { useSWRConfig } from "swr";
import { useSafeUser, useSafeAuth } from "@/lib/clerk-hooks";
import { useRouter } from "next/router";
import { createPost } from "@/lib/api";
import Image from "next/image";

export default function Createpost() {
  const { user } = useSafeUser();
  const { getToken } = useSafeAuth();
  const { mutate } = useSWRConfig();
  const router = useRouter();
  const [text, setText] = useState("");
  const [imageSrc, setImageSrc] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

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

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) processFile(file);
  };

  const processFile = (file) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => setImageSrc(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => setIsDragOver(false);

  const removeImage = () => setImageSrc("");

  async function handleSubmit() {
    if (!text.trim() && !imageSrc) return;
    if (!user) return;

    setIsSubmitting(true);
    try {
      const token = await getToken();
      const email = user.primaryEmailAddress?.emailAddress || "";
      await createPost(
        {
          user: user.fullName || user.firstName || "User",
          username: generateUsername(email),
          text: text.trim(),
          img: imageSrc,
          pfp: user.imageUrl || "",
        },
        token
      );
      mutate("trending-tags"); // Refresh hashtags
      router.push("/explore");
    } catch (err) {
      console.error("Failed to create post:", err);
      setIsSubmitting(false);
    }
  }

  if (!user) {
    return (
      <section className="create-post-section">
        <div className="skeleton-block" style={{ height: "400px" }}></div>
      </section>
    );
  }

  return (
    <section className="create-post-section">
      <div className="create-post-header">
        <h1 className="create-post-title">
          What&apos;s On <span className="gradient-text">Your Mind</span>?
        </h1>
        <p className="create-post-subtitle">
          Share your thoughts with the community
        </p>
      </div>

      <div className="create-post-form">
        {/* Text Area */}
        <div className="textarea-wrapper">
          <textarea
            className="post-textarea"
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={500}
            placeholder="Start typing your thoughts..."
            rows={5}
          />
          <span className="char-count">{text.length}/500</span>
        </div>

        {/* Image Upload / Preview */}
        {imageSrc ? (
          <div className="image-preview">
            <Image
              src={imageSrc}
              alt="Preview"
              className="preview-img"
              width={500}
              height={300}
            />
            <button className="remove-image-btn" onClick={removeImage}>
              <i className="bx bx-x"></i>
            </button>
          </div>
        ) : (
          <div
            className={`drop-zone ${isDragOver ? "drag-over" : ""}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => document.getElementById("file-input").click()}
          >
            <i className="bx bx-cloud-upload"></i>
            <p>Drop an image here or click to browse</p>
            <input
              type="file"
              id="file-input"
              className="hidden-input"
              onChange={handleFileChange}
              accept="image/*"
            />
          </div>
        )}

        {/* Submit Button */}
        <button
          className="submit-post-btn"
          onClick={handleSubmit}
          disabled={isSubmitting || (!text.trim() && !imageSrc)}
        >
          {isSubmitting ? (
            <>
              <i className="bx bx-loader-alt bx-spin"></i>
              Posting...
            </>
          ) : (
            <>
              <i className="bx bx-send"></i>
              Share Post
            </>
          )}
        </button>
      </div>
    </section>
  );
}
