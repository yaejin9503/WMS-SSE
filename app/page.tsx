"use client";
import { useAuthGuard } from "@/hooks/useAuthGuard";

export default function Home() {
  // 인증된 사용자만 접근 할 수 있는 가드 설정
  useAuthGuard();

  return (
    <div className="text-center flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-4xl mb-2">🚛</h1>
      <h2 className="text-2xl font-semibold mb-4">입고 / 출고 / 추적 관리</h2>
      <p className="text-gray-600">제품의 입출고 이력을 쉽게 관리하세요.</p>
    </div>
  );
}
