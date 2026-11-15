import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import {
  BookOpen,
  FlaskConical,
  Home,
  User,
  Globe,
  WifiOff,
  Award,
  Shield,
  GraduationCap,
  Menu,
  X,
} from 'lucide-react';
import Button from './Button';

/**
 * Single floating rounded navigation pill compliant with DESIGN.md Section 6.2 & Section 8.1 (variant="onSky").
 */
export default function NavBar({
  variant = 'default',
  user,
  isAuthenticated,
  xpPoints,
  isOnline = true,
  language = 'en',
  onLanguageChange,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname, variant]);

  const startHref = isAuthenticated ? '/dashboard' : '/signup';
  const subjectLinks = [
    { to: '/learn/mathematics', label: 'Maths' },
    { to: '/learn/physics', label: 'Physics' },
    { to: '/learn/chemistry', label: 'Chemistry' },
    { to: '/learn/biology', label: 'Biology' },
  ];

  if (variant === 'onSky') {
    return (
      <header className="nav-sky" aria-label="Primary navigation">
        <div className="nav-sky__inner">
          <Link to="/" className="nav-sky__logo">
            <span className="nav-sky__logo-badge" aria-hidden="true">
              <GraduationCap size={18} strokeWidth={2.3} />
            </span>
            <span>EduNova</span>
          </Link>

          <div className="nav-sky__right">
            <nav className="nav-sky__desktop" aria-label="Hero navigation">
              <div className="nav-sky__pill-group" role="group" aria-label="Subjects">
                {subjectLinks.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `nav-sky__pill-item${isActive ? ' is-active' : ''}`
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>

              <NavLink
                to="/mentor"
                className={({ isActive }) => `nav-sky__pill${isActive ? ' is-active' : ''}`}
              >
                Chotu
              </NavLink>

              <NavLink
                to="/login"
                className={({ isActive }) => `nav-sky__pill${isActive ? ' is-active' : ''}`}
              >
                Log in
              </NavLink>
            </nav>

            <button
              type="button"
              className="nav-sky__hamburger"
              aria-expanded={mobileMenuOpen}
              aria-controls="nav-sky-mobile-drawer"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              onClick={() => setMobileMenuOpen((prev) => !prev)}
            >
              {mobileMenuOpen ? (
                <X size={20} strokeWidth={2.2} aria-hidden="true" />
              ) : (
                <Menu size={20} strokeWidth={2.2} aria-hidden="true" />
              )}
            </button>

            <Button variant="cream" to={startHref} className="nav-sky__cta">
              Start learning
            </Button>
          </div>
        </div>

        {mobileMenuOpen ? (
          <nav
            id="nav-sky-mobile-drawer"
            className="nav-sky__mobile-menu"
            aria-label="Mobile hero navigation"
          >
            {subjectLinks.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `nav-sky__mobile-link${isActive ? ' is-active' : ''}`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <NavLink
              to="/mentor"
              className={({ isActive }) =>
                `nav-sky__mobile-link${isActive ? ' is-active' : ''}`
              }
            >
              Chotu
            </NavLink>
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `nav-sky__mobile-link${isActive ? ' is-active' : ''}`
              }
            >
              Log in
            </NavLink>
          </nav>
        ) : null}
      </header>
    );
  }

  const studentTabs = [
    { to: '/dashboard', label: 'Home', icon: Home },
    { to: '/subjects', label: 'Syllabus', icon: BookOpen },
    { to: '/labs', label: 'Labs', icon: FlaskConical },
    { to: '/profile', label: 'Notebook', icon: User },
  ];

  return (
    <header className="nav-sky" aria-label="Primary navigation">
      <div className="nav-sky__inner">
        <Link to={isAuthenticated ? '/dashboard' : '/'} className="nav-sky__logo">
          <span className="nav-sky__logo-badge" aria-hidden="true">
            <GraduationCap size={18} strokeWidth={2.3} />
          </span>
          <span>EduNova</span>
        </Link>

        <div className="nav-sky__right">
          {isAuthenticated ? (
            <nav className="nav-sky__desktop" aria-label="Main sections">
              <div className="nav-sky__pill-group" role="group" aria-label="Main navigation">
                {studentTabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <NavLink
                      key={tab.to}
                      to={tab.to}
                      className={({ isActive }) =>
                        `nav-sky__pill-item${isActive ? ' is-active' : ''}`
                      }
                    >
                      <Icon size={14} strokeWidth={2} aria-hidden="true" style={{ marginRight: 6 }} />
                      <span>{tab.label}</span>
                    </NavLink>
                  );
                })}
                {isAdmin ? (
                  <NavLink
                    to="/admin"
                    className={({ isActive }) =>
                      `nav-sky__pill-item${isActive ? ' is-active' : ''}`
                    }
                  >
                    <Shield size={14} strokeWidth={2} aria-hidden="true" style={{ marginRight: 6 }} />
                    <span>Admin</span>
                  </NavLink>
                ) : null}
              </div>
            </nav>
          ) : (
            <nav className="nav-sky__desktop" aria-label="Explore sections">
              <div className="nav-sky__pill-group" role="group" aria-label="Subjects">
                {subjectLinks.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `nav-sky__pill-item${isActive ? ' is-active' : ''}`
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>

              <NavLink
                to="/mentor"
                className={({ isActive }) => `nav-sky__pill${isActive ? ' is-active' : ''}`}
              >
                Chotu
              </NavLink>

              <NavLink
                to="/login"
                className={({ isActive }) => `nav-sky__pill${isActive ? ' is-active' : ''}`}
              >
                Log in
              </NavLink>
            </nav>
          )}

          {!isOnline ? (
            <span className="nav-offline" role="status">
              <WifiOff size={14} strokeWidth={2} aria-hidden="true" />
              <span>Offline</span>
            </span>
          ) : null}

          {isAuthenticated ? (
            <>
              <span className="nav-sky__pill nav-sky__pill--xp" title="Notebook XP">
                <Award size={14} strokeWidth={2.2} aria-hidden="true" />
                <span>{xpPoints ?? 0} XP</span>
              </span>

              {onLanguageChange ? (
                <label className="nav-sky__pill nav-sky__pill--lang" aria-label="Select language">
                  <Globe size={14} strokeWidth={2} aria-hidden="true" />
                  <select
                    value={(language || 'en').split('-')[0]}
                    onChange={(e) => onLanguageChange(e.target.value)}
                    aria-label="Language"
                  >
                    <option value="en">EN</option>
                    <option value="hi">HI</option>
                    <option value="mr">MR</option>
                  </select>
                </label>
              ) : null}

              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `nav-sky__pill nav-sky__pill--user${isActive ? ' is-active' : ''}`
                }
                aria-label="My notebook profile"
              >
                <User size={15} strokeWidth={2} aria-hidden="true" />
                <span className="nav-user__name">{user?.name || 'Student'}</span>
              </NavLink>
            </>
          ) : (
            <>
              {onLanguageChange ? (
                <label className="nav-sky__pill nav-sky__pill--lang" aria-label="Select language">
                  <Globe size={14} strokeWidth={2} aria-hidden="true" />
                  <select
                    value={(language || 'en').split('-')[0]}
                    onChange={(e) => onLanguageChange(e.target.value)}
                    aria-label="Language"
                  >
                    <option value="en">EN</option>
                    <option value="hi">HI</option>
                    <option value="mr">MR</option>
                  </select>
                </label>
              ) : null}

              <button
                type="button"
                className="nav-sky__hamburger"
                aria-expanded={mobileMenuOpen}
                aria-controls="nav-default-mobile-drawer"
                aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                onClick={() => setMobileMenuOpen((prev) => !prev)}
              >
                {mobileMenuOpen ? (
                  <X size={20} strokeWidth={2.2} aria-hidden="true" />
                ) : (
                  <Menu size={20} strokeWidth={2.2} aria-hidden="true" />
                )}
              </button>

              <Button variant="cream" to="/signup" className="nav-sky__cta">
                Start learning
              </Button>
            </>
          )}
        </div>
      </div>

      {!isAuthenticated && mobileMenuOpen ? (
        <nav
          id="nav-default-mobile-drawer"
          className="nav-sky__mobile-menu"
          aria-label="Mobile navigation"
        >
          {subjectLinks.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `nav-sky__mobile-link${isActive ? ' is-active' : ''}`
              }
            >
              {item.label}
            </NavLink>
          ))}
          <NavLink
            to="/mentor"
            className={({ isActive }) =>
              `nav-sky__mobile-link${isActive ? ' is-active' : ''}`
            }
          >
            Chotu
          </NavLink>
          <NavLink
            to="/login"
            className={({ isActive }) =>
              `nav-sky__mobile-link${isActive ? ' is-active' : ''}`
            }
          >
            Log in
          </NavLink>
        </nav>
      ) : null}
    </header>
  );
}
