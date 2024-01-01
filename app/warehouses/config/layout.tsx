import React from 'react'
import { Sidebar } from '../../components/Sidebar';
import { sideMenu } from '../../components/sideMenu';

type Props = {
  children: React.ReactNode;
};

export default function layout({ children }: Props) {
  return (
    <section className='grid grid-cols-12 p-4 h-dvh'>
      <aside className='col-span-2 border-r p-4'>
        <h2>Bluesky</h2>
        <Sidebar menus={sideMenu}/>
      </aside>
      <main className='col-span-10 p-4'>
        {children}
      </main>
    </section>
  );
}