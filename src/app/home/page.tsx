"use client";

import { useState, useMemo, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
import FeedCard from "@/components/FeedsSection";
import Link from "next/link";
import axiosInstance from "@/lib/axios";

import Pagination from "@/components/Pagination";

const ITEMS_PER_PAGE = 6;

type FeedItem = {
  _id: string;
  itemName: string;
  description: string;
  category: string;
  type: "Found" | "Lost";
  postedBy: string;
  datetime: string;
  place: string;
  photoUrl?: string;
};

export default function Home() {
  const { user, isLoaded } = useUser();

  const [items, setItems] = useState<FeedItem[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 📦 Fetch items
  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await axiosInstance.get<{ data: FeedItem[] }>("/items");
        setItems(data.data);
      } catch (err) {
        setError("❌ Failed to load items");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  // 👤 Sync Clerk user
  useEffect(() => {
    if (!isLoaded || !user) return;

    const userData = {
      id: user.id,
      email: user.emailAddresses[0]?.emailAddress,
      firstName: user.firstName,
      lastName: user.lastName,
      imageUrl: user.imageUrl,
      createdAt: user.createdAt,
    };

    const syncUser = async () => {
      try {
        const res = await axiosInstance.post("/clerk-user", userData);
        console.log("✅ User synced:", res.data);
      } catch (err: any) {
        console.error("❌ User sync failed:", err.message);
      }
    };

    syncUser();
  }, [isLoaded, user]);

  // 🧠 Category options
  const categories = useMemo(() => ["All", ...new Set(items.map((i) => i.category))], [items]);

  // 🔍 Filtered items
  const filteredFeeds = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        item.itemName.toLowerCase().includes(search.toLowerCase()) ||
        item.place.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === "All" || item.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [items, search, category]);

  const totalPages = Math.ceil(filteredFeeds.length / ITEMS_PER_PAGE);
  const paginatedFeeds = filteredFeeds.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <main className="min-h-screen bg-purple-300">
      {/* <Navbar /> */}

      <div className="max-w-screen-xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-indigo-800">Recent Found Items</h1>

        {/* 🔍 Search & Category Filter */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by item name or place..."
            className="w-full sm:w-1/2 p-2 rounded-md text-black border-4 outline-none border-indigo-800"
          />
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full sm:w-1/3 p-2 rounded-md text-black border-4 border-indigo-800"
            title="filter"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* ⏳ Loader or Error */}
        {loading && <p className="text-center text-xl text-gray-700">Loading items...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {/* 🧾 Item Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-black">
          {!loading &&
            paginatedFeeds.map((item) => (
              <Link href={`/item/${item._id}`} key={item._id}>
                <FeedCard
                  itemName={item.itemName}
                  category={item.category}
                  place={item.place}
                  datetime={item.datetime}
                  photoUrl={item.photoUrl}
                  type={item.type}
                />
              </Link>
            ))}
        </div>

        {/* 📄 Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </main>
  );
}
