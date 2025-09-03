/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Cookies from "cookies-js";
export default function isAuth(Component: any) {
  return function IsAuth(props: any) {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    function checkAuth() {
      const token = Cookies.get("token")
      if (token ) {
        setIsAuthenticated(true);
        router.push("/");
       
      } else {
        router.push("/signin");
      }
    }

    useEffect(() => {
      checkAuth();
    }, []);

    return isAuthenticated && <Component {...props} />;
  };
}
