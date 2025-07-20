'use client';

import React, { useState, ChangeEvent, FormEvent, useEffect, useRef } from 'react';
import axiosInstance from '@/lib/axios';
import { useUser } from '@clerk/nextjs';
import { toast } from 'react-toastify';
import {useRouter } from 'next/navigation';

type FormDataType = {
  itemName: string;
  category: string;
  foundBy: string;
  email: string;
  name: string;
  phone?: string;
  place: string;
  datetime: string;
  description: string;
  photo: File | null;
  hintQuestion: string;
  hintAnswer?: string;
  notes?: string;
};

export default function FoundForm() {
  const { user } = useUser();
  const router=useRouter()
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [data, setData] = useState<FormDataType>({
    itemName: '',
    category: '',
    foundBy: '',
    email: '',
    name: '',
    phone: '',
    place: '',
    datetime: new Date().toISOString().slice(0, 16),
    description: '',
    photo: null,
    hintQuestion: '',
    hintAnswer: '',
    notes: '',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setData((prev) => ({
        ...prev,
        foundBy: user.id || '',
        email: user.primaryEmailAddress?.emailAddress || '',
        name: user.fullName || '',
      }));
    }
  }, [user]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setData((prev) => ({ ...prev, photo: file }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!data.photo) {
      toast.error('Please upload a photo!');
      return;
    }

    if (data.phone && !/^\d{10,15}$/.test(data.phone)) {
      toast.error('Please enter a valid phone number');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (key === 'photo' && value instanceof File) {
            formData.append(key, value);
          } else {
            formData.append(key, String(value));
          }
        }
      });

      await axiosInstance.post('/items', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Item submitted successfully');
      window.scrollTo({ top: 0, behavior: 'smooth' });

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      setData((prev) => ({
        ...prev,
        itemName: '',
        category: '',
        phone: '',
        place: '',
        datetime: new Date().toISOString().slice(0, 16),
        description: '',
        photo: null,
        hintQuestion: '',
        hintAnswer: '',
        notes: '',
      }));
      router.push('/home');
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Submission failed ❌');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full p-3 rounded-md text-black bg-white border focus:outline-none focus:ring-2 focus:ring-indigo-500';

  return (
    <div className="flex items-start justify-center bg-purple-300 min-h-screen px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl mx-auto mt-5 bg-zinc-800 rounded-2xl shadow-xl p-10 space-y-6 mb-6"
      >
        <h2 className="text-4xl font-bold text-indigo-500 text-center">Found Something?</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input name="itemName" value={data.itemName} onChange={handleChange} placeholder="Item Name" className={inputClass} required />
          <select name="category" value={data.category} onChange={handleChange} className={inputClass} required title="filter">
            <option value="">Select Category</option>
            <option value="Electronics">Electronics</option>
            <option value="ID Card">ID Card</option>
            <option value="Accessories">Accessories</option>
            <option value="Other">Other</option>
          </select>
          <input name="phone" type="tel" value={data.phone} onChange={handleChange} placeholder="Phone Number" className={inputClass} />
          <input name="place" value={data.place} onChange={handleChange} placeholder="Place Found" className={inputClass} required />
          <input name="datetime" type="datetime-local" value={data.datetime} onChange={handleChange} className={inputClass} required title="date"/>
        </div>

        <textarea name="description" value={data.description} onChange={handleChange} placeholder="Item Description" className={`${inputClass} h-28`} required />

        <div>
          <label className="block text-sm font-medium text-white mb-1">Upload Item Photo</label>
          <input
            name="photo"
            type="file"
            onChange={handleFileChange}
            ref={fileInputRef}
            className={`${inputClass} cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700`}
            accept="image/*" 
            required title="upload photo"
          />
          {data.photo && <p className="text-sm mt-1 text-green-400">Selected: {data.photo.name}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <input name="hintQuestion" value={data.hintQuestion} onChange={handleChange} placeholder="Hint Question (e.g., what's inside?)" className={inputClass} required />
          <input name="hintAnswer" value={data.hintAnswer} onChange={handleChange} placeholder="Hint Answer (private)" className={inputClass} />
        </div>

        <textarea name="notes" value={data.notes} onChange={handleChange} placeholder="Additional Notes" className={`${inputClass} h-20`} />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-6 bg-indigo-600 text-white font-bold rounded-full hover:bg-indigo-700 transition duration-200 disabled:opacity-60"
        >
          {loading ? 'Submitting...' : 'Submit Found Item'}
        </button>
      </form>
    </div>
  );
}
