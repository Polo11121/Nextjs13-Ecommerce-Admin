import { ReactNode } from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import { MountingProvider } from "@/providers/MountingProvider";
import { StoreModal } from "@/components/modals/StoreModal";
import { Toaster } from "react-hot-toast";
import type { Metadata } from "next";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Admin Dashboard",
};

const RootLayout = ({ children }: { children: ReactNode }) => (
  <ClerkProvider>
    <html lang="en">
      <body className={inter.className}>
        {children}
        <MountingProvider>
          <StoreModal />
          <Toaster />
        </MountingProvider>
      </body>
    </html>
  </ClerkProvider>
);

export default RootLayout;
