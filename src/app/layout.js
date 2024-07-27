import './globals.css';
import { Inter } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Providers from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Kokan',
  description: 'A platform for trading and messaging',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
