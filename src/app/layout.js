// 'use client'; // Esta línea no es necesaria en Next.js
import './boostrap.css';
import './globals.css';
// Importaciones necesarias
import { Inter } from "next/font/google";
import { Providers } from "./Providers";



// Configuración de la fuente Inter
const inter = Inter({ subsets: ["latin"] });

// Exportación de metadatos
export const metadata = {
  title: "WORKITOUT",
  description: "Plataforma de servicios",
  generator: "Next.js",
  manifest: "/manifest.json",
  keywords: ["nextjs", "nextjs13", "next13", "pwa", "next-pwa"],
  authors: [
    { name: "Sergio Sanguinetti" }
  ],
  icons: [
    { rel: "apple-touch-icon", url: "logo_work.png" },
    { rel: "icon", url: "logo_work.png" },
  ],
};

// Exportación de viewport
export const viewport = {
  minimumScale: 1,
  initialScale: 1,
  width: 'device-width',
  shrinkToFit: 'no',
  viewportFit: 'cover',
};

// Componente RootLayout corregido
export default function RootLayout({ children }) {




  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
