import Head from "next/head";
import { useState, useCallback } from "react";
import { useSafeUser, useSafeAuth } from "@/lib/clerk-hooks";
import { createPost } from "@/lib/api";
import { useRouter } from "next/router";
import Sidebar from "@/components/sidebar";
import Image from "next/image";

export default function NewPostPage() {
  const { user } = useSafeUser();
  const { getToken } = useSafeAuth();
  const router = useRouter();

  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleImageSelect = useCallback((file) => {
    if (!file) return;
    setImage(file);
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer?.files?.[0];
      if (file && file.type.startsWith("image/")) handleImageSelect(file);
    },
    [handleImageSelect]
  );

  const handleSubmit = useCallback(async () => {
    if (!text.trim() && !image) return;
    if (!user) return;
    setIsSubmitting(true);

    try {
      const email = user.primaryEmailAddress?.emailAddress || "";
      const token = await getToken();
      
      await createPost({
        user_email: email,
        text: text.trim(),
        img: preview || ""
      }, token);
      router.push("/explore");
    } catch (err) {
      console.error("Post creation failed:", err);
    }
    setIsSubmitting(false);
  }, [text, image, user, getToken, router]);

  return (
    <>
      <Head>
        <title>Create Post — VibeShare</title>
        <meta name="description" content="Create a new post on VibeShare." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="main">
        <div className="app">
          <Sidebar />

          <section className="create-post-section">
            <div className="create-post-header">
              <h1 className="create-post-title">
                Create a <span className="gradient-text">Pulse</span>
              </h1>
              <p className="create-post-subtitle">
                Share your vision with the network.
              </p>
            </div>

            <div className="create-post-form">
              {/* Textarea */}
              <div className="textarea-wrapper">
                <textarea
                  className="post-textarea"
                  placeholder="What's on your mind?"
                  maxLength={500}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
                <span className="char-count">{text.length}/500</span>
              </div>

              {/* Image Upload */}
              {!preview ? (
                <div
                  className={`drop-zone ${isDragOver ? "drag-over" : ""}`}
                  onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById("file-input").click()}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "2.5rem" }}>
                    cloud_upload
                  </span>
                  <p>Drop an image or click to upload</p>
                  <input
                    id="file-input"
                    type="file"
                    accept="image/*"
                    className="hidden-input"
                    onChange={(e) => handleImageSelect(e.target.files?.[0])}
                  />
                </div>
              ) : (
                <div className="image-preview" style={{ position: 'relative', width: '100%', marginTop: '16px' }}>
                  <img
                    src={preview}
                    alt="Preview"
                    style={{ 
                      width: '100%', 
                      height: 'auto', 
                      borderRadius: 'var(--radius-lg)',
                      display: 'block',
                      maxHeight: '500px',
                      objectFit: 'contain',
                      background: 'rgba(0,0,0,0.2)'
                    }}
                  />
                  <button
                    className="remove-image-btn"
                    onClick={() => { setImage(null); setPreview(null); }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: "1.3rem" }}>
                      close
                    </span>
                  </button>
                </div>
                )}

              {/* Submit */}
              <button
                className="submit-post-btn"
                onClick={handleSubmit}
                disabled={isSubmitting || (!text.trim() && !image)}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "1.1rem" }}>
                  send
                </span>
                {isSubmitting ? "Publishing..." : "Publish Pulse"}
              </button>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
