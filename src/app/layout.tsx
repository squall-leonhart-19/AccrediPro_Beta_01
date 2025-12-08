import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AccrediPro Academy - Professional Certifications & Mini-Diplomas",
  description: "Transform your career with AccrediPro Academy. Professional certifications and mini-diplomas in Functional Medicine designed for career advancement.",
  icons: {
    icon: "https://coach.accredipro.academy/wp-content/uploads/2025/10/Senza-titolo-Logo-1.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
