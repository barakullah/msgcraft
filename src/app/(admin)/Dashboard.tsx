"use client";

import { useQuery } from "@tanstack/react-query";
import Cookies from "cookies-js";
import { useState } from "react";

export default function Dashboard() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["clients-dashboard"],
    refetchOnWindowFocus: true,
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/Allclients`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch clients");
      }

      return res.json();
    },
  });

  if (isLoading) return <div className="p-4">Loading Instances...</div>;
  if (isError) return <div className="p-4 text-red-500">Error loading Instances.</div>;

  const activeInstances = data.filter(
    (i: { id: string; name: string; apiToken: string; instance_status: string }) =>
      i.instance_status === "active"
  );
  const inactiveInstances = data.filter(
    (i: { id: string; name: string; apiToken: string; instance_status: string }) =>
      i.instance_status !== "active"
  );

  return (
    <div className="p-6 space-y-10">
      {/* Active Instances */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">✅ Active Instances</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeInstances.map((inst: { id: number; name: string }) => (
            <InstanceCard key={inst.id} instance={inst} active />
          ))}
        </div>
      </section>

      {/* Inactive Instances */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">⚪ Inactive Instances</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {inactiveInstances.map(
            (inst: { id: number; name: string; instance_status: string }) => (
              <InstanceCard key={inst.id} instance={inst} active={false} />
            )
          )}
        </div>
      </section>
    </div>
  );
}

function InstanceCard({
  instance,
  active,
}: {
  instance: { id: number; name: string; instance_status?: string };
  active: boolean;
}) {
  const [renewal, setRenewal] = useState(true);

  return (
    <div
      className={`border rounded-2xl shadow p-4 flex flex-col ${
        active ? "bg-white" : "bg-gray-50"
      }`}
    >
      <h3 className="text-lg font-bold">{instance.name}</h3>
      <p
        className={`text-sm ${
          active ? "text-green-600" : "text-gray-500"
        }`}
      >
        {active ? "Active" : instance.instance_status === "expired" ? "Expired" : "Not Connected"}
      </p>

      {/* Renewal Switch */}
      {active && (
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Renewal</span>
          <button
            onClick={() => setRenewal(!renewal)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
              renewal ? "bg-green-500" : "bg-gray-300"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                renewal ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      )}

      {/* Connect button for inactive */}
      {!active && (
        <button className="mt-auto bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
          Connect
        </button>
      )}
    </div>
  );
}
