import React, { useMemo } from 'react';
import type { SVGProps } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import clsx from 'clsx';

import BookOpenIcon from '@/assets/book-open-admin.svg?react';
import SkyriseLogoPrimary from '@/assets/skyrise-logo.svg';
import SkyriseLogoMark from '@/assets/skyrise-logo-2.svg';
import DashboardIcon from '@/assets/dashboard.svg?react';
import BlogSetup from '@/assets/blogSetUp.svg?react';
import GraduationCap from '@/assets/graduation-cap-admin.svg?react';
import MessageHelp from '@/assets/message-help.svg?react';
import ArrowLeft from '@/assets/arrow-left.svg?react';
import Team from '@/assets/user-group.svg?react';
import Calender from '@/assets/calendar-time.svg?react';
import UserSetting from '@/assets/user-settings.svg?react';
import Milestone from '@/assets/milestone.svg?react';
import Logout from '@/assets/logout.svg?react';

type IconComponent = React.ComponentType<SVGProps<SVGSVGElement>>;

type SidebarItem = {
  label: string;
  to: string;
  Icon: IconComponent;
};

const dashboardItem: SidebarItem = {
  label: 'Dashboard',
  to: '/admin',
  Icon: DashboardIcon,
};

const navigationSections: Array<{ title: string; items: SidebarItem[] }> = [
  {
    title: 'Setup Info',
    items: [
      {
        label: 'Program Setup',
        to: '/admin/program-setup',
        Icon: GraduationCap,
      },
      {
        label: 'University Setup',
        to: '/admin/university-setup',
        Icon: BookOpenIcon,
      },
      { label: 'Blog Setup', to: '/admin/blog-setup', Icon: BlogSetup },
      {
        label: 'FAQs Setup',
        to: '/admin/faqs-setup',
        Icon: MessageHelp,
      },
    ],
  },
  {
    title: 'Organized',
    items: [
      { label: 'Team & Consultants', to: '/admin/team', Icon: Team },
      { label: 'Bookings', to: '/admin/bookings', Icon: Calender },
      { label: 'User Analysis', to: '/admin/user-analysis', Icon: UserSetting },
      {
        label: 'Application Process Tracking',
        to: '/admin/application-tracking',
        Icon: Milestone,
      },
    ],
  },
  {
    title: 'General',
    items: [
      {
        label: 'Roles & Permission',
        to: '/admin/roles-permissions',
        Icon: UserSetting,
      },
      { label: 'Logout', to: '/logout', Icon: Logout },
    ],
  },
];

const AdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const allNavItems = useMemo(
    () => [
      dashboardItem,
      ...navigationSections.flatMap((section) => section.items),
    ],
    []
  );

  const activeItem = allNavItems.find((item) => {
    if (item.to === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(item.to);
  });

  // Dynamic header title logic with custom route mappings
  const getHeaderTitle = () => {
    const pathname = location.pathname;

    // Define custom route patterns and their titles
    const customRouteTitles: Array<{
      pattern: RegExp | string;
      title: string;
    }> = [
      {
        pattern: '/admin/program-setup/create',
        title: 'PROGRAM SETUP - CREATE',
      },
      {
        pattern: /^\/admin\/program-setup\/edit\/.*/,
        title: 'PROGRAM SETUP - EDIT',
      },
      // Add more custom routes here as needed
      // { pattern: '/admin/university-setup/create', title: 'UNIVERSITY SETUP - CREATE' },
      // { pattern: /^\/admin\/university-setup\/edit\/.*/, title: 'UNIVERSITY SETUP - EDIT' },
    ];

    // Check for custom route matches
    for (const route of customRouteTitles) {
      if (typeof route.pattern === 'string') {
        if (pathname === route.pattern) {
          return route.title;
        }
      } else {
        if (route.pattern.test(pathname)) {
          return route.title;
        }
      }
    }

    // Default to active nav item label
    return (activeItem?.label || 'Dashboard').toUpperCase();
  };

  const headerTitle = getHeaderTitle();

  // Back arrow logic
  const getBackArrowConfig = () => {
    const pathname = location.pathname;

    // Define routes that should have back arrows and their destinations
    const backArrowRoutes: Array<{
      pattern: RegExp | string;
      backTo: string;
    }> = [
      {
        pattern: '/admin/program-setup/create',
        backTo: '/admin/program-setup',
      },
      {
        pattern: /^\/admin\/program-setup\/edit\/.*/,
        backTo: '/admin/program-setup',
      },
      // Add more back arrow routes here as needed
      // { pattern: '/admin/university-setup/create', backTo: '/admin/university-setup', label: 'UNIVERSITY SETUP' },
      // { pattern: /^\/admin\/university-setup\/edit\/.*/, backTo: '/admin/university-setup', label: 'UNIVERSITY SETUP' },
    ];

    // Check for back arrow route matches
    for (const route of backArrowRoutes) {
      if (typeof route.pattern === 'string') {
        if (pathname === route.pattern) {
          return { shouldShow: true, backTo: route.backTo };
        }
      } else {
        if (route.pattern.test(pathname)) {
          return { shouldShow: true, backTo: route.backTo };
        }
      }
    }

    return { shouldShow: false, backTo: '', label: '' };
  };

  const backArrowConfig = getBackArrowConfig();

  const handleBackClick = () => {
    if (backArrowConfig.backTo) {
      navigate(backArrowConfig.backTo);
    }
  };

  const renderNavLink = (item: SidebarItem, options?: { exact?: boolean }) => (
    <NavLink
      key={item.label}
      to={item.to}
      end={options?.exact}
      className="block"
    >
      {({ isActive }) => (
        <span
          className={clsx(
            'group relative flex items-center gap-3 rounded-sm px-5 py-3 text-sm font-semibold transition-all',
            isActive
              ? 'border-primary border-l-8 bg-[#FFE6E7] text-gray-900 shadow-[0_10px_22px_rgba(222,88,91,0.12)]'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          )}
        >
          <item.Icon
            className={clsx(
              'relative z-10 h-5 w-5 text-gray-400 transition-colors',
              isActive ? 'text-primary' : 'group-hover:text-primary'
            )}
          />
          <span className="relative z-10">{item.label}</span>
        </span>
      )}
    </NavLink>
  );

  return (
    <div className="min-h-screen bg-neutral-100 text-sm text-gray-700">
      <div className="flex min-h-screen">
        <aside className="flex w-[250px] shrink-0 flex-col border-r border-gray-200 bg-white">
          <div className="border-b border-gray-200 px-8 py-4">
            <img
              src={SkyriseLogoPrimary}
              alt="SkyRise Corner Education Agency"
              className="h-12 w-auto"
            />
          </div>
          <nav className="flex flex-1 flex-col gap-2 overflow-y-auto px-6 py-2">
            <div>{renderNavLink(dashboardItem, { exact: true })}</div>
            {navigationSections.map((section) => (
              <div key={section.title} className="space-y-2">
                <p className="text-h4 font-regular text-text-primary pt-2 uppercase">
                  {section.title}
                </p>
                <div className="space-y-2">
                  {section.items.map((item) => renderNavLink(item))}
                </div>
              </div>
            ))}
          </nav>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex items-center justify-between border-b border-gray-200 bg-white px-12 py-4 shadow-[0_8px_20px_rgba(0,0,0,0.04)]">
            <div className="flex items-center gap-5">
              {backArrowConfig.shouldShow && (
                <button
                  onClick={handleBackClick}
                  className="flex items-center gap-2 text-gray-600 transition-colors hover:text-gray-900"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
              )}
              <h1 className="text-h2 font-semibold text-gray-800 uppercase">
                {headerTitle}
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center">
                <img
                  src={SkyriseLogoMark}
                  alt="SkyRise Corner Education Agency"
                  className="h-12 w-auto"
                />
              </div>
              <div className="text-right">
                <p className="text-base font-semibold text-gray-900">
                  Kay Thwe San
                </p>
                <p className="text-[10px] tracking-[0.38em] text-gray-400 uppercase">
                  Head Admin
                </p>
              </div>
            </div>
          </header>

          <main className="min-w-0 flex-1 overflow-y-auto bg-white px-10 py-2">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
