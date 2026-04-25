/**
 * VibeShare — Centralized API Client
 * All backend API calls go through this module.
 * Automatically injects Clerk auth tokens for authenticated requests.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/**
 * Core API client function.
 * @param {string} path - API endpoint path (e.g., "/api/get-posts")
 * @param {object} options - Fetch options
 * @param {string} token - Optional Clerk session token for authenticated requests
 */
export async function apiClient(path, options = {}, token = null) {
  const url = `${API_URL}${path}`;

  const headers = {
    ...options.headers,
  };

  // Do not set Content-Type to application/json for FormData. 
  // The browser will automatically set it to multipart/form-data with the correct boundary.
  if (!(options.body instanceof FormData) && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Request failed" }));
    throw new Error(error.detail || `API Error: ${response.status}`);
  }

  return response.json();
}

// ──────────────────────────────────────────────
// Posts
// ──────────────────────────────────────────────

export function fetchPosts() {
  return apiClient("/api/get-posts");
}

export function fetchPost(postId) {
  return apiClient("/api/get-post", {
    method: "POST",
    body: JSON.stringify({ post_id: postId }),
  });
}

export function fetchUserPosts(username) {
  return apiClient("/api/get-user-posts", {
    method: "POST",
    body: JSON.stringify({ username }),
  });
}

export function createPost(formDataOrObj, token) {
  const isFormData = formDataOrObj instanceof FormData;

  return apiClient(
    "/api/create-post",
    {
      method: "POST",
      body: isFormData ? formDataOrObj : JSON.stringify(formDataOrObj),
    },
    token
  );
}

export function deletePost(postId, userEmail, token) {
  return apiClient(
    "/api/delete-post",
    {
      method: "POST",
      body: JSON.stringify({ post_id: postId, user_email: userEmail }),
    },
    token
  );
}

// ──────────────────────────────────────────────
// Likes
// ──────────────────────────────────────────────

export function likePost(postId, userEmail, token) {
  return apiClient(
    "/api/like-post",
    {
      method: "POST",
      body: JSON.stringify({ post_id: postId, user_email: userEmail }),
    },
    token
  );
}

export function checkLiked(postId, userEmail) {
  return apiClient("/api/check-liked", {
    method: "POST",
    body: JSON.stringify({ post_id: postId, user_email: userEmail }),
  });
}

// ──────────────────────────────────────────────
// Comments
// ──────────────────────────────────────────────

export function createComment({ postId, userEmail, text, name }, token) {
  return apiClient(
    "/api/create-comment",
    {
      method: "POST",
      body: JSON.stringify({
        post_id: postId,
        user_email: userEmail,
        text,
        name,
      }),
    },
    token
  );
}

export function fetchComments(postId) {
  return apiClient("/api/get-comments", {
    method: "POST",
    body: JSON.stringify({ post_id: postId }),
  });
}

// ──────────────────────────────────────────────
// Users
// ──────────────────────────────────────────────

export function fetchUser(username) {
  return apiClient("/api/get-user", {
    method: "POST",
    body: JSON.stringify({ username }),
  });
}

export function fetchUserByEmail(email) {
  return apiClient("/api/get-user-by-email", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export function createUser({ name, username, email, pfp, clerkId }) {
  return apiClient("/api/create-user", {
    method: "POST",
    body: JSON.stringify({
      name,
      username,
      email,
      pfp,
      clerk_id: clerkId,
    }),
  });
}

export function updateUserUsername(email, new_username, token) {
  return apiClient(
    "/api/update-user",
    {
      method: "POST",
      body: JSON.stringify({ email, new_username }),
    },
    token
  );
}

export function fetchFeatured() {
  return apiClient("/api/get-featured");
}

export function fetchTrendingTags() {
  return apiClient("/api/get-trending-tags");
}

export function searchUsers(query) {
  return apiClient("/api/search-users", {
    method: "POST",
    body: JSON.stringify({ query }),
  });
}

// ──────────────────────────────────────────────
// Follow System
// ──────────────────────────────────────────────

export function followUser(followerEmail, followingEmail, token) {
  return apiClient(
    "/api/follow-user",
    {
      method: "POST",
      body: JSON.stringify({
        follower_email: followerEmail,
        following_email: followingEmail,
      }),
    },
    token
  );
}

export function unfollowUser(followerEmail, followingEmail, token) {
  return apiClient(
    "/api/unfollow-user",
    {
      method: "POST",
      body: JSON.stringify({
        follower_email: followerEmail,
        following_email: followingEmail,
      }),
    },
    token
  );
}

export function checkFollowing(followerEmail, followingEmail) {
  return apiClient("/api/check-following", {
    method: "POST",
    body: JSON.stringify({
      follower_email: followerEmail,
      following_email: followingEmail,
    }),
  });
}

export function fetchFollowStats(username) {
  return apiClient("/api/get-followers", {
    method: "POST",
    body: JSON.stringify({ username }),
  });
}

export function fetchFollowerList(username) {
  return apiClient("/api/get-follower-list", {
    method: "POST",
    body: JSON.stringify({ username }),
  });
}

export function fetchFollowingList(username) {
  return apiClient("/api/get-following-list", {
    method: "POST",
    body: JSON.stringify({ username }),
  });
}
