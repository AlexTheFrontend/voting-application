import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { clientEnv } from "@/lib/env";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Programming Language Voting",
  description: "Vote for your favorite programming language and see real-time results",
  keywords: "programming, languages, voting, poll, javascript, python, typescript",
  authors: [{ name: "Voting App Team" }],
  creator: "Voting Application",
  publisher: "Voting Application",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    title: "Programming Language Voting",
    description: "Vote for your favorite programming language and see real-time results",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Programming Language Voting",
    description: "Vote for your favorite programming language and see real-time results",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* App version for debugging */}
        <meta name="version" content={clientEnv.APP_VERSION} />
        
        {/* Theme color */}
        <meta name="theme-color" content="#3b82f6" />
        
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://vitals.vercel-analytics.com" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
