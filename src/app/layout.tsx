import type { Metadata } from "next";
import Providers from "../components/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ticketify",
  description: "Sistema de gestión de tickets y eventos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className="antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
