"use client";

import { createCheckoutSession } from "@/lib/api";
import { useState } from "react";
import Cookies from "cookies-js";
import { createPortal } from "react-dom";

interface InstanceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InstanceModal({ isOpen, onClose }: InstanceModalProps) {
  const [quantity, setQuantity] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  if (!isOpen) return null; // hide when closed

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(parseInt(e.target.value, 10) || 0);
  };


  const handlePayments = async () => {
    setLoading(true)
      await createCheckoutSession(undefined,Cookies.get("token"),quantity)
    setLoading(false)

  };
  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Instance Manager
        </h2>

        {/* Quantity Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Enter Quantity
          </label>
          <input
            type="number"
            value={quantity}
            onChange={handleQuantityChange}
            className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500"
            min={0}
          />
        </div>

        {/* Summary */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Total Instances:</span>
            <span className="font-medium">{quantity}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Active Instances:</span>
            <span className="font-medium text-green-600">{1}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Inactive Instances:</span>
            <span className="font-medium text-red-600">
              {quantity > 0 ? quantity - 1 : 0}
            </span>
          </div>
        </div>
        <button
        onClick={handlePayments}
        disabled={loading }
        className="w-full px-4 py-2 bg-brand-500 text-white rounded hover:bg-brand-600 disabled:opacity-50"
      >
        {loading ? "Paying..." : "Pay"}
      </button>
      </div>
     
    </div>,document.body
  );
}
