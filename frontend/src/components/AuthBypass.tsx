"use client";

import { useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

export function AuthBypass() {
  const supabase = createClient();

  useEffect(() => {
    const silentLogin = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        // Create a random guest account to satisfy DB Foreign Keys
        const guestEmail = `guest_${Date.now()}@visionquery.com`;
        await supabase.auth.signUp({
          email: guestEmail,
          password: "guestpassword123"
        });
        console.log("Silently logged in as guest!");
      }
    };
    silentLogin();
  }, [supabase.auth]);

  return null; // Hidden component
}
