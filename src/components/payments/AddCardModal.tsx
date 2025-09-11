"use client";

import { useEffect, useState } from "react";
import SaveCardForm from "./AddCard";
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { getSetupIntent } from "@/lib/api";
import { createPortal } from "react-dom";
import Cookies from "cookies-js";

interface SaveCardModalProps {
  open: boolean;
  onClose: () => void;
}
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);
export default function SaveCardModal({ open, onClose }: SaveCardModalProps) {
  const [clientSecret, setClientSecret] = useState<string>("");
  const token=Cookies.get("token")
  let customerId=localStorage.getItem("customerId")
  customerId=(customerId===null|| customerId==="null")?"":customerId
  const name=localStorage.getItem("name")??"";
  const email=localStorage.getItem("email")??"";
  const userId=localStorage.getItem("userId")??"";
  // Close modal on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);
  useEffect(()=>{
    const fetchData=async ()=>{
const data=await getSetupIntent(token,name,email,customerId,parseInt(userId));
setClientSecret(data.clientSecret)
localStorage.setItem("customerId",data.customerId)
  }
fetchData();
},[])
  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
    <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold mb-4">💳 Save Payment Method</h2>

        {/* Stripe form */}
        <Elements stripe={stripePromise} >
    <SaveCardForm clientSecret={clientSecret}/>
  </Elements>
      </div>
    </div>,document.body
  );
}
