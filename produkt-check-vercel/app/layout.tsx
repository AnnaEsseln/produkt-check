import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ideen-Check",
  description: "Welche deiner drei Ideen ist wirklich verkaufbar?",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-beige font-sans text-black antialiased">
        {children}
      </body>
    </html>
  );
}
