"use client";
import ProductListView from "@/components/ProductListView";
import { useAuthGuard } from "@/hooks/useAuthGuard";

export default function Page() {
  // 인증된 사용자만 접근 할 수 있는 가드 설정
  useAuthGuard();
  return <ProductListView />;
}
