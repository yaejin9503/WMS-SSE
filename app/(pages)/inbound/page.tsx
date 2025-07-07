"use client";
import ProductInbound from "@/components/ProductInbound";
import { useAuthGuard } from "@/hooks/useAuthGuard";

export default function InboundPage() {
  // 인증된 사용자만 접근 할 수 있는 가드 설정
  useAuthGuard();
  return <ProductInbound />;
}
