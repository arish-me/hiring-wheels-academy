import { SignUpForm } from "@/components/auth/sign-up-form";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-8 space-y-6 bg-card text-card-foreground rounded-lg shadow-md border">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Sign Up</h1>
          <p className="text-muted-foreground">Create your account to start learning</p>
        </div>
        <SignUpForm />
        <div className="text-center text-sm text-muted-foreground">
          Already have an account? <Link href="/signin" className="text-primary hover:underline">Sign in</Link>
        </div>
      </div>
    </div>
  );
} 