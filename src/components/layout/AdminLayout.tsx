import React from 'react';
import type { SVGProps } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import clsx from 'clsx';

import GraduationCapIcon from '@/assets/graduation-cap.svg?react';
import BuildingIcon from '@/assets/building.svg?react';
import BookOpenIcon from '@/assets/book-open.svg?react';
import MessageQuestionIcon from '@/assets/message-question.svg?react';
import CalendarIcon from '@/assets/calendar.svg?react';

type IconComponent = React.ComponentType<SVGProps<SVGSVGElement>>;

const DashboardGlyph: IconComponent = ({ className, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    {...props}
  >
    <path d="M4 3.5h7.5V11H4zM12.5 3.5H20V11h-7.5zM4 12.5h7.5V20H4zM12.5 12.5H20V20h-7.5z" />
  </svg>
);

const TeamGlyph: IconComponent = ({ className, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    {...props}
  >
    <path d="M7.5 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM17 14.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
    <path d="M1.5 20.25c0-3.59 2.91-6.5 6.5-6.5h1c3.59 0 6.5 2.91 6.5 6.5v.75h-14v-.75ZM13.5 17.528a7.55 7.55 0 0 1 3.75-.978c3.175 0 5.75 2.575 5.75 5.75V21h-5.75v-.75c0-1.762-.648-3.372-1.75-4.722Z" />
  </svg>
);

const ChartGlyph: IconComponent = ({ className, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    {...props}
  >
    <path d="M4 20.5h3.25v-7.5H4zm5.25 0h3.25V9.5H9.25zm5.25 0h3.25V15H14.5zm5.25 0H22V6h-2.75z" />
  </svg>
);

const WorkflowGlyph: IconComponent = ({ className, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    {...props}
  >
    <path d="M7 4.5h10a2.5 2.5 0 0 1 0 5h-3.75v2h2.5a2.5 2.5 0 0 1 0 5h-1.75v1.5a2.5 2.5 0 0 1-5 0V16.5H7a2.5 2.5 0 0 1 0-5h3.75v-2H7a2.5 2.5 0 0 1 0-5Zm10 3a.5.5 0 0 0 0-1H7a.5.5 0 0 0 0 1h10Zm-1.25 7H7a.5.5 0 0 0 0 1h8.75a.5.5 0 0 0 0-1Zm-4.25 5a.5.5 0 0 0 1 0V16.5h-1V19.5Z" />
  </svg>
);

const ShieldGlyph: IconComponent = ({ className, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    {...props}
  >
    <path d="M12 2.5 20 5.5V12c0 5.148-3.625 9.89-8 11.5-4.375-1.61-8-6.352-8-11.5V5.5z" />
    <path d="M11 9a1 1 0 0 1 2 0v3.586l1.707 1.707a1 1 0 1 1-1.414 1.414l-2-2A1 1 0 0 1 11 13V9Z" />
  </svg>
);

const LogoutGlyph: IconComponent = ({ className, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    {...props}
  >
    <path d="M13.25 4a.75.75 0 0 0-1.5 0v4.25H6.5C5.12 8.25 4 9.37 4 10.75v2.5c0 1.38 1.12 2.5 2.5 2.5h5.25V20a.75.75 0 0 0 1.5 0V4Z" />
    <path d="M18.53 8.47a.75.75 0 0 0-1.06 1.06l1.72 1.72H11.5a.75.75 0 0 0 0 1.5h7.69l-1.72 1.72a.75.75 0 1 0 1.06 1.06l3.25-3.25a.75.75 0 0 0 0-1.06Z" />
  </svg>
);

type SidebarItem = {
  label: string;
  to: string;
  Icon: IconComponent;
};

const dashboardItem: SidebarItem = {
  label: 'Dashboard',
  to: '/admin',
  Icon: DashboardGlyph,
};

const navigationSections: Array<{ title: string; items: SidebarItem[] }> = [
  {
    title: 'Setup Info',
    items: [
      { label: 'Program Setup', to: '/admin/program-setup', Icon: GraduationCapIcon },
      { label: 'University Setup', to: '/admin/university-setup', Icon: BuildingIcon },
      { label: 'Blog Setup', to: '/admin/blog-setup', Icon: BookOpenIcon },
      { label: 'FAQs Setup', to: '/admin/faqs-setup', Icon: MessageQuestionIcon },
    ],
  },
  {
    title: 'Organized',
    items: [
      { label: 'Team & Consultants', to: '/admin/team', Icon: TeamGlyph },
      { label: 'Bookings', to: '/admin/bookings', Icon: CalendarIcon },
      { label: 'User Analysis', to: '/admin/user-analysis', Icon: ChartGlyph },
      {
        label: 'Application Process Tracking',
        to: '/admin/application-tracking',
        Icon: WorkflowGlyph,
      },
    ],
  },
  {
    title: 'General',
    items: [
      { label: 'Roles & Permission', to: '/admin/roles-permissions', Icon: ShieldGlyph },
      { label: 'Logout', to: '/logout', Icon: LogoutGlyph },
    ],
  },
];

const AdminLayout: React.FC = () => {
  const renderNavLink = (
    item: SidebarItem,
    options?: { exact?: boolean }
  ) => (
    <NavLink key={item.label} to={item.to} end={options?.exact} className="block">
      {({ isActive }) => (
        <span
          className={clsx(
            'group relative flex items-center gap-3 rounded-md px-6 py-3 text-base font-semibold transition-colors',
            isActive
              ? 'bg-secondary text-gray-900 shadow-[0_6px_20px_rgba(222,88,91,0.12)] border-l-6 border-primary'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          )}
        >
          <span
            className={clsx(
              'relative z-10 flex h-2 w-9 items-center justify-center rounded-md text-gray-400 transition-colors',
              isActive ? 'text-primary' : 'group-hover:text-primary'
            )}
          >
            <item.Icon className="h-5 w-5" />
          </span>
          <span className="relative z-10">{item.label}</span>
        </span>
      )}
    </NavLink>
  );

  return (
    <div className="min-h-screen bg-neutral-100 text-sm text-gray-700">
      <div className="flex min-h-screen">
        <aside className="flex w-[320px] shrink-0 flex-col border-r border-gray-200 bg-white">
    
          <nav className="flex flex-1 flex-col gap-3 overflow-y-auto px-8 py-10">
            <div>{renderNavLink(dashboardItem, { exact: true })}</div>
            {navigationSections?.map((section) => (
              <div key={section.title} className="space-y-3">
                <p className="text-h4 font-regular uppercase text-text-primary">
                  {section.title}
                </p>
                <div className="space-y-2">
                  {section.items.map((item) => renderNavLink(item))}
                </div>
              </div>
            ))}
          </nav>
        </aside>

        <div className="flex flex-1 flex-col">
          <header className="flex flex-col gap-3 border-b border-gray-200 bg-white px-10 py-5 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-gray-400">
                  Dashboard
                </p>
                <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
              </div>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  className="relative flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-gray-50 text-gray-500 transition hover:text-gray-900"
                  aria-label="Notifications"
                >
                  <span className="absolute right-2 top-2 inline-flex h-2 w-2 rounded-full bg-primary"></span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-5-5.917V4a1 1 0 10-2 0v1.083A6 6 0 006 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                </button>
                <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-lg font-semibold text-white">
                    K
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Kay Thwe San</p>
                    <p className="text-xs text-gray-500">Head Admin</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="inline-flex h-2 w-2 rounded-full bg-primary"></span>
              <span>SkyRise Career Consulting</span>
              <span className="text-gray-300">/</span>
              <span className="font-medium text-gray-700">Dashboard Overview</span>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto bg-neutral-100 px-10 py-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
