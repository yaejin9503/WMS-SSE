"use client";
import ProductTraceForm from "@/components/ProductTraceForm";
import { useAuthGuard } from "@/hooks/useAuthGuard";

export default function OutboundPage() {
  // 인증된 사용자만 접근 할 수 있는 가드 설정
  useAuthGuard();
  return <ProductTraceForm />;
}
