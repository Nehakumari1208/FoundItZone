'use client';

import { useParams } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { toast } from 'react-toastify';

interface Item {
  _id: string;
  itemName: string;
  category: string;
  description: string;
  place: string;
  datetime: string;
  photoUrl?: string;
  foundBy: string;
  name: string;
  email: string;
  phone?: string;
  notes?: string;
  hintQuestion?: string;
}

export default function ItemPage() {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [answer, setAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user } = useUser();

  useEffect(() => {
    async function fetchItem() {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/items/${id}`
        );
        console.log("dd",res.data.data)
        setItem(res.data.data);
      } catch (err) {
        console.error('Error fetching item:', err);
        setItem(null);
        toast.error('Failed to load item');
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchItem();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error('You must be logged in to submit a claim.');
      return;
    }

    if (!answer.trim()) {
      toast.error('Answer cannot be empty.');
      return;
    }

    try {
      setIsSubmitting(true);
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/items/${id}/claims`,
        {
          answer,
          name: user.fullName || '',
          email: user.primaryEmailAddress?.emailAddress || '',
          phone: user.phoneNumbers?.[0]?.phoneNumber || '',
          userId: user.id,
        }
      );
      setAnswer('');
      toast.success('Claim submitted successfully!');
    } catch (err: any) {
      console.error(err);
      toast.error(
        err?.response?.data?.message || 'Claim submission failed.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-indigo-700 via-purple-600 to-pink-500 text-white text-lg font-semibold">
        Loading...
      </div>
    );

  if (!item)
    return (
      <div className="text-center mt-20 text-lg font-medium text-red-600">
        Item not found.
      </div>
    );

  return (
    <div className="min-h-screen p-4 md:p-6 bg-purple-300 text-white">
      <div className="max-w-3xl mx-auto bg-zinc-800 shadow-md rounded-lg p-6 space-y-6">
        <h1 className="text-3xl font-bold text-white">{item.itemName}</h1>

        {item.photoUrl && (
          <div className="relative w-full h-64 rounded overflow-hidden border border-gray-300">
            <Image
              src={item.photoUrl}
              alt={item.itemName}
              fill
              className="object-contain"
            />
          </div>
        )}

        {/* Item Details */}
        <div className="p-4 bg-gray-50 text-gray-800 rounded shadow-inner space-y-2">
          <p><strong>Category:</strong> {item.category}</p>
          <p><strong>Place:</strong> {item.place}</p>
          <p><strong>Date:</strong> {new Date(item.datetime).toLocaleDateString()}</p>
          <p><strong>Time:</strong> {new Date(item.datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</p>
          <p><strong>Description:</strong> {item.description}</p>
        </div>

        {/* Contact Info */}
        <div className="p-4 bg-gray-50 rounded shadow-inner">
          <h2 className="text-lg font-semibold text-purple-800 mb-2">Contact Info</h2>
          <p className="text-gray-800"><strong>Posted By:</strong> {item.name}</p>
          {item.notes && <p className="text-gray-800"><strong>Notes:</strong> {item.notes}</p>}
        </div>

        {/* Claim Form */}
        <form onSubmit={handleSubmit} className="bg-gray-100 p-4 rounded shadow text-gray-800 space-y-3">
          <h3 className="text-lg font-semibold text-purple-800">Claim This Item</h3>

          {item.hintQuestion && (
            <div>
              <label className="block font-medium mb-1">Answer this question:</label>
              <p className="italic text-gray-700 mb-1">{item.hintQuestion}</p>
            </div>
          )}

          <textarea
            placeholder={item.hintQuestion ? "Your answer" : "Describe the item you lost"}
            className="w-full p-2 border rounded resize-none"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            rows={4}
            required
          />

          <button
            type="submit"
            className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800 transition disabled:opacity-60"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Claim'}
          </button>
        </form>
      </div>
    </div>
  );
}
