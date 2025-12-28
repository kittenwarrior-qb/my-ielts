export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
              my <span className="text-red-600">IELTS</span>
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Học từ vựng IELTS hiệu quả với hệ thống quản lý từ vựng, idioms và phrases.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Học tập</h4>
            <ul className="space-y-2">
              <li>
                <a href="/vocabulary" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 text-sm">
                  Vocabulary
                </a>
              </li>
              <li>
                <a href="/idioms" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 text-sm">
                  Idioms
                </a>
              </li>
              <li>
                <a href="/phrases" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 text-sm">
                  Phrases
                </a>
              </li>
            </ul>
          </div>

          {/* Skills */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Kỹ năng</h4>
            <ul className="space-y-2">
              <li>
                <a href="/listening" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 text-sm">
                  Listening
                </a>
              </li>
              <li>
                <a href="/reading" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 text-sm">
                  Reading
                </a>
              </li>
              <li>
                <a href="/speaking" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 text-sm">
                  Speaking
                </a>
              </li>
              <li>
                <a href="/writing" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 text-sm">
                  Writing
                </a>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Về chúng tôi</h4>
            <ul className="space-y-2">
              <li>
                <a href="/about" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 text-sm">
                  Giới thiệu
                </a>
              </li>
              <li>
                <a href="/contact" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 text-sm">
                  Liên hệ
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-center text-gray-600 dark:text-gray-400 text-sm">
            © {currentYear} My IELTS. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
