import { useFollowers, useFollowing } from "@/lib/hooks";
import FollowButton from "./FollowButton";
import Link from "next/link";
import Image from "next/image";
import Loading from "./loading";
import { useRouter } from "next/router";

export default function UserListModal({ username, type, onClose }) {
  const router = useRouter();
  const { users: followers, isLoading: loadingFollowers } = useFollowers(username);
  const { users: following, isLoading: loadingFollowing } = useFollowing(username);

  const users = type === "followers" ? followers : following;
  const isLoading = type === "followers" ? loadingFollowers : loadingFollowing;
  const title = type === "followers" ? "Followers" : "Following";

  function handleUserClick(user) {
    onClose();
    router.push(`/users/${user.username}`);
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content users-list-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="modal-close-btn" onClick={onClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="modal-body">
          {isLoading ? (
            <div className="modal-loading">
              <Loading />
            </div>
          ) : users.length === 0 ? (
            <div className="modal-empty-state">
              <span className="material-symbols-outlined">person_off</span>
              <p>No {type} found.</p>
            </div>
          ) : (
            <div className="user-list">
              {users.map((user, i) => (
                <div key={i} className="user-list-item">
                  <div 
                    className="user-item-info"
                    onClick={() => handleUserClick(user)}
                    style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 0 }}
                  >
                    <Image
                      src={user.pfp || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop"}
                      alt={user.name}
                      width={44}
                      height={44}
                      className="user-item-pfp"
                    />
                    <div className="user-item-names">
                      <p className="user-item-name">{user.name}</p>
                      <p className="user-item-username">@{user.username}</p>
                    </div>
                  </div>
                  <FollowButton 
                    targetEmail={user.email} 
                    className="user-item-follow-btn" 
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
