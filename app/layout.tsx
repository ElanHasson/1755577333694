import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Editing Life: A Beginner’s Guide to CRISPR',
  description: 'CRISPR is one of the most revolutionary scientific tools of our time—often described as “genetic scissors” that can edit DNA with precision. But what does that actually mean for medicine, agriculture, and even everyday life? In this webinar, we’ll break down the science of CRISPR in plain language, explore real-world breakthroughs it’s enabling, and look honestly at the ethical questions it raises. No biology background required—just curiosity about how science is rewriting the rules of life itself.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}