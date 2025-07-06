import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "eyusd. | Music Box",
  description: "3D gallery of tracks by eyusd.",
  openGraph: {
    title: "eyusd. | Music Box",
    description: "3D gallery of tracks by eyusd.",
    url: "https://eyusd.com/music-box",
    siteName: "eyusd.",
  },
};

export default function MusicBoxLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
