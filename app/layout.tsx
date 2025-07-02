import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "WMS-SSE 물류 관리 시스템",
  description: "땅구리 물류 관리 시스템",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {" "}
        <div className="min-h-screen flex flex-col bg-white">
          {/* 헤더 */}
          <header className="bg-white shadow p-4">
            <div className="container mx-auto flex justify-between items-center">
              <Link href="/">
                <h1 className="text-xl font-bold">
                  📦 땅구리 물류 관리 시스템
                </h1>
              </Link>
              <nav className="space-x-4">
                <Link
                  href="/inbound"
                  className="text-gray-600 hover:text-black"
                >
                  입고
                </Link>
                <Link
                  href="/outbound"
                  className="text-gray-600 hover:text-black"
                >
                  출고
                </Link>
                <Link href="/list" className="text-gray-600 hover:text-black">
                  상품 리스트
                </Link>
                <Link href="/track" className="text-gray-600 hover:text-black">
                  추적
                </Link>
              </nav>
            </div>
          </header>

          {/* 본문 */}
          <main className="container mx-auto flex-1 w-full p-4">
            {children}
          </main>

          {/* 푸터 */}
          <footer className="bg-gray-100 text-center p-2 text-sm text-gray-500">
            © 2025 물류 관리 시스템 made by 예구
          </footer>
        </div>
      </body>
    </html>
  );
}
