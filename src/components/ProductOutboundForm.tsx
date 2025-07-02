/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";

export default function ProductOutboundForm() {
  const today = new Date().toISOString().split("T")[0];

  const [customer, setCustomer] = useState("");
  const [barcode, setBarcode] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customer) {
      alert("고객사는 필수입니다.");
      return;
    }
    if (!barcode) {
      alert("바코드는 필수입니다.");
      return;
    }
    if (quantity < 1) {
      alert("수량은 1 이상이어야 합니다.");
      return;
    }

    setLoading(true);
    try {
      // 1️⃣ 제품 바코드로 제품 정보 조회
      const resProduct = await fetch(
        `/api/products/trace?barcode=${encodeURIComponent(barcode)}`
      );
      if (!resProduct.ok) {
        const err = await resProduct.json();
        throw new Error(err.error || "제품 조회 실패");
      }
      const productData = await resProduct.json();

      if (!productData.id) {
        throw new Error("해당 바코드의 제품이 존재하지 않습니다.");
      }

      // 2️⃣ 출고 등록
      const resShipment = await fetch("/api/shipments/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: productData.id,
          quantity,
          customer,
        }),
      });

      if (!resShipment.ok) {
        const err = await resShipment.json();
        throw new Error(err.error || "출고 등록 실패");
      }

      alert("출고 등록 성공!");
      // 폼 초기화
      setCustomer("");
      setBarcode("");
      setQuantity(1);
    } catch (err: any) {
      alert(`에러: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          출고 등록
        </h1>
        <form
          onSubmit={handleSubmit}
          className="space-y-4 bg-white p-6 rounded-lg shadow-md"
        >
          <input
            type="text"
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
            placeholder="고객사 *"
            className="w-full rounded-full border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="text"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            placeholder="제품명 또는 바코드 *"
            className="w-full rounded-full border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) =>
              setQuantity(Math.max(1, parseInt(e.target.value) || 1))
            }
            placeholder="수량 *"
            className="w-full rounded-full border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="date"
            value={today}
            readOnly
            className="w-full rounded-full border border-gray-300 px-4 py-2 bg-gray-100 text-gray-600 cursor-not-allowed"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white rounded-full py-2 font-semibold hover:bg-blue-600 transition disabled:opacity-50"
          >
            {loading ? "등록 중..." : "출고 등록"}
          </button>
        </form>
      </div>
    </div>
  );
}
