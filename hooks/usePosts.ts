'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Post, PostSearchParams, PaginatedResponse } from '@/types';

const LIMIT = 12;

export function usePosts(initialParams: PostSearchParams = {}) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const paramsRef = useRef(initialParams);
  const [params, setParams] = useState<PostSearchParams>(initialParams);

  const fetchPosts = useCallback(async (searchParams: PostSearchParams, pageNum: number, append = false) => {
    if (append) setLoadingMore(true);
    else setLoading(true);
    setError(null);

    try {
      const qs = new URLSearchParams();
      if (searchParams.query) qs.set('query', searchParams.query);
      if (searchParams.section && searchParams.section !== 'all') qs.set('section', searchParams.section);
      if (searchParams.tag) qs.set('tag', searchParams.tag);
      if (searchParams.platform) qs.set('platform', searchParams.platform);
      if (searchParams.featured !== undefined) qs.set('featured', String(searchParams.featured));
      qs.set('page', String(pageNum));
      qs.set('limit', String(LIMIT));

      const res = await fetch(`/api/posts?${qs.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch posts');
      const json: { success: boolean; data: Post[]; meta: { total: number; hasMore: boolean } } = await res.json();

      setPosts(prev => append ? [...prev, ...json.data] : json.data);
      setHasMore(json.meta.hasMore);
      setTotal(json.meta.total);
    } catch (e: any) {
      setError(e.message ?? 'Something went wrong');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  // Initial load + param changes
  useEffect(() => {
    setPage(1);
    fetchPosts(params, 1, false);
  }, [params, fetchPosts]);

  const loadMore = useCallback(() => {
    if (!hasMore || loadingMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPosts(params, nextPage, true);
  }, [hasMore, loadingMore, page, params, fetchPosts]);

  const updateParams = useCallback((newParams: Partial<PostSearchParams>) => {
    setParams(prev => ({ ...prev, ...newParams }));
  }, []);

  const refresh = useCallback(() => {
    setPage(1);
    fetchPosts(params, 1, false);
  }, [params, fetchPosts]);

  return { posts, loading, loadingMore, error, hasMore, total, loadMore, updateParams, params, refresh };
}

// ─── FEATURED POSTS ────────────────────────────────────────
export function useFeaturedPosts(limit = 3) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetch_() {
      try {
        const res = await fetch(`/api/posts?featured=true&limit=${limit}`);
        const json = await res.json();
        setPosts(json.data ?? []);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetch_();
  }, [limit]);

  return { posts, loading, error };
}

// ─── SEARCH POSTS (debounced) ──────────────────────────────
export function useSearchPosts(debounceMs = 350) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Post[]>([]);
  const [searching, setSearching] = useState(false);
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    clearTimeout(timerRef.current);
    if (!query.trim()) { setResults([]); return; }
    setSearching(true);
    timerRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/posts?query=${encodeURIComponent(query)}&limit=8`);
        const json = await res.json();
        setResults(json.data ?? []);
      } catch {}
      finally { setSearching(false); }
    }, debounceMs);
    return () => clearTimeout(timerRef.current);
  }, [query, debounceMs]);

  return { query, setQuery, results, searching };
}

// ─── SINGLE POST ───────────────────────────────────────────
export function usePost(slug: string) {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    async function fetch_() {
      try {
        const res = await fetch(`/api/posts/${slug}`);
        const json = await res.json();
        setPost(json.data ?? null);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetch_();
  }, [slug]);

  return { post, loading, error };
}

// ─── ALL TAGS ──────────────────────────────────────────────
export function useAllTags() {
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/posts/tags')
      .then(r => r.json())
      .then(d => setTags(d.data ?? []))
      .finally(() => setLoading(false));
  }, []);

  return { tags, loading };
}
