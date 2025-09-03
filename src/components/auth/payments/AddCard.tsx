/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { savePaymentMethod } from "@/lib/api";
interface SaveCardFormProps {
    clientSecret: string;
  }
export default function SaveCardForm({clientSecret}:SaveCardFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const userId=localStorage.getItem("userId")??"";

  const handleSaveCard = async () => {
    if (!stripe || !elements) return;

    setLoading(true);
    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setStatus("Card element not found");
      setLoading(false);
      return;
    }

    const { setupIntent, error }:any = await stripe.confirmCardSetup(clientSecret, {
        payment_method: { card: cardElement },
      });
      

    if (error) {
      setStatus(error.message || "Failed to save card ❌");
     
    } else {
      setStatus("Card saved successfully ✅");
      await savePaymentMethod(setupIntent?.payment_method,localStorage.getItem("customerId")??"",parseInt(userId))
      console.log("Saved payment method:", setupIntent?.payment_method);
    }

    setLoading(false);
  };

  return (
    <div className="space-y-4 border rounded-lg p-4 max-w-md mx-auto shadow">
      {/* 👇 Card input field */}
      <div className="p-3 border rounded bg-white">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#32325d",
                "::placeholder": {
                  color: "#a0aec0",
                },
              },
              invalid: {
                color: "#fa755a",
              },
            },
          }}
        />
      </div>

      <button
        onClick={handleSaveCard}
        disabled={loading || !stripe}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Saving..." : "Save Payment Method"}
      </button>

      {status && <p className="text-sm text-gray-700">{status}</p>}
    </div>
  );
}
