"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";

type AppShellProps = {
  header: React.ReactNode;
  sidebar: React.ReactNode;
  children: React.ReactNode;
};

export function AppShell({ header, sidebar, children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const t = useTranslations("Layout");

  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-surface text-primary">
      {/* Header */}
      <header className="flex h-14 shrink-0 items-center border-b border-border bg-surface-elevated px-4">
        {header}
        <button
          onClick={() => setSidebarOpen((v) => !v)}
          className="ml-auto rounded-md p-2 hover:bg-surface-hover lg:hidden"
          aria-label={sidebarOpen ? t("closeSidebar") : t("openSidebar")}
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            {sidebarOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            )}
          </svg>
        </button>
      </header>

      <div className="flex min-h-0 flex-1">
        {/* Desktop sidebar */}
        <aside className="hidden w-56 shrink-0 border-r border-border bg-surface-elevated lg:flex lg:flex-col">
          {sidebar}
        </aside>

        {/* Mobile sidebar overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-40 bg-black/60 lg:hidden"
                onClick={closeSidebar}
              />
              <motion.aside
                initial={{ x: -256 }}
                animate={{ x: 0 }}
                exit={{ x: -256 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed bottom-0 left-0 top-14 z-50 w-64 border-r border-border bg-surface-elevated lg:hidden"
              >
                {sidebar}
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main content */}
        <main className="min-w-0 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
