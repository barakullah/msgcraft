"use client";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Cookies from "cookies-js";
export default function AddInstanceForm() {
  const [name, setName] = useState("");
  const router = useRouter();
  type MyError = {
    message: string;
    code?: number;
  };
  const mutation = useMutation<{ clientId: number }, MyError, { name: string }>({
    mutationFn: async (data) => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/clients`, {
        method: "POST",
        
        headers: { Authorization: `Bearer ${Cookies.get("token")}`, "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return res.json();
    },
    onSuccess: (data) => {
      // Redirect to QR screen (or client dashboard)
      router.push(`/instances/${data.clientId}/qr`);
    },
  });

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-2xl dark:bg-gray-800">
      <h2 className="text-2xl font-semibold mb-4">Add New Instance</h2>

      <input
        type="text"
        placeholder="Enter instance name"
        className="w-full p-3 rounded-md border dark:bg-gray-900 dark:text-white"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <button
        onClick={() => mutation.mutate({name})}
        disabled={!name || mutation.isPending}
        className="mt-4 bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700 disabled:opacity-50"
      >
        {mutation.isPending ? "Adding..." : "Add Instance"}
      </button>

      {mutation.error && (
        <p className="text-red-500 mt-2">Something went wrong. Try again.</p>
      )}
    </div>
  );
}
