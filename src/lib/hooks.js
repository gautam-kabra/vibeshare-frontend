/**
 * VibeShare — Custom React Hooks
 * SWR-powered data fetching hooks with caching, revalidation, and error handling.
 */

import useSWR from "swr";
import { fetchPosts, fetchPost, fetchFeatured, fetchComments, fetchUser, fetchUserByEmail, fetchUserPosts, searchUsers, fetchTrendingTags, fetchFollowStats, fetchFollowerList, fetchFollowingList } from "./api";

/**
 * Hook to fetch all posts with auto-revalidation.
 */
export function usePosts() {
  const { data, error, isLoading, mutate } = useSWR("posts", fetchPosts, {
    revalidateOnFocus: false,
    refreshInterval: 30000, // Refresh every 30 seconds
  });

  return {
    posts: data?.posts || [],
    isLoading,
    isError: error,
    mutate,
  };
}

/**
 * Hook to fetch a single post by ID.
 */
export function usePost(postId) {
  const { data, error, isLoading } = useSWR(
    postId ? `post-${postId}` : null,
    () => fetchPost(postId),
    { revalidateOnFocus: false }
  );

  return {
    post: data || null,
    isLoading,
    isError: error,
  };
}

/**
 * Hook to fetch featured/suggested users.
 */
export function useFeaturedUsers() {
  const { data, error, isLoading } = useSWR("featured", fetchFeatured, {
    revalidateOnFocus: false,
    refreshInterval: 60000,
  });

  return {
    accounts: data?.accounts || [],
    isLoading,
    isError: error,
  };
}

/**
 * Hook to fetch trending hashtags from the backend.
 */
export function useTrendingTags() {
  const { data, error, isLoading } = useSWR("trending-tags", fetchTrendingTags, {
    revalidateOnFocus: false,
    refreshInterval: 60000, // Refresh every minute
  });

  return {
    trending: data?.trending || [],
    isLoading,
    isError: error,
  };
}

/**
 * Hook to fetch comments for a post.
 */
export function useComments(postId) {
  const { data, error, isLoading, mutate } = useSWR(
    postId ? `comments-${postId}` : null,
    () => fetchComments(postId),
    { revalidateOnFocus: false }
  );

  return {
    comments: data?.comments || [],
    isLoading,
    isError: error,
    mutate,
  };
}

/**
 * Hook to fetch a user profile by username.
 */
export function useUserProfile(username) {
  const { data, error, isLoading } = useSWR(
    username ? `user-${username}` : null,
    () => fetchUser(username),
    { revalidateOnFocus: false }
  );

  return {
    profile: data?.user || data || null,
    isLoading,
    isError: error,
  };
}

/**
 * Hook to fetch a user profile by email.
 */
export function useUserEmailProfile(email) {
  const { data, error, isLoading, mutate } = useSWR(
    email ? `user-email-${email}` : null,
    () => fetchUserByEmail(email),
    { revalidateOnFocus: false }
  );

  return {
    profile: data?.user || data || null,
    isLoading,
    isError: error,
    mutate,
  };
}

/**
 * Hook to fetch posts for a specific user.
 */
export function useUserPosts(username) {
  const { data, error, isLoading, mutate } = useSWR(
    username ? `user-posts-${username}` : null,
    () => fetchUserPosts(username),
    { revalidateOnFocus: false }
  );

  return {
    posts: data?.posts || [],
    isLoading,
    isError: error,
    mutate,
  };
}

/**
 * Hook to search users with a query string.
 * Only fires when query is at least 2 characters.
 */
export function useUserSearch(query) {
  const { data, error, isLoading } = useSWR(
    query && query.length >= 2 ? `search-${query}` : null,
    () => searchUsers(query),
    {
      revalidateOnFocus: false,
      dedupingInterval: 500,
    }
  );

  return {
    results: data?.results || [],
    isLoading,
    isError: error,
  };
}

/**
 * Hook to fetch follower and following counts.
 */
export function useFollowStats(username) {
  const { data, error, mutate } = useSWR(
    username ? `follow-stats-${username}` : null,
    () => fetchFollowStats(username),
    { revalidateOnFocus: false }
  );

  return {
    stats: data || { followers: 0, following: 0 },
    isLoading: !error && !data,
    mutate,
  };
}

/**
 * Hook to fetch the list of followers.
 */
export function useFollowers(username) {
  const { data, error, mutate } = useSWR(
    username ? `follower-list-${username}` : null,
    () => fetchFollowerList(username),
    { revalidateOnFocus: false }
  );

  return {
    users: data?.users || [],
    isLoading: !error && !data,
    mutate,
  };
}

/**
 * Hook to fetch the list of following.
 */
export function useFollowing(username) {
  const { data, error, mutate } = useSWR(
    username ? `following-list-${username}` : null,
    () => fetchFollowingList(username),
    { revalidateOnFocus: false }
  );

  return {
    users: data?.users || [],
    isLoading: !error && !data,
    mutate,
  };
}
