/**
 * Footer component for public marketing website.
 */
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-2xl font-black text-primary-400">DOJO</span>
              <span className="text-lg font-bold text-white">FITNESS</span>
            </div>
            <p className="text-gray-400 text-sm">
              Transform your body. Transform your life. Join the elite.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-primary-400 text-sm transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/try-us" className="text-gray-400 hover:text-primary-400 text-sm transition-colors">
                  Free Trial
                </Link>
              </li>
              <li>
                <Link to="/join-us" className="text-gray-400 hover:text-primary-400 text-sm transition-colors">
                  Join Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-primary-400 text-sm transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>📍 123 Fitness Street</li>
              <li>City, State 12345</li>
              <li>📞 +1 (555) 123-4567</li>
              <li>✉️ info@dojofitness.com</li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h3 className="text-white font-semibold mb-4">Hours</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>Mon - Fri: 5:00 AM - 11:00 PM</li>
              <li>Sat - Sun: 6:00 AM - 10:00 PM</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} DOJO Fitness. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

