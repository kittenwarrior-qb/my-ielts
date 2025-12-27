import ThemeToggle from './ThemeToggle';
import MobileNav from './MobileNav';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              My <span className="text-red-600">IELTS</span>
            </span>
          </a>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <a
              href="/vocabulary"
              className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors"
            >
              Vocabulary
            </a>
            <a
              href="/idioms"
              className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors"
            >
              Idioms
            </a>
            <a
              href="/phrases"
              className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors"
            >
              Phrases
            </a>
            <div className="relative group">
              <button className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors">
                Skills
              </button>
              <div className="absolute hidden group-hover:block pt-2">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 min-w-[150px]">
                  <a href="/listening" className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                    Listening
                  </a>
                  <a href="/reading" className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                    Reading
                  </a>
                  <a href="/speaking" className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                    Speaking
                  </a>
                  <a href="/writing" className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                    Writing
                  </a>
                </div>
              </div>
            </div>
          </nav>

          {/* Theme Toggle & Mobile Nav */}
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <MobileNav />
          </div>
        </div>
      </div>
    </header>
  );
}
