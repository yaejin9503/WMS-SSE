/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
// import { useAuthGuard } from "@/hooks/useAuthGuard";

interface ScannedProduct {
  id: string;
  barcode: string;
  name: string;
  arrival_date: string;
  supplier: string;
}

export default function ProductOutboundForm() {
  // 인증된 사용자만 접근 할 수 있는 가드 설정
  // useAuthGuard();

  const today = new Date().toISOString().split("T")[0];

  const [barcode, setBarcode] = useState("");
  const [outboundDate, setOutboundDate] = useState(today);
  // const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [customer, setCustomer] = useState("");
  const [loading, setLoading] = useState(false);
  const [scannedProducts, setScannedProducts] = useState<ScannedProduct[]>([]);

  const fetchProduct = async (barcode: string) => {
    if (!barcode) return;

    // 중복 스캔 방지
    const isAlreadyScanned = scannedProducts.some((p) => p.barcode === barcode);
    if (isAlreadyScanned) {
      alert("이미 스캔된 바코드입니다.");
      return;
    }

    try {
      const resProduct = await fetch(
        `/api/products/trace?barcode=${encodeURIComponent(barcode)}`
      );
      if (!resProduct.ok) {
        const err = await resProduct.json();
        throw new Error(err.error || "제품 조회 실패");
      }

      const productData = await resProduct.json();

      if (productData.shipmentDate) {
        alert("이미 출고된 제품입니다.");
        return;
      }

      setScannedProducts((prev) => [
        ...prev,
        {
          id: productData.id,
          barcode,
          name: productData.name || "알 수 없음",
          arrival_date: productData.arrival_date || "미지정",
          supplier: productData.supplier || "미지정",
        },
      ]);
      setQuantity(scannedProducts.length + 1);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const removeScannedProduct = (index: number) => {
    setScannedProducts((prev) => prev.filter((_, i) => i !== index));
    setQuantity(scannedProducts.length - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customer) {
      alert("고객사는 필수입니다.");
      return;
    }

    if (scannedProducts.length === 0) {
      alert("출고할 상품이 없습니다.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        customer,
        outboundDate,
        items: scannedProducts.map((p) => ({
          product_id: p.id,
          quantity: 1, // 각 스캔은 1개 단위
        })),
      };

      const res = await fetch("/api/shipments/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "출고 등록 실패");
      }

      alert("모든 출고 등록 성공!");
      setScannedProducts([]);
      setCustomer("");
      setQuantity(1);
    } catch (err: any) {
      alert(`에러: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setOutboundDate(value);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row items-start justify-center p-4 space-y-4 md:space-y-0 md:space-x-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          출고 등록
        </h1>

        <input
          type="text"
          value={barcode}
          onChange={(e) => setBarcode(e.target.value)}
          placeholder="바코드를 스캔하세요."
          className="w-full rounded-full border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              fetchProduct(barcode);
              setBarcode("");
            }
          }}
        />
        <form
          onSubmit={handleSubmit}
          className="space-y-4 bg-white p-6 rounded-lg shadow-md"
        >
          {/* <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="제품명 *"
            className="w-full rounded-full border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          /> */}

          <input
            type="text"
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
            placeholder="고객사 *"
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
            value={outboundDate}
            className="w-full rounded-full border border-gray-300 px-4 py-2 text-gray-600 focus:ring-blue-400"
            onChange={handleChange}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white rounded-full cursor-pointer py-2 font-semibold hover:bg-blue-600 transition disabled:opacity-50"
          >
            {loading ? "등록 중..." : "출고 등록"}
          </button>
        </form>
      </div>

      <div className="flex-1 w-full max-w-2xl bg-white rounded-lg shadow-md p-4">
        <h2 className="text-lg font-bold mb-2 text-gray-700">
          스캔된 상품 목록
        </h2>
        <table className="w-full table-auto text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-2">바코드</th>
              <th className="py-2 px-2">제품명</th>
              <th className="py-2 px-2">입고일자</th>
              <th className="py-2 px-2">구매거래처</th>
              <th className="py-2 px-2">삭제</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {scannedProducts.map((item, index) => (
                <motion.tr
                  key={`${item.barcode}-${index}`}
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.3 }}
                  className="text-center"
                >
                  <td className="py-1 px-2">{item.barcode}</td>
                  <td className="py-1 px-2">{item.name}</td>
                  <td className="py-1 px-2">{item.arrival_date}</td>
                  <td className="py-1 px-2">{item.supplier}</td>
                  <td className="py-1 px-2">
                    <button
                      onClick={() => removeScannedProduct(index)}
                      className="text-red-500 hover:text-red-700"
                      aria-label="삭제"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 inline"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
            {scannedProducts.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center text-gray-400 py-4">
                  스캔된 상품이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
