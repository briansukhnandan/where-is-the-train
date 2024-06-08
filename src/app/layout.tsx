"use client"
import "./globals.css";
import { ChakraProvider, ThemeConfig, extendTheme } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false,
}

const theme = extendTheme({
  config,
  styles: {
    global: () => ({
      body: {
        bg: "",
        color: "",
      },
    }),
  },
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ChakraProvider theme={theme}>
          {children}
        </ChakraProvider>
      </body>
    </html>
  );
}
