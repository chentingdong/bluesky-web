import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './theme/globals.css';
import { Sidebar } from './components/siidebar';
import { sideMenu } from './components/sideMenu';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className='h-dvh'>
        <section className='grid grid-cols-12 p-4 h-full'>
          <aside className='col-span-2 border-r p-4'>
            <h2>Bluesky</h2>
            <Sidebar menus={sideMenu} />
          </aside>
          <main className='col-span-10 p-4 h-full'>
            {children}
          </main>
        </section>
      </body>
    </html>
  );
}
