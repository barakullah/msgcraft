/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import ClientConnected from "@/components/instancesListing/ClientConnected";
import InstanceStats from "@/components/instancesListing/InstanceStats";
import { createCheckoutSession, getSubscriptionStatus } from "@/lib/api";
import socket from "@/utils/sockets";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { QRCodeCanvas } from 'qrcode.react';
import { useEffect, useState } from "react";
import Cookies from "cookies-js";
// import { Metadata } from "next";
// export const metadata: Metadata = {
//   title: "Instance Details | MsgCraft - Whatsapp Automation Service ",
//   description: "Instance Details| MsgCraft - Whatsapp Automation Service",
//   // other metadata
// };
export default function QRPage() {
  const { id } = useParams();
  const [isConnected,setIsConnected]=useState(false)
  const [loadingPayment, setLoadingPayment] = useState(false);
  const { data:subscribedData, isLoading } = useQuery({
    queryKey: ["subscription-status", id],
    queryFn: () => getSubscriptionStatus(id as string, Cookies.get("token")!),
  });
    // 1. Fetch client status first
    const {
      data: statusData,
      isLoading: isStatusLoading,
      refetch: refetchStatus,
    } = useQuery({
      queryKey: ["client-status", id],
      queryFn: async () => {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/clients/${id}/status`,
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("token")}`,
            }}
        );
        return res.json();
      },
      refetchInterval: 100000, // auto-refresh every 5 minutes
    });

  //fetch client qr code
    const { data, isLoading:isQRLoading } = useQuery({
    queryKey: ["client-qr", id],
    refetchOnWindowFocus: false,
    enabled: !!statusData && statusData.status !== "connected",
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/clients/${id}/qr`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        }},);
      return res.json();
    },
    refetchInterval: 300000, // auto-refresh every 5 minutes
  });

  //fetch clients messages stats

  const {
    data: messageStats,
    isLoading: statsLoading,
  } = useQuery({
    queryKey: ["message-stats", id],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/messages/${id}/message-stats`,   {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      })
      return res.json();
    },
  });
  useEffect(() => {
    socket.on("client_connected", (data) => {
      if (data.clientId === id) {
        // Navigate or update UI
        console.log("✅ Client connected, updating UI...");
        setIsConnected(true)
      }
    });

    return () => {
      socket.off("client_connected");
    };
  }, [id,refetchStatus]);



  if (isStatusLoading || (statusData?.status !== "connected" && isQRLoading)) {
    return <p className="text-center">Loading...</p>;
  }

  if (isConnected || statusData?.status === "connected") {
    return (<>
    <ClientConnected />
     {!statsLoading && messageStats && id && (
    <InstanceStats id={Number(id)} stats={messageStats.data} />
   )}
    </>);
  }
  const handlePayNow = async () => {
    try {
      setLoadingPayment(true);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const data:any = await createCheckoutSession(id as string, Cookies.get("token")!);
      if(data){
        window.location.reload();

      }
      setLoadingPayment(false);

    } catch (err) {
      console.error(err);
      setLoadingPayment(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-10">Loading subscription status...</div>;
  }
  return (
    <> 
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-xl shadow">
    <h1 className="text-2xl font-bold mb-4">Instance #{id}</h1>

    {subscribedData?.active  ? (
      <>
      <div className="p-4 bg-green-50 text-green-700 rounded-lg mb-4">
        ✅ Subscription is active — you can use this instance.
      </div>
       
         {!isConnected?
          (
           <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-2xl dark:bg-gray-800">
            <h2 className="text-2xl font-semibold mb-4">Instance: {data.name}</h2>
      
          
              <div>
                <p className="mb-3">📲 Scan the QR below to connect WhatsApp:</p>
                <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg">
                  <QRCodeCanvas value={data.qr} size={256} />
      
                </pre>
                <p className="text-sm text-gray-500 mt-2">QR refreshes every 5 minutes</p>
              </div>
              {/* Stats */}
       
      
        
          </div>
          )
        :
        <ClientConnected/>
}
         </>
    ) : (
      <div className="p-4 bg-red-50 text-red-700 rounded-lg mb-4">
        ⚠ Subscription inactive — pay $20/month to activate.
      </div>
    )}

    {!subscribedData?.active  && (
      <button
        onClick={handlePayNow}
        disabled={loadingPayment}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {loadingPayment ? "Subscribing..." : "Pay $20 to Activate"}
      </button>
    )}
  </div>

   
 
  </>
  );
}
