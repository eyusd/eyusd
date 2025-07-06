import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "eyusd. | Tracks",
  description: "Home of the tracks by eyusd.",
  openGraph: {
    title: "eyusd. | Tracks",
    description: "Home of the tracks by eyusd.",
    url: "https://eyusd.com/tracks",
    siteName: "eyusd.",
  },
};

export default function TracksLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    children
  );
}