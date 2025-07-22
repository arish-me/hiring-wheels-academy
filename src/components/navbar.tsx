"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export function Navbar() {
  const { data: session, status } = useSession();
  const loading = status === "loading";

  return (
    <nav className="w-full bg-background border-b px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <Link href="/" className="font-bold text-xl text-primary">HWA</Link>
        <Link href="/" className="hover:underline">Courses</Link>
        <Link href="/" className="hover:underline">Projects</Link>
      </div>
      <div className="flex items-center gap-4">
        {loading ? null : session?.user ? (
          <>
            <span className="text-sm">Hi, {session.user.name || session.user.email}</span>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="px-4 py-2 rounded bg-muted hover:bg-muted/80 border text-sm"
            >
              Sign Out
            </button>
          </>
        ) : (
          <>
            <Link href="/signin" className="px-4 py-2 rounded bg-primary text-primary-foreground hover:bg-primary/90 text-sm">Sign In</Link>
            <Link href="/signup" className="px-4 py-2 rounded border text-sm">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
} 