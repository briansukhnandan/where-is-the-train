"use client"
import React from "react"
import { ChakraProvider, type ThemeConfig, extendTheme } from "@chakra-ui/react"

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

export const Providers = ({ children }: { children: React.ReactNode }) => (
  <ChakraProvider theme={theme}>
    { children }
  </ChakraProvider>
);
