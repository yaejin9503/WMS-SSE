/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";

interface ProductItem {
  name: string;
  barcode: string;
  manufactureDate: string;
  arrivalDate: string;
  supplier: string;
  shipmentDate?: string;
  customer?: string;
  confirmed: boolean;
}

type SortKey = keyof ProductItem;

export default function ProductListView() {
  const [allChecked, setAllChecked] = useState(false);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [showConfirmed, setShowConfirmed] = useState(true);
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortAsc, setSortAsc] = useState(true);
  const [loading, setLoading] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [showConfirmed]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/products/list?confirmed=${showConfirmed}`);
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "데이터 조회 실패");
      }
      const data = await res.json();
      setProducts(data);
    } catch (err: any) {
      alert(`에러: ${err.message}`);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const sortedProducts = [...products].sort((a, b) => {
    const valA = a[sortKey] ?? "";
    const valB = b[sortKey] ?? "";
    if (valA < valB) return sortAsc ? -1 : 1;
    if (valA > valB) return sortAsc ? 1 : -1;
    return 0;
  });

  const handleChangeConfirmed = async (barcode: string) => {
    if (!barcode) return;

    const product = products.find((p) => p.barcode === barcode);
    if (!product) {
      alert("제품을 찾을 수 없습니다.");
      return;
    }

    const newConfirmed = !product.confirmed;

    setProducts((prev) => {
      const updated = prev.map((item) =>
        item.barcode === barcode ? { ...item, confirmed: newConfirmed } : item
      );

      const allConfirmed = updated.every((p) => p.confirmed);
      setAllChecked(allConfirmed);

      return updated;
    });
  };

  const handleBulkUpdate = async () => {
    const updateItems = products
      .filter((p) => p.confirmed) // 또는 원하는 조건
      .map((p) => ({
        barcode: p.barcode,
        confirmed: true,
      }));

    if (updateItems.length === 0) {
      alert("업데이트할 제품이 없습니다.");
      return;
    }

    setConfirmLoading(true);
    try {
      const res = await fetch("/api/shipments/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: updateItems }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "출고 확정 업데이트 실패");
      }

      alert("출고 확정 상태 업데이트 성공!");
      fetchProducts();
    } catch (err: any) {
      alert(`에러: ${err.message}`);
    } finally {
      setConfirmLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-4 flex justify-center">
      <div className="w-full max-w-6xl">
        <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">
          제품 리스트
        </h1>

        <div className="flex justify-center mb-4 text-sm">
          <button
            onClick={() => setShowConfirmed(true)}
            className={`px-3 py-1 rounded-l-lg ${
              showConfirmed
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            출고 확정 리스트
          </button>
          <button
            onClick={() => setShowConfirmed(false)}
            className={`px-3 py-1 rounded-r-lg ${
              !showConfirmed
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            출고 미확정 리스트
          </button>
        </div>
        <div className="flex justify-end mb-4">
          <button
            className="px-4 bg-blue-500 text-white rounded-sm py-1 text-sm cursor-pointer hover:bg-blue-600 transition disabled:opacity-50"
            disabled={confirmLoading}
            onClick={handleBulkUpdate}
          >
            {confirmLoading ? "출고 확정 중..." : "출고 확정"}
          </button>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">데이터 로딩 중...</p>
        ) : (
          <div className="overflow-auto rounded-lg shadow">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-100 text-gray-700 text-sm">
                <tr>
                  {[
                    { key: "first", label: "" },
                    { key: "name", label: "제품명" },
                    { key: "barcode", label: "바코드" },
                    { key: "arrivalDate", label: "입고 일자" },
                    { key: "supplier", label: "구매 거래처" },
                    { key: "shipmentDate", label: "출고 일자" },
                    { key: "customer", label: "출고 거래처" },
                  ].map((col) => (
                    <th
                      key={col.key}
                      className="py-2 px-3 text-center cursor-pointer hover:bg-gray-200"
                      onClick={() => handleSort(col.key as SortKey)}
                    >
                      {col.label}{" "}
                      {col.key !== "first" && sortKey === col.key && (
                        <span>{sortAsc ? "▲" : "▼"}</span>
                      )}
                      {col.key === "first" && (
                        <input
                          type="checkbox"
                          checked={allChecked}
                          onChange={() => {
                            setAllChecked(!allChecked);
                            setProducts((prev) =>
                              prev.map((item) => ({
                                ...item,
                                confirmed: !allChecked,
                              }))
                            );
                          }}
                          className="ml-2 cursor-pointer"
                        />
                      )}
                    </th>
                  ))}
                  <th className="py-2 px-3 text-center">출고 확정 여부</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-700">
                {sortedProducts.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-4 text-center text-gray-400">
                      데이터가 없습니다.
                    </td>
                  </tr>
                ) : (
                  sortedProducts.map((item) => (
                    <tr key={item.barcode} className="border-b text-center">
                      <td className="py-2 px-3">
                        {" "}
                        <input
                          type="checkbox"
                          checked={item.confirmed}
                          onChange={() => handleChangeConfirmed(item.barcode)}
                          className="ml-2 cursor-pointer"
                        />
                      </td>
                      <td className="py-2 px-3">{item.name}</td>
                      <td className="py-2 px-3">{item.barcode}</td>
                      <td className="py-2 px-3">{item.arrivalDate}</td>
                      <td className="py-2 px-3">{item.supplier}</td>
                      <td className="py-2 px-3">
                        {item.shipmentDate ?? "미출고"}
                      </td>
                      <td className="py-2 px-3">{item.customer ?? "미출고"}</td>
                      <td className="py-2 px-3">
                        {item.confirmed ? (
                          <span className="text-green-600">확정</span>
                        ) : (
                          <span className="text-red-500">미확정</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
