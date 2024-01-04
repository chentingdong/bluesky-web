// Filename: components/sidebar.tsx
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { NavItems } from './sideMenu';

type SidebarProps = {
  className?: string
  menus: NavItems[]
}

export function Sidebar({ className, menus }: SidebarProps) {
  const pathname = usePathname();
  return (
    <div className={className}>
      {menus.map((menu, index) => {
        return (
          <div key={index}>
            {menu.link ? (
              <Link key={index} href={menu.link } className='flex w-100 my-4 uppercase'>
                {menu.icon && <span className='pr-2'>{menu.icon}</span>}
                <span className="text-sm font-medium">{menu.label}</span>
              </Link>
            ) : (
              <div className='flex w-100 my-4 uppercase'>
                {menu.icon && <span className='pr-2'>{menu.icon}</span>}
                <span className="text-sm font-medium">{menu.label}</span>
              </div>
            )}
            {menu.subMenu && (
              <div className='ml-4'>
                {menu.subMenu.map((subMenu, index) => (
                  <Link key={index} href={subMenu.link || ''} className='flex w-100 my-4'>
                    {subMenu.icon && <span className='pr-2'>{subMenu.icon}</span> }
                    <span className="text-sm font-medium">{subMenu.label}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
