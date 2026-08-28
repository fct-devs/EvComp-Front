import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Configurando a tipografia oficial da SECOMPP
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// Estes dados vão aparecer na aba do navegador e no Google
export const metadata: Metadata = {
  title: "SECOMPP - FCT Unesp",
  description: "Sistema Oficial da Semana da Computação da FCT-Unesp",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}