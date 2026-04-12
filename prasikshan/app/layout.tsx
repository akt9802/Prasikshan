import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Layout from "@/components/header/Layout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Prasikshan - Ultimate SSB Exam Preparation Platform",
  description: "Your trusted platform for SSB interview preparation. Practice OIR tests, psychological tests, and improve your chances of CDS, NDA, and AFCAT selection with Prasikshan.",
  keywords: ["Prasikshan", "Prashikshan", "SSB", "SSB interview", "CDS", "NDA", "AFCAT", "OIR Test", "SSB Preparation", "Mock Tests", "Defence Exams"],
  openGraph: {
    title: "Prasikshan - SSB Exam Preparation Platform",
    description: "Join Prasikshan for expert SSB interview preparation. Practice mock tests and improve your skills with AI-powered insights.",
    url: "https://www.prasikshan.akt9802.in/",
    siteName: "Prasikshan",
    images: [
      {
        url: "https://www.prasikshan.akt9802.in/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Prasikshan Display Banner",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  metadataBase: new URL("https://www.prasikshan.akt9802.in/"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
