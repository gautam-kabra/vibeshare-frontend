import { useSafeUser } from "@/lib/clerk-hooks";
import Image from "next/image";
import Link from "next/link";

export default function ProfileView() {
  const { user } = useSafeUser();

  if (!user) {
    return (
      <section className="profile-section">
        <div className="skeleton-block" style={{ height: "300px" }}></div>
      </section>
    );
  }

  const email = user.primaryEmailAddress?.emailAddress || "";

  return (
    <section className="profile-section">
      {/* Profile Header */}
      <div className="profile-banner">
        <div className="profile-banner-overlay"></div>
      </div>

      <div className="profile-details">
        <Image
          className="profile-avatar"
          width={120}
          height={120}
          src={user.imageUrl}
          alt={user.fullName || "Profile"}
        />

        <h2 className="profile-name">{user.fullName || user.firstName}</h2>
        <p className="profile-email">{email}</p>

        <div className="profile-stats">
          <div className="profile-stat">
            <span className="stat-number">—</span>
            <span className="stat-label">Posts</span>
          </div>
          <div className="profile-stat">
            <span className="stat-number">—</span>
            <span className="stat-label">Followers</span>
          </div>
          <div className="profile-stat">
            <span className="stat-number">—</span>
            <span className="stat-label">Following</span>
          </div>
        </div>

        <div className="profile-actions">
          <Link href="/explore" className="back-btn">
            <i className="bx bx-arrow-back"></i>
            Back to Feed
          </Link>
        </div>
      </div>
    </section>
  );
}
