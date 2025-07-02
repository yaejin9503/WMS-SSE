export async function clientRegisterProduct(product: {
  name: string;
  barcode: string;
  arrival_date: string;
  supplier: string;
}) {
  const res = await fetch("/api/products/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });

  if (!res.ok) {
    console.log("res", res);
    const error = await res.json();
    throw new Error(error.error || "제품 등록 실패");
  }

  return res.json();
}

export async function clientRegisterShipment(shipment: {
  product_id: string;
  quantity: number;
  customer: string;
}) {
  const res = await fetch("/api/shipments/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(shipment),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "출고 등록 실패");
  }

  return res.json();
}

export async function clientTraceProduct(barcode: string) {
  const url = `/api/products/trace?barcode=${encodeURIComponent(barcode)}`;
  const res = await fetch(url);

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "제품 추적 실패");
  }

  return res.json();
}
