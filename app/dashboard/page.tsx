"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Cookies from 'js-cookie';

const Dashboard: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('token');

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

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        Cookies.remove('token');
        router.replace('/login');
      } else {
        console.error('Failed to logout', await res.json());
      }
    } catch (error) {
      console.log('Error during logout', error);
    }
  }
  return (
    <>
      <h1>Protected Content</h1>
      <button
        onClick={handleLogout}
        className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
      >Logout</button>
    </>
  )
}

export default Dashboard;
