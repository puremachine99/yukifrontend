"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import { Spinner } from "@/components/ui/spinner";
import { useAuthSession } from "@/hooks/use-auth-session";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, initialized } = useAuthSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!initialized) return;

    if (!isAuthenticated) {
      const fromParam = encodeURIComponent(pathname);
      router.replace(`/login?from=${fromParam}`);
    }
  }, [initialized, isAuthenticated, pathname, router]);

  if (!initialized) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner className="size-8" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
