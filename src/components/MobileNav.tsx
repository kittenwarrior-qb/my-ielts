import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
        ) : (
          <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
        )}
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Slide-out Menu */}
          <div className="fixed top-0 right-0 bottom-0 w-64 bg-white dark:bg-gray-800 shadow-xl z-50 transform transition-transform">
            <div className="p-4">
              {/* Close Button */}
              <div className="flex justify-end mb-6">
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="space-y-4">
                <a
                  href="/vocabulary"
                  className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Vocabulary
                </a>
                <a
                  href="/idioms"
                  className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Idioms
                </a>
                <a
                  href="/phrases"
                  className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Phrases
                </a>

                {/* Skills Submenu */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="px-4 py-2 text-sm font-semibold text-gray-500 dark:text-gray-400">
                    Skills
                  </p>
                  <a
                    href="/listening"
                    className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                    onClick={() => setIsOpen(false)}
                  >
                    Listening
                  </a>
                  <a
                    href="/reading"
                    className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                    onClick={() => setIsOpen(false)}
                  >
                    Reading
                  </a>
                  <a
                    href="/speaking"
                    className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                    onClick={() => setIsOpen(false)}
                  >
                    Speaking
                  </a>
                  <a
                    href="/writing"
                    className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                    onClick={() => setIsOpen(false)}
                  >
                    Writing
                  </a>
                </div>
              </nav>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
