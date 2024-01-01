// Filename: config/sideMenu.tsx
import { IconType } from 'react-icons';
import { BsFillPersonFill, BsGearFill } from 'react-icons/bs';

export type NavItems = {
  label: string;
  icon?: React.ReactNode;
  link?: string;
  isParent: boolean;
  subMenu?: NavItems[];
}

export const sideMenu: NavItems[] = [
  {
    label: "Workload Analytics",
    isParent: true,
    subMenu: [
      {
        icon: <BsFillPersonFill className="w-4 h-4" />,
        label: "Warehouses",
        link: "/warehouses/config",
        isParent: false,
      },
      {
        icon: <BsFillPersonFill className="w-4 h-4" />,
        label: "Queries",
        link: "/queries/list",
        isParent: false,
      },
      {
        icon: <BsFillPersonFill className="w-4 h-4" />,
        label: "Storage",
        link: "/storage/list",
        isParent: false,
      },
      {
        icon: <BsFillPersonFill className="w-4 h-4" />,
        label: "Sessions",
        link: "/sessions/list",
        isParent: false,
      }
    ],
  },
  {
    label: "Optimization",
    isParent: true,
    subMenu: [
      {
        icon: <BsFillPersonFill className="w-4 h-4" />,
        label: "Findings",
        link: "/findings/list",
        isParent: false,
      },
      {
        icon: <BsFillPersonFill className="w-4 h-4" />,
        label: "Request",
        link: "/request/list",
        isParent: false,
      },
      {
        icon: <BsFillPersonFill className="w-4 h-4" />,
        label: "Control",
        link: "/control/list",
        isParent: false,
      }
    ],
  },
  {
    label: "Monitors",
    isParent: true,
    subMenu: [
      {
        icon: <BsFillPersonFill className="w-4 h-4" />,
        label: "Weekly Digest",
        link: "/subscription",
        isParent: false,
      }
    ],
  }
]