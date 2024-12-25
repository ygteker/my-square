"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Cookies from 'js-cookie';

const Dashboard: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('token');
    console.log("TOKEN", token)

    if (!token) {
      router.replace('/login');
    }

    const validateToken = async () => {
      try {
        const res = await fetch('/api/auth/validate', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!res.ok) {
          throw new Error('Token validation failed');
        }
      } catch (error) {
        console.error(error);
        router.replace('/login');
      }
    }

    validateToken();
  }, [router]);

  return <div>Protected content</div>;
}

export default Dashboard;
