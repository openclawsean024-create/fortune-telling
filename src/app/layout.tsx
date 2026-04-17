import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "全方位算命網站",
  description: "紫微斗數、八字命盤、塔羅占卜、生命靈數、生肖星座分析",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <body className="antialiased">{children}</body>
    </html>
  );
}
