import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowUp, FiMail, FiMapPin } from 'react-icons/fi';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

export const Footer: React.FC = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <footer className="relative bg-[#02000a] border-t border-white/5 pt-16 pb-8 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Brand/About */}
          <div>
            <span className="text-lg font-extrabold tracking-wider bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              PORTFOLIO
            </span>
            <p className="mt-4 text-gray-400 text-sm max-w-xs">
              A premium space highlighting data analysis, machine learning insights, and full-stack software development projects.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-sm font-bold tracking-wider uppercase mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {['about', 'skills', 'projects', 'certifications', 'education', 'contact'].map((item) => (
                <li key={item}>
                  <a
                    href={`#${item}`}
                    className="text-gray-400 hover:text-white transition-colors text-sm capitalize"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details info */}
          <div>
            <h4 className="text-white text-sm font-bold tracking-wider uppercase mb-4">Let's Connect</h4>
            <p className="text-gray-400 text-sm mb-4">
              Open for collaboration, internships, and entry-level analyst opportunities.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://github.com/arunyadaveluvu-png"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-full bg-white/10 hover:bg-white text-white hover:text-black border border-white/20 transition-all duration-300 shadow-md shadow-white/5 flex items-center justify-center cursor-pointer"
                title="GitHub Profile"
              >
                <FaGithub className="w-5 h-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/arun-kumar-yeluvu-0b4687373"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-full bg-[#0a66c2]/10 hover:bg-[#0a66c2] text-[#0a66c2] hover:text-white border border-[#0a66c2]/30 transition-all duration-300 shadow-md shadow-[#0a66c2]/10 flex items-center justify-center cursor-pointer"
                title="LinkedIn Profile"
              >
                <FaLinkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/5 pt-8 flex flex-col items-center justify-center">
          <p 
            onClick={() => navigate('/login')} 
            className="text-gray-400 text-sm font-medium tracking-tight text-center cursor-pointer select-none hover:text-gray-300 transition-colors"
          >
            Copy-right &copy; Arun. Made with <span className="inline-block animate-pulse text-red-500">💖</span> by <span className="font-bold underline text-white">Arun Software Solutions</span>
          </p>
        </div>
      </div>

      {/* Back to top button */}
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-3 rounded-full bg-purple-600 hover:bg-purple-500 text-white shadow-2xl transition-all duration-300 hover:scale-110 z-50 cursor-pointer animate-bounce border border-white/10"
          aria-label="Back to Top"
        >
          <FiArrowUp className="w-5 h-5" />
        </button>
      )}
    </footer>
  );
};
