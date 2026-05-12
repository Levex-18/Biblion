import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Biblion - Biblioteca Digital Escolar",
  description:
    "Plataforma educativa para compartir y acceder a recursos academicos, articulos de conocimiento y libros digitales.",
};

export const viewport: Viewport = {
  themeColor: "#1a1d24",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark bg-background">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
