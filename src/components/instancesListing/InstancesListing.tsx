'use client'

import { getSetupIntent } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { Check, Copy, Eye } from "lucide-react";
import Link from 'next/link';
import { useState,useEffect } from 'react';
import SaveCardForm from '../auth/payments/AddCard';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import Cookies from "cookies-js";
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);
export default function ClientsPage() {

  const [copiedIndex, setCopiedIndex] = useState<string|null>();
  const [clientSecret, setClientSecret] = useState<string>();
  let customerId=localStorage.getItem("customerId")
  customerId=(customerId===null|| customerId==="null")?"":customerId
  const name=localStorage.getItem("name")??"";
  const email=localStorage.getItem("email")??"";
  const userId=localStorage.getItem("userId")??"";
  
  const copyToClipboard = async (text:string, index:string) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000); // reset after 2s
  };
  const { data, isLoading, isError } = useQuery({
    queryKey: ['clients'],
    refetchOnWindowFocus: false,
    queryFn: () => fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/Allclients`, {
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
      }},).then(res => res.json()),
  })
  useEffect(()=>{const fetchData=async ()=>{
const data=await getSetupIntent(name,email,customerId,parseInt(userId));
setClientSecret(data.clientSecret)
localStorage.setItem("customerId",data.customerId)
  }
fetchData();
},[])



  if (isLoading) return <div className="p-4">Loading Instances...</div>
  if (isError) return <div className="p-4 text-red-500">Error loading Instances.</div>

  return (
    <div className="p-6">
       <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Save Your Card</h1>
      {clientSecret && stripePromise && (
  <Elements stripe={stripePromise} >
    <SaveCardForm clientSecret={clientSecret}/>
  </Elements>
)}
    </div>
      <h1 className="text-2xl font-bold mb-4">All Instances</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((client: { id: string ; name: string ;apiToken: string ; status: string  }) => (
          <div
            key={client.id}
            // onClick={()=>router.push(`/instances/${client.id}/qr`)}
            className="bg-white p-4 rounded-xl shadow hover:shadow-md transition cursor-pointer"
          >
            <div className='flex items-center justify-between'>
            <h2 className="text-lg font-semibold">{client.name}</h2>
            <Link
          href={`/instances/${client.id}/qr`}
          className="p-1 rounded hover:bg-gray-200 transition flex flex-end"
        >
          <Eye className="w-4 h-4 text-blue-600" />
        </Link>
        </div>
            <p className="text-gray-500">Client ID: {client.id}</p>
            {/* <p className="text-gray-500">Token: {client.clientId}</p> */}
            <div className="flex items-center gap-2">
      <span className="text-gray-500">Token: {client.apiToken}</span>
      <button
        onClick={()=>copyToClipboard(client.apiToken,client.id)}
        className="p-2 rounded-full hover:bg-gray-200 transition"
      >
        {copiedIndex === client.id ? (
          <Check className="w-5 h-5 text-green-600" />
        ) : (
          <Copy className="w-5 h-5 text-gray-600" />
        )}
      </button>
    </div>


            <div className="mt-2">
              <span
                className={`inline-block px-2 py-1 rounded-full text-sm ${
                  client.status === 'connected'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}
              >
                {client.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
