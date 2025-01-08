import { Afacad } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const afacad = Afacad({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${afacad.className} antialiased bg-white flex flex-col items-center`}
      >
        {children}

        <Toaster />
      </body>
    </html>
  );
}
