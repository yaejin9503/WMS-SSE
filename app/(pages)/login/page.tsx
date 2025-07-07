"use client";
import { useState } from "react";

import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const supabase = createClientComponentClient();

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(`로그인 실패: ${error.message}`);
    } else {
      router.replace("/");
    }
  };
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4">
      <div className="max-w-sm w-full bg-white shadow p-6 rounded">
        <h1 className="text-xl font-bold mb-4">로그인</h1>
        <input
          type="email"
          placeholder="이메일"
          className="w-full border px-3 py-2 rounded mb-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="비밀번호"
          className="w-full border px-3 py-2 rounded mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="w-full bg-blue-500 text-white py-2 rounded cursor-pointer hover:bg-blue-600"
          onClick={handleLogin}
        >
          로그인
        </button>
      </div>
    </div>
  );
}
