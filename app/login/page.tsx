// app/login/page.tsx
'use client';

import { signIn } from "next-auth/react";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (res?.error) {
      setError(res.error);
    } else {
      router.push("/account");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: "url('/background.jpg')" }}>
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-sm">
        {/* Header */}
        <header className="flex items-center justify-between mb-4">
          <Link href="/" className="text-[#FF6B35] flex items-center gap-2 text-sm font-medium">
            <ArrowLeft className="h-4 w-4" /> TERUG
          </Link>
          <div className="relative w-32 h-12">
            <Image src="/logo.svg" alt="XL Groothandel" fill className="object-contain" />
          </div>
        </header>
        {/* Formulier */}
        <h1 className="text-2xl font-bold text-center mb-6">INLOGGEN</h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="email">E-mailadres</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Wachtwoord</Label>
            <div className="relative">
              <Input id="password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button type="submit" className="w-full bg-[#C1A770] hover:bg-[#A08C5B] text-white">INLOGGEN</Button>
        </form>
        <div className="mt-4 text-center">
          <Link href="/forgot-password" className="text-sm text-[#C1A770] hover:underline">Wachtwoord vergeten?</Link>
        </div>
        <div className="mt-8 bg-gray-50 rounded-lg p-4 text-center">
          <h2 className="font-bold mb-2">NIEUW BIJ XL GROOTHANDEL?</h2>
          <Link href="/register" className="text-[#FF6B35] hover:underline">Maak een account aan</Link>
        </div>
      </div>
    </div>
  );
}
