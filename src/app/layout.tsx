import type { Metadata } from "next";
import { Fredoka, Inter, Fira_Code, Kalam } from "next/font/google";
import { Providers } from "@/lib/providers";
import "./globals.css";

const fredokaOne = Fredoka({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-display",
});

const inter = Inter({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-body",
});

const firaCode = Fira_Code({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-mono",
});

const kalam = Kalam({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-handwritten",
});

export const metadata: Metadata = {
  title: "Bassita - Task Management Made Simple",
  description:
    "Collaborative task management platform that makes teamwork simple and fun",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fredokaOne.variable} ${inter.variable} ${firaCode.variable} ${kalam.variable}`}
    >
      <body className="antialiased" suppressHydrationWarning={true}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
