import Image from "next/image";
import Link from "next/link";

export default function CustomUser({
  name,
  pfp,
  username,
  email,
  bio,
  followers = 0,
  following = 0,
}) {
  return (
    <section className="profile-section">
      {/* Profile Header */}
      <div className="profile-banner">
        <div className="profile-banner-overlay"></div>
      </div>

      <div className="profile-details">
        {pfp && (
          <Image
            className="profile-avatar"
            width={120}
            height={120}
            src={pfp}
            alt={name}
          />
        )}

        <h2 className="profile-name">{name}</h2>
        <p className="profile-email">@{username}</p>
        {bio && <p className="profile-bio">{bio}</p>}

        <div className="profile-stats">
          <div className="profile-stat">
            <span className="stat-number">{followers}</span>
            <span className="stat-label">Followers</span>
          </div>
          <div className="profile-stat">
            <span className="stat-number">{following}</span>
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
