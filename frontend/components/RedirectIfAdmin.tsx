'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

type UserInfo = {
  role?: 'user' | 'admin' | 'super_admin';
  username?: string;
  name?: string;
};

export default function RedirectIfAdmin() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    try {
      const userInfoRaw = localStorage.getItem('userInfo');
      if (!userInfoRaw) return;

      const userInfo = JSON.parse(userInfoRaw) as UserInfo;
      if (!userInfo?.role) return;

      // Only redirect admins, not regular users
      if ((userInfo.role === 'admin' || userInfo.role === 'super_admin') && pathname === '/') {
        // Verify admin token is still valid
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/auth/me`, {
          credentials: 'include',
        })
          .then(res => {
            if (res.ok) {
              router.replace('/dashboard/orders');
            } else {
              // Token not valid, clear localStorage
              localStorage.removeItem('userInfo');
            }
          })
          .catch(() => {
            // Error, clear localStorage
            localStorage.removeItem('userInfo');
          });
      }

      // For regular users, do nothing - let them stay on the page

    } catch {
      // Error parsing, clear localStorage
      localStorage.removeItem('userInfo');
    }
  }, [router, pathname]);

  return null;
}