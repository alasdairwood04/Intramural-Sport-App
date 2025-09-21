import React from 'react';

function Footer() {
  return (
    <footer className="bg-white border-t border-neutral-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-r from-primary-500 to-primary-600 rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-xs">IS</span>
            </div>
            <span className="font-medium text-neutral-700">Intramural Sports</span>
          </div>
          
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors duration-200">
              Help Center
            </a>
            <a href="#" className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors duration-200">
              Contact
            </a>
            <a href="#" className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors duration-200">
              Privacy
            </a>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-neutral-200">
          <p className="text-xs text-neutral-500 text-center">
            © 2025 Intramural Sports Management System. Built with React & Node.js.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;