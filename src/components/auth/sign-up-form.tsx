"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const Button = (props: React.ComponentProps<"button">) => <button {...props} className="w-full bg-primary text-primary-foreground py-2 rounded-lg hover:bg-primary/90" />;
const Input = (props: React.ComponentProps<"input">) => <input {...props} className="w-full px-3 py-2 border rounded-lg" />;

function getPasswordStrength(password: string) {
  if (password.length < 8) return "Too short";
  if (password.length < 12) return "Weak";
  if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) return "Medium";
  return "Strong";
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function SignUpForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({ name: false, email: false, password: false });

  const passwordStrength = getPasswordStrength(password);
  const emailValid = isValidEmail(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setTouched({ name: true, email: true, password: true });
    if (!name || !emailValid || password.length < 8) {
      setError("Please fix the errors above.");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    setLoading(false);
    if (res.ok) {
      router.push("/signin");
    } else {
      const data = await res.json();
      setError(data.error || "Registration failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
        <Input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, name: true }))}
          required
        />
        {touched.name && !name && <p className="text-xs text-red-500 mt-1">Name is required</p>}
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, email: true }))}
          required
        />
        {touched.email && !emailValid && <p className="text-xs text-red-500 mt-1">Enter a valid email address</p>}
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, password: true }))}
          required
        />
        {touched.password && password.length < 8 && <p className="text-xs text-red-500 mt-1">Password must be at least 8 characters</p>}
        {password && (
          <div className="mt-1 text-xs">
            <span className={
              passwordStrength === "Strong"
                ? "text-green-600"
                : passwordStrength === "Medium"
                ? "text-yellow-600"
                : "text-red-500"
            }>
              Strength: {passwordStrength}
            </span>
          </div>
        )}
      </div>
      <Button type="submit" disabled={loading}>{loading ? "Registering..." : "Sign Up"}</Button>
    </form>
  );
} 