"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import axiosInstance from "@/lib/axios";

interface Claim {
  _id: string;
  answer: string;
  status: "Pending" | "Approved" | "Rejected";
  claimedBy: {
    name: string;
    email: string;
    phone?: string;
    userId?: string;
  };
}

export default function ClaimsPage() {
  const { id } = useParams<{ id: string }>();
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null); // for disabling buttons

  useEffect(() => {
    async function fetchClaims() {
      setLoading(true);
      setError("");
      try {
        const res = await axiosInstance.get(`/items/${id}/claims`);
        setClaims(res.data.data);
      } catch (err: any) {
        setError("Failed to load claims");
        toast.error("Error loading claims.");
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchClaims();
  }, [id]);

  const handleAction = async (claimId: string, action: "approve" | "reject") => {
    try {
      setUpdatingId(claimId);
      await axiosInstance.patch(`/items/claims/${claimId}`, { action });
      setClaims((prev) =>
        prev.map((c) =>
          c._id === claimId
            ? { ...c, status: action === "approve" ? "Approved" : "Rejected" }
            : c
        )
      );
      toast.success(`Claim ${action === "approve" ? "approved" : "rejected"}!`);
    } catch (err) {
      toast.error("Failed to update claim status.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-6 bg-purple-300">
      <div className="max-w-3xl mx-auto bg-zinc-800 rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6 text-white">Claims for This Item</h1>

        {loading ? (
          <div className="flex justify-center text-gray-300">Loading claims...</div>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : claims.length === 0 ? (
          <p className="text-gray-400">No claims have been submitted yet.</p>
        ) : (
          <div className="space-y-4">
            {claims.map((claim) => (
              <div
                key={claim._id}
                className="border border-gray-300 p-4 rounded-lg bg-white text-black"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 gap-2">
                  <div>
                    <p><strong>Name:</strong> {claim.claimedBy?.name}</p>
                    <p><strong>Email:</strong> {claim.claimedBy?.email}</p>
                    {claim.claimedBy?.phone && (
                      <p><strong>Phone:</strong> {claim.claimedBy.phone}</p>
                    )}
                  </div>
                  <span
                    className={`px-3 py-1 rounded text-xs font-semibold ${
                      claim.status === "Approved"
                        ? "bg-green-200 text-green-800"
                        : claim.status === "Rejected"
                        ? "bg-red-200 text-red-800"
                        : "bg-yellow-200 text-yellow-800"
                    }`}
                  >
                    {claim.status}
                  </span>
                </div>

                <p className="mb-3"><strong>Answer:</strong> {claim.answer}</p>

                {claim.status === "Pending" && (
                  <div className="flex gap-3">
                    <button
                      className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 transition"
                      disabled={updatingId === claim._id}
                      onClick={() => handleAction(claim._id, "approve")}
                    >
                      Approve
                    </button>
                    <button
                      className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700 transition"
                      disabled={updatingId === claim._id}
                      onClick={() => handleAction(claim._id, "reject")}
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
