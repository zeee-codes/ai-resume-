import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Zero-State AI Resume & Portfolio Builder | ATS-Optimized",
  description: "Generate a perfectly formatted, professional ATS-compliant PDF resume instantly using our interactive AI Recruiter. No sign-ups, no data storage.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-white text-black flex flex-col font-sans">
        {children}
      </body>
    </html>
  );
}

