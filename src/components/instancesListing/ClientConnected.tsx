// app/clients/[id]/QRScanned.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

type ClientStatusResponse = {
  success: boolean;
  message: string;
  status: 'connected' | 'pending' | 'disconnected';
  clientId: string;
};

export default function ClientConnected() {
  const router = useRouter();
  const params = useParams();
  const clientId = params.id as string;

  const { data, isLoading, isError } = useQuery<ClientStatusResponse>({
    queryKey: ['client-status', clientId],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/clients/${clientId}/status`);
      if (!res.ok) throw new Error('Failed to fetch client status');
      return res.json();
    },
    refetchInterval: 60000, // Keep checking connection status every 1 minute
  });

  if (isLoading) {
    return <p className="text-center text-gray-400">Checking connection status...</p>;
  }

  if (isError || !data) {
    return <p className="text-center text-red-500">Failed to fetch client status</p>;
  }



  return (
    <div className="flex flex-col items-center justify-center p-10 rounded-xl bg-green-100 dark:bg-green-900 shadow-md">
      <h2 className="text-2xl font-bold text-green-700 dark:text-green-200 mb-4">✅ Client Connected!</h2>
      <p className="text-green-800 dark:text-green-300 mb-2">
        Client <strong>{clientId}</strong> has successfully connected to WhatsApp.
      </p>
      <button
        onClick={() => router.push('/instances')}
        className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
      >
        Go to Instances
      </button>
    </div>
    
  );
}
