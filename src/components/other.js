import { useSafeUser } from "@/lib/clerk-hooks";
import { useFeaturedUsers, useTrendingTags } from "@/lib/hooks";
import Image from "next/image";
import Link from "next/link";
import FollowButton from "./FollowButton";

function SuggestCard({ name, username, img, email }) {
  return (
    <div className="suggest-card">
      <Link href={`/users/${username}`} className="suggest-card-info">
        {img && (
          <Image
            width={40}
            height={40}
            className="suggest-img"
            src={img}
            alt={name || "User"}
          />
        )}
        <div className="suggest-info">
          <p className="suggest-name">{name}</p>
          <p className="suggest-username">@{username}</p>
        </div>
      </Link>
      <FollowButton 
        targetEmail={email} 
        className="suggest-follow-btn" 
      />
    </div>
  );
}

export default function Other() {
  const { isSignedIn, user } = useSafeUser();
  const { accounts } = useFeaturedUsers();
  const { trending } = useTrendingTags();

  const currentUserEmail = user?.primaryEmailAddress?.emailAddress;
  const filteredAccounts = accounts.filter(acc => acc.email !== currentUserEmail);

  return (
    <aside className="other">
      {/* Suggested Accounts */}
      <div className="suggestions-section">
        <h3 className="suggestions-title">
          {isSignedIn ? "Suggested Orbits" : "Trending Creators"}
        </h3>

        <div className="suggestions-list">
          {filteredAccounts.map((account, index) => (
            <SuggestCard
              key={index}
              name={account.name}
              username={account.username}
              img={account.img}
              email={account.email}
            />
          ))}
        </div>

        {accounts.length === 0 && (
          <p className="no-suggestions">No suggestions available</p>
        )}
      </div>

      {/* Trending Hashtags */}
      <div className="trending-tags-section">
        <h3 className="suggestions-title">Trending Vibes</h3>
        <div className="trending-list">
          {trending.map((item, index) => (
            <Link key={index} href={`/search?q=${item.tag.slice(1)}`} className="trending-item">
              <span className="trending-tag">{item.tag}</span>
              <span className="trending-count">{item.count} pulses</span>
            </Link>
          ))}
          {trending.length === 0 && (
            <p className="no-trending">Quiet in the void lately...</p>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="about-section">
        <p className="about-text">
          © 2026 VibeShare.<br />
          Pulse into the void.
        </p>
      </div>
    </aside>
  );
}
