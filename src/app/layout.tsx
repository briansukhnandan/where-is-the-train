import { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Where are the NYC Subway Trains?",
  description: "Track down a train by line!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          { children }
        </Providers>
      </body>
    </html>
  );
}
