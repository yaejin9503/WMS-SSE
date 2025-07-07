"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export function useAuthGuard() {
  const router = useRouter();
  const supabase = createClientComponentClient(); // auth-helpers client

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.replace("/login");
      }
    };

    checkSession();
  }, [router, supabase]);
}
