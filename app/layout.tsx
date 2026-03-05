import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";

export const metadata: Metadata = {
  title: "Apuälynen",
};

const RootLayout = (props: { children: ReactNode }) => (
  <html lang="en">
    <body>{props.children}</body>
  </html>
);

export default RootLayout;
