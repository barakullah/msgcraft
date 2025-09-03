'use client'
import Cookies from "cookies-js";

type MessageStats = {
  sent: number;
  queued: number;
  failed: number;
};
type InstanceStatsProps = {
  id: number;
  stats: MessageStats;
};
export default function InstanceStats({id,stats}:InstanceStatsProps) {

  const handleResendQueued = async () => {
    // const token = Cookies.get("token");
  
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/messages/${id}/resend-queued`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }
    );
  
    const data = await res.json();
    alert(data.message || "Resend triggered");
  };
  const handleClearQueued = async () => {
  
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/messages/${id}/clear-queue`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }
    );
  
    const data = await res.json();
    alert(data.message || "Queued messages cleared");
  };

  return (
    <>
    <div className="grid grid-cols-3 gap-4">
      <div className="bg-blue-50 dark:bg-blue-900 text-center p-4 rounded-xl">
        <p className="text-2xl font-bold text-blue-600 dark:text-blue-300">{stats.sent}</p>
        <p className="text-sm text-gray-600 dark:text-gray-300">Sent</p>
      </div>
      <div className="bg-yellow-50 dark:bg-yellow-900 text-center p-4 rounded-xl">
        <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-300">{stats.queued}</p>
        <p className="text-sm text-gray-600 dark:text-gray-300">Queued</p>
      </div>
      <div className="bg-red-50 dark:bg-red-900 text-center p-4 rounded-xl">
        <p className="text-2xl font-bold text-red-600 dark:text-red-300">{stats.failed}</p>
        <p className="text-sm text-gray-600 dark:text-gray-300">Failed</p>
      </div>
    </div>
    <div className="flex justify-end gap-4 pt-4">
    <button
      onClick={handleResendQueued}
      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm shadow transition"
    >
      🔁 Retry Queued
    </button>
    <button
      onClick={handleClearQueued}
      className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg text-sm shadow transition"
    >
      🧹 Clear Queue
    </button>
  </div>
  </>
  )
}
