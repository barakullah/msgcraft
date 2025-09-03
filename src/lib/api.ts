import Cookies from "cookies-js";
const token=Cookies.get("token")
export async function getSubscriptionStatus(clientId: string, token: string) {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/clients/${clientId}/subscription_status`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!res.ok) throw new Error("Failed to fetch subscription status");
    return res.json();
  }
  
  export async function createCheckoutSession(
    instanceId: string,
    token: string
  ) {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/billing/create-subscription`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          instanceId,
        }),
      }
    );
  
    if (!res.ok) {
      throw new Error("Failed to make subscription");
    }
  
    return res.json();
  }
  
  //fetch secret to save payment method

  export async function getSetupIntent(name:string,email:string,customerId:string,userId:number) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/billing/create-customer`, {
      method: "POST",
      body: JSON.stringify({
        name,
        email,
        customerId,
        userId
      }), // send customerId if you already have one saved in DB
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });
    return res.json();
  }

  export async function savePaymentMethod(paymentMethodId:string,customerId:string,userId:number) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/billing/save-payment-method`, {
      method: "POST",
      body: JSON.stringify({
        paymentMethodId,
        customerId,
        userId
      }), // send customerId if you already have one saved in DB
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });
    return res.json();
  }
  