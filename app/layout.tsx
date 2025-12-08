import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar/navbar";
import Footer from "@/components/footer";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Dashboard Walimurid",
  description: "Yayasan Islam Sahabat Sunnah",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.className} ${poppins.className} antialiased`}
      >
        <Navbar/>
        <main className="bg-gray-50 min-h-screen">{children}</main>
        <Footer/>
      </body>
    </html>
  );
}
