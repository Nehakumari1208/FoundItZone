'use client';

import React, { useState, useEffect, useMemo } from 'react';
import axiosInstance from '@/lib/axios';
import { useAuth, useUser } from '@clerk/nextjs';
import Pagination from '@/components/Pagination';
import Image from 'next/image';

type Claim = {
  _id: string;
  answer: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  claimedBy: {
    name: string;
    email: string;
    phone?: string;
    userId?: string;
  };
};

type Item = {
  _id: string;
  itemName: string;
  description: string;
  photoUrl: string;
  status: 'active' | 'claimed';
  claims: Claim[];
  postedBy: string;
};

const FoundItemsPage = () => {
  const [posts, setPosts] = useState<Item[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const { user } = useUser();
  const { getToken } = useAuth();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    setError('');
    try {
      const token = await getToken();
      const res = await axiosInstance.get('/items/user/my', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(res.data.data);
    } catch (err) {
      setError('❌ Failed to load items.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = useMemo(() => {
    return posts.filter(post =>
      post.itemName.toLowerCase().includes(search.toLowerCase())
    );
  }, [posts, search]);

  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);
  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredPosts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredPosts, currentPage]);

  return (
    <div className="min-h-screen flex flex-col bg-purple-300 text-white px-4 py-8">
      <div className="max-w-4xl mx-auto bg-zinc-950 p-6 rounded-xl shadow-lg overflow-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Your Found Items</h1>

        <input
          type="text"
          placeholder="Search items..."
          className="mb-6 w-full px-4 py-2 border border-zinc-700 rounded-lg bg-zinc-800 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={search}
          onChange={e => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />

        {loading ? (
          <p className="text-center text-gray-300">Loading items...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : filteredPosts.length === 0 ? (
          <p className="text-center text-gray-400">No items found.</p>
        ) : (
          <>
            <div className="grid grid-cols-1  gap-4">
              {paginatedPosts.map(post => (
                <div
                  key={post._id}
                  className="border border-zinc-700 p-4 rounded-lg shadow-md bg-zinc-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16">
                      <Image
                        src={post.photoUrl}
                        alt={post.itemName}
                        fill
                        className="object-cover rounded"
                      />
                    </div>

                    <div>
                      <h2 className="font-semibold text-lg text-white">{post.itemName}</h2>
                      <p className="text-gray-400 text-sm">{post.description}</p>
                    </div>
                  </div>
                  <a
                    href={`/item/${post._id}/claims`}
                    className="text-sm text-indigo-400 hover:underline text-right"
                  >
                    View Claims
                  </a>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FoundItemsPage;
