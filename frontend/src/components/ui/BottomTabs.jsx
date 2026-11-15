import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, BookOpen, FlaskConical, Swords, Users, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';

/**
 * Persistent mobile bottom tab bar shown on viewports < 768px.
 * Preserves `.bottom-nav` and `.nav-tab` selectors for accessibility and phase checks.
 */
export default function BottomTabs() {
  const { t } = useTranslation();

  const items = [
    { to: '/dashboard', label: t('nav_home', 'Home'), icon: Home },
    { to: '/subjects', label: t('nav_subjects', 'Syllabus'), icon: BookOpen },
    { to: '/labs', label: t('nav_labs', 'Labs'), icon: FlaskConical },
    { to: '/arena', label: t('nav_arena', 'Arena'), icon: Swords },
    { to: '/community', label: t('nav_community', 'Community'), icon: Users },
    { to: '/profile', label: t('nav_profile', 'Notebook'), icon: User },
  ];

  return (
    <nav className="bottom-nav" aria-label="Mobile Navigation">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `nav-tab${isActive ? ' active' : ''}`}
          >
            <Icon size={20} strokeWidth={2} aria-hidden="true" />
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}
