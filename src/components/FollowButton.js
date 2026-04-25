import { useState, useEffect } from "react";
import { useSafeUser, useSafeAuth } from "@/lib/clerk-hooks";
import { followUser, unfollowUser, checkFollowing } from "@/lib/api";

/**
 * A reusable Follow/Following button component.
 * @param {string} targetEmail - The email of the user to follow/unfollow.
 * @param {Function} onToggle - Optional callback after successfully toggling.
 * @param {string} className - Optional custom class.
 */
export default function FollowButton({ targetEmail, onToggle, className = "" }) {
  const { user, isSignedIn } = useSafeUser();
  const { getToken } = useSafeAuth();
  
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const currentUserEmail = user?.primaryEmailAddress?.emailAddress;

  useEffect(() => {
    async function initStatus() {
      if (!isSignedIn || !currentUserEmail || !targetEmail || currentUserEmail === targetEmail) {
        setIsLoading(false);
        return;
      }
      try {
        const { following } = await checkFollowing(currentUserEmail, targetEmail);
        setIsFollowing(following);
      } catch (err) {
        console.error("Failed to check following status:", err);
      }
      setIsLoading(false);
    }
    initStatus();
  }, [isSignedIn, currentUserEmail, targetEmail]);

  async function handleToggle() {
    if (!isSignedIn) {
      // Redirect to login or show alert
      alert("Please sign in to follow users.");
      return;
    }
    
    setIsActionLoading(true);
    try {
      const token = await getToken();
      if (isFollowing) {
        await unfollowUser(currentUserEmail, targetEmail, token);
        setIsFollowing(false);
      } else {
        await followUser(currentUserEmail, targetEmail, token);
        setIsFollowing(true);
      }
      if (onToggle) onToggle();
    } catch (err) {
      console.error("Action failed:", err);
      alert("Action failed. Please try again.");
    }
    setIsActionLoading(false);
  }

  if (isLoading || currentUserEmail === targetEmail) return null;

  const btnClass = isFollowing ? "following-btn" : "follow-btn";

  return (
    <button 
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleToggle();
      }}
      className={`${btnClass} ${className}`}
      disabled={isActionLoading}
    >
      {isActionLoading ? "..." : isFollowing ? "Following" : "Follow"}
    </button>
  );
}
