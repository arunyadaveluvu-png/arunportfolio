import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowUp, FiMail, FiMapPin, FiLink } from 'react-icons/fi';
import { 
  FaGithub, FaLinkedin, FaWhatsapp, FaInstagram, 
  FaYoutube, FaFacebook, FaTwitter, FaTelegram, 
  FaDiscord, FaPinterest, FaTiktok 
} from 'react-icons/fa';
import { api } from '../services/api';

export const Footer: React.FC = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await api.profile.get();
        setProfile(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();

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

  const getSocialIcon = (platform: string, className = "w-5 h-5") => {
    switch (platform.toLowerCase()) {
      case 'github':
        return <FaGithub className={className} />;
      case 'linkedin':
        return <FaLinkedin className={className} />;
      case 'whatsapp':
        return <FaWhatsapp className={className} />;
      case 'instagram':
        return <FaInstagram className={className} />;
      case 'youtube':
        return <FaYoutube className={className} />;
      case 'facebook':
        return <FaFacebook className={className} />;
      case 'twitter':
      case 'x':
        return <FaTwitter className={className} />;
      case 'telegram':
        return <FaTelegram className={className} />;
      case 'discord':
        return <FaDiscord className={className} />;
      case 'pinterest':
        return <FaPinterest className={className} />;
      case 'tiktok':
        return <FaTiktok className={className} />;
      default:
        return <FiLink className={className} />;
    }
  };

  const getPlatformStyles = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'github':
        return 'bg-white/10 hover:bg-white text-white hover:text-black border-white/20 shadow-white/5';
      case 'linkedin':
        return 'bg-[#0a66c2]/10 hover:bg-[#0a66c2] text-[#0a66c2] hover:text-white border-[#0a66c2]/30 shadow-[#0a66c2]/10';
      case 'whatsapp':
        return 'bg-[#25d366]/10 hover:bg-[#25d366] text-[#25d366] hover:text-white border-[#25d366]/30 shadow-[#25d366]/10';
      case 'instagram':
        return 'bg-[#e1306c]/10 hover:bg-[#e1306c] text-[#e1306c] hover:text-white border-[#e1306c]/30 shadow-[#e1306c]/10';
      case 'youtube':
        return 'bg-[#ff0000]/10 hover:bg-[#ff0000] text-[#ff0000] hover:text-white border-[#ff0000]/30 shadow-[#ff0000]/10';
      case 'facebook':
        return 'bg-[#1877f2]/10 hover:bg-[#1877f2] text-[#1877f2] hover:text-white border-[#1877f2]/30 shadow-[#1877f2]/10';
      case 'twitter':
      case 'x':
        return 'bg-[#1da1f2]/10 hover:bg-[#1da1f2] text-[#1da1f2] hover:text-white border-[#1da1f2]/30 shadow-[#1da1f2]/10';
      case 'telegram':
        return 'bg-[#0088cc]/10 hover:bg-[#0088cc] text-[#0088cc] hover:text-white border-[#0088cc]/30 shadow-[#0088cc]/10';
      case 'discord':
        return 'bg-[#5865f2]/10 hover:bg-[#5865f2] text-[#5865f2] hover:text-white border-[#5865f2]/30 shadow-[#5865f2]/10';
      case 'pinterest':
        return 'bg-[#bd081c]/10 hover:bg-[#bd081c] text-[#bd081c] hover:text-white border-[#bd081c]/30 shadow-[#bd081c]/10';
      case 'tiktok':
        return 'bg-[#ff0050]/10 hover:bg-[#ff0050] text-[#ff0050] hover:text-white border-[#ff0050]/30 shadow-[#ff0050]/10';
      default:
        return 'bg-purple-500/10 hover:bg-purple-600 text-purple-400 hover:text-white border-purple-500/20 shadow-purple-500/5';
    }
  };

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
              {['about', 'skills', 'experience', 'projects', 'certifications', 'education', 'contact'].map((item) => (
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
            <div className="flex flex-wrap gap-3">
              {/* GitHub */}
              <a
                href={profile?.social_links?.github || "https://github.com/arunyadaveluvu-png"}
                target="_blank"
                rel="noreferrer"
                className={`p-2.5 rounded-full transition-all duration-300 flex items-center justify-center cursor-pointer border ${getPlatformStyles('github')}`}
                title="GitHub Profile"
              >
                {getSocialIcon('github')}
              </a>

              {/* LinkedIn */}
              <a
                href={profile?.social_links?.linkedin || "https://www.linkedin.com/in/arun-kumar-yeluvu-0b4687373"}
                target="_blank"
                rel="noreferrer"
                className={`p-2.5 rounded-full transition-all duration-300 flex items-center justify-center cursor-pointer border ${getPlatformStyles('linkedin')}`}
                title="LinkedIn Profile"
              >
                {getSocialIcon('linkedin')}
              </a>

              {/* Dynamic Custom Links */}
              {profile?.social_links?.custom_links && profile.social_links.custom_links.map((link: any, idx: number) => (
                <a
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className={`p-2.5 rounded-full transition-all duration-300 flex items-center justify-center cursor-pointer border ${getPlatformStyles(link.platform)}`}
                  title={`${link.platform} Link`}
                >
                  {getSocialIcon(link.platform)}
                </a>
              ))}
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
