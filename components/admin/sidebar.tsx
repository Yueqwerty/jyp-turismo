'use client';

import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { motion } from 'framer-motion';
import {
  Icon,
  ChevronLeft,
  ChevronRight,
  LogOut,
  ExternalLink,
} from '@/components/icons';
import { MENU_ITEMS } from '@/types/cms';
import type { AdminSection } from '@/types/cms';

interface SidebarProps {
  activeSection: AdminSection;
  onSectionChange: (section: AdminSection) => void;
  isOpen: boolean;
  onToggle: () => void;
  logoText: string;
}

export function Sidebar({
  activeSection,
  onSectionChange,
  isOpen,
  onToggle,
  logoText,
}: SidebarProps) {
  return (
    <motion.aside
      initial={false}
      animate={{ width: isOpen ? 256 : 80 }}
      className="bg-gray-900 text-white flex flex-col relative shadow-2xl z-20"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-xl flex items-center justify-center font-black text-white shadow-lg">
            {logoText}
          </div>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="overflow-hidden"
            >
              <h1 className="font-bold text-white text-lg">Admin CMS</h1>
              <p className="text-xs text-gray-400">Panel de Control</p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-16 w-6 h-6 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center text-gray-400 hover:text-white shadow-lg border border-gray-700 transition-colors z-50"
      >
        {isOpen ? <ChevronLeft className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
      </button>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {MENU_ITEMS.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 group ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-lg'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon name={item.icon} className="w-5 h-5 flex-shrink-0" />
              {isOpen && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="font-medium text-sm truncate"
                >
                  {item.label}
                </motion.span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Actions */}
      <div className="p-3 space-y-2 border-t border-gray-800">
        <Link
          href="/"
          target="_blank"
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 hover:bg-gray-800 hover:text-white transition-all duration-200"
        >
          <ExternalLink className="w-5 h-5 flex-shrink-0" />
          {isOpen && <span className="font-medium text-sm">Ver Sitio</span>}
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {isOpen && <span className="font-medium text-sm">Cerrar Sesion</span>}
        </button>
      </div>
    </motion.aside>
  );
}
