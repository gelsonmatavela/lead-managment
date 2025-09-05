"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { usePathname } from "../../i18n/navigation";

export default function Home() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (
      pathname === "/pt" ||
      pathname === "/en" ||
      pathname === "/pt/" ||
      pathname === "/en/" ||
      pathname === "/"
    )
      router.push("/auth/login");
  });

  return;
}
