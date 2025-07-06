import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { NavBar } from "./_components/nav-bar";

const montserrat = localFont({
  src: "../../public/fonts/Montserrat-VariableFont_wght.ttf",
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "eyusd.",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
    other: [
      {
        rel: "icon",
        url: "/favicon-16x16.png",
        sizes: "16x16",
      },
      {
        rel: "icon",
        url: "/favicon-32x32.png",
        sizes: "32x32",
      },
    ],
  },
  description: "Home of eyusd.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} antialiased relative font-sans`}
      >
        <NavBar className="fixed top-0 left-0 w-full z-50 text-white px-8"/>
        {children}
      </body>
    </html>
  );
}
