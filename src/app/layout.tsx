import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '../context/CartContext';
import { AdminAuthProvider } from '../context/AdminAuthContext';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { CartDrawer } from '../components/CartDrawer';

export const metadata: Metadata = {
  title: 'Kinetov | Premium Custom Battery Store',
  description: 'Buy & Sell custom lithium battery packs online with Kinetov. Custom LiFePO4, NMC, 48V, 72V, 24V solar, EV, and drone batteries.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#08080A] text-[#E4E4EB] antialiased selection:bg-[#C86D27] selection:text-white flex flex-col min-h-screen">
        <AdminAuthProvider>
          <CartProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <CartDrawer />
            <Footer />
          </CartProvider>
        </AdminAuthProvider>
      </body>
    </html>
  );
}
