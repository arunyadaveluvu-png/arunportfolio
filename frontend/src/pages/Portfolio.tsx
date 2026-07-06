import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../services/api';
import { ParticleBackground } from '../components/ParticleBackground';
import { SkillIcon } from '../components/SkillIcon';
import { 
  FaGithub, FaLinkedin, FaWhatsapp, FaInstagram, 
  FaYoutube, FaFacebook, FaTwitter, FaTelegram, 
  FaDiscord, FaPinterest, FaTiktok 
} from 'react-icons/fa';
import { 
  FiMail, FiPhone, FiMapPin, FiLink, 
  FiSearch, FiArrowRight, FiFileText, FiAward, FiBookOpen, 
  FiCpu, FiSend, FiCheck, FiCalendar, FiArrowUpRight, FiHeart,
  FiX, FiEye, FiDownload, FiBriefcase
} from 'react-icons/fi';

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

// Typing Animation Sub-Component
const TypingTitle: React.FC<{ words: string[] }> = ({ words }) => {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);
  const [blink, setBlink] = useState(true);

  // Blinking cursor
  useEffect(() => {
    const timer = setInterval(() => setBlink(prev => !prev), 500);
    return () => clearInterval(timer);
  }, []);

  // Typing effect
  useEffect(() => {
    if (words.length === 0) return;

    if (subIndex === words[index].length + 1 && !reverse) {
      const timeout = setTimeout(() => setReverse(true), 1500); // Wait before backspacing
      return () => clearTimeout(timeout);
    }

    if (subIndex === 0 && reverse) {
      setReverse(false);
      setIndex((prev) => (prev + 1) % words.length);
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (reverse ? -1 : 1));
    }, reverse ? 40 : 80);

    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse, words]);

  return (
    <span className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-500 bg-clip-text text-transparent min-h-[40px] block">
      {words.length > 0 ? words[index].substring(0, subIndex) : ''}
      <span className={blink ? 'text-purple-400' : 'text-transparent'}>|</span>
    </span>
  );
};
// 3D Tilt Card wrapper for interactive depth parallax
const TiltCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const cardRef = React.useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    const card = cardRef.current;
    if (!card) return;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left - box.width / 2;
    const y = e.clientY - box.top - box.height / 2;
    const factor = 8; // rotation factor
    setRotate({
      x: -(y / (box.height / 2)) * factor,
      y: (x / (box.width / 2)) * factor,
    });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const card = cardRef.current;
    if (!card) return;
    const box = card.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - box.left - box.width / 2;
    const y = touch.clientY - box.top - box.height / 2;
    const factor = 8; // rotation factor
    setRotate({
      x: -(y / (box.height / 2)) * factor,
      y: (x / (box.width / 2)) * factor,
    });
  };

  const handleTouchEnd = () => {
    setRotate({ x: 0, y: 0 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={`transition-transform duration-200 ease-out preserve-3d ${className}`}
      style={{
        transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
      }}
    >
      {children}
    </div>
  );
};

const parseYearAndType = (yearString: string) => {
  if (!yearString) return { year: '', type: 'cgpa' };
  if (yearString.includes('|')) {
    const [year, type] = yearString.split('|');
    return { year: year.trim(), type: type.trim() };
  }
  return { year: yearString.trim(), type: 'cgpa' };
};

export const Portfolio: React.FC = () => {
  // Database States
  const [profile, setProfile] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [certs, setCerts] = useState<any[]>([]);
  const [education, setEducation] = useState<any[]>([]);
  const [experience, setExperience] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);

  // Interaction States
  const [searchParams, setSearchParams] = useSearchParams();
  const activeSection = searchParams.get('section');
  const navigate = useNavigate();

  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [activeCertModal, setActiveCertModal] = useState<any | null>(null);
  const [showInlinePreview, setShowInlinePreview] = useState(false);
  const [previewBlobUrl, setPreviewBlobUrl] = useState<string>('');
  const [pdfLoading, setPdfLoading] = useState(false);

  const closeCertModal = () => {
    setActiveCertModal(null);
    setShowInlinePreview(false);
    if (previewBlobUrl) {
      window.URL.revokeObjectURL(previewBlobUrl);
      setPreviewBlobUrl('');
    }
  };

  const handlePreviewClick = async (certPdf: string) => {
    setPdfLoading(true);
    try {
      const response = await fetch(certPdf);
      const blob = await response.blob();
      const viewBlob = new Blob([blob], { type: 'application/pdf' });
      const viewUrl = window.URL.createObjectURL(viewBlob);
      setPreviewBlobUrl(viewUrl);
      setShowInlinePreview(true);
    } catch (error) {
      console.error(error);
      window.open(certPdf, '_blank');
    } finally {
      setPdfLoading(false);
    }
  };

  const [projectSearch, setProjectSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Contact Form States
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactStatus, setContactStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    // Static Fallback Data in case API is empty or tables are not created yet
    const defaultProfile = {
      name: 'Arun',
      title: 'Aspiring Data Analyst | AI & ML Enthusiast | Full Stack Developer',
      biography: 'I am a passionate data analyst and AI/ML enthusiast focused on turning complex data into actionable insights.',
      email: 'arunkumar.yeluvu@example.com',
      phone: '',
      location: 'India',
      social_links: {
        github: 'https://github.com/arunyadaveluvu-png',
        linkedin: 'https://www.linkedin.com/in/arun-kumar-yeluvu-0b4687373'
      }
    };

    const defaultProjects = [
      {
        id: '1',
        title: 'Sales Performance Analytics Dashboard',
        description: 'A comprehensive Excel and Power BI project that processes raw retail data to track revenues, customer demographics, and product returns.',
        technologies: ['Excel', 'Power BI', 'SQL'],
        github_url: 'https://github.com/arunyadaveluvu-png',
        live_url: '',
        category: 'Data Analytics',
        completion_date: '2025-11-20',
        image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: '2',
        title: 'Heart Disease Prediction Model',
        description: 'Developed a binary classification model using Random Forest and XGBoost to predict heart disease risks based on patient clinical parameters.',
        technologies: ['Python', 'Scikit-Learn', 'Pandas', 'Matplotlib'],
        github_url: 'https://github.com/arunyadaveluvu-png',
        live_url: '',
        category: 'AI & Machine Learning',
        completion_date: '2026-02-15',
        image_url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: '3',
        title: 'AI-Powered Code Assistant',
        description: 'Created a React web application integrated with an Express/Node backend that uses OpenAI LLM embeddings to suggest code optimizations.',
        technologies: ['React', 'Node.js', 'Express', 'Tailwind CSS', 'OpenAI'],
        github_url: 'https://github.com/arunyadaveluvu-png',
        live_url: '',
        category: 'Web Development',
        completion_date: '2026-05-10',
        image_url: 'https://images.unsplash.com/photo-1618401471353-b98aedd07871?auto=format&fit=crop&w=800&q=80'
      }
    ];

    const defaultSkills = [
      { id: '1', name: 'Python', category: 'Programming', proficiency: 90, icon_name: 'SiPython' },
      { id: '2', name: 'C', category: 'Programming', proficiency: 75, icon_name: 'SiC' },
      { id: '3', name: 'C++', category: 'Programming', proficiency: 80, icon_name: 'SiCplusplus' },
      { id: '4', name: 'Java', category: 'Programming', proficiency: 70, icon_name: 'DiJava' },
      { id: '5', name: 'HTML5', category: 'Web Development', proficiency: 95, icon_name: 'SiHtml5' },
      { id: '6', name: 'CSS3', category: 'Web Development', proficiency: 90, icon_name: 'SiCss3' },
      { id: '7', name: 'JavaScript', category: 'Web Development', proficiency: 85, icon_name: 'SiJavascript' },
      { id: '8', name: 'React', category: 'Web Development', proficiency: 80, icon_name: 'FaReact' },
      { id: '9', name: 'Node.js', category: 'Web Development', proficiency: 75, icon_name: 'FaNodeJs' },
      { id: '10', name: 'SQL', category: 'Database', proficiency: 90, icon_name: 'DiDatabase' },
      { id: '11', name: 'MySQL', category: 'Database', proficiency: 85, icon_name: 'SiMysql' },
      { id: '12', name: 'MongoDB', category: 'Database', proficiency: 75, icon_name: 'SiMongodb' },
      { id: '13', name: 'Supabase', category: 'Database', proficiency: 80, icon_name: 'SiSupabase' },
      { id: '14', name: 'Excel', category: 'Data Analytics', proficiency: 90, icon_name: 'SiMicrosoftexcel' },
      { id: '15', name: 'Power BI', category: 'Data Analytics', proficiency: 85, icon_name: 'SiPowerbi' },
      { id: '16', name: 'Tableau', category: 'Data Analytics', proficiency: 80, icon_name: 'SiTableau' },
      { id: '17', name: 'Pandas', category: 'Data Analytics', proficiency: 85, icon_name: 'SiPandas' },
      { id: '18', name: 'NumPy', category: 'Data Analytics', proficiency: 80, icon_name: 'SiNumpy' },
      { id: '19', name: 'Matplotlib', category: 'Data Analytics', proficiency: 75, icon_name: 'SiMatplotlib' },
      { id: '20', name: 'Scikit-Learn', category: 'AI & Machine Learning', proficiency: 80, icon_name: 'SiScikitlearn' },
      { id: '21', name: 'TensorFlow', category: 'AI & Machine Learning', proficiency: 75, icon_name: 'SiTensorflow' },
      { id: '22', name: 'Machine Learning', category: 'AI & Machine Learning', proficiency: 85, icon_name: 'GiArtificialIntelligence' },
      { id: '23', name: 'Deep Learning', category: 'AI & Machine Learning', proficiency: 70, icon_name: 'GiBrain' },
      { id: '24', name: 'Git', category: 'Tools', proficiency: 85, icon_name: 'FaGitAlt' },
      { id: '25', name: 'GitHub', category: 'Tools', proficiency: 90, icon_name: 'FaGithub' },
      { id: '26', name: 'VS Code', category: 'Tools', proficiency: 95, icon_name: 'DiVisualstudio' },
      { id: '27', name: 'Postman', category: 'Tools', proficiency: 80, icon_name: 'SiPostman' }
    ];

    const defaultCerts = [
      { id: '1', name: 'Google Data Analytics Professional Certificate', organization: 'Coursera - Google', issue_date: '2025-08-14', credential_id: 'GDA-10928374', verification_url: 'https://coursera.org/verify/gda10928374' },
      { id: '2', name: 'Machine Learning Specialization', organization: 'Coursera - DeepLearning.AI', issue_date: '2026-01-05', credential_id: 'ML-98273641', verification_url: 'https://coursera.org/verify/ml98273641' }
    ];

    const defaultEducation = [
      { id: '1', degree: 'Bachelor of Technology in Computer Science', college: 'Kalinga Institute of Industrial Technology', university: 'KIIT University', year: '2021 - 2025', cgpa: 8.92 },
      { id: '2', degree: 'Higher Secondary Education (Class XII)', college: 'DAV Public School', university: 'CBSE', year: '2019 - 2021', cgpa: 9.40 }
    ];


    // 1. Fetch all portfolio database modules independently
    const loadPortfolioData = async () => {
      // Load Profile
      try {
        const profileData = await api.profile.get();
        setProfile(profileData || defaultProfile);
      } catch (err) {
        console.warn('Failed to load profile from database. Using fallback details.');
        setProfile(defaultProfile);
      }

      // Load Projects
      try {
        const projectsData = await api.projects.getAll();
        setProjects(projectsData && projectsData.length > 0 ? projectsData : defaultProjects);
      } catch (err) {
        console.warn('Failed to load projects. Using fallback.');
        setProjects(defaultProjects);
      }

      // Load Skills
      try {
        const skillsData = await api.skills.getAll();
        setSkills(skillsData && skillsData.length > 0 ? skillsData : defaultSkills);
      } catch (err) {
        console.warn('Failed to load skills. Using fallback.');
        setSkills(defaultSkills);
      }

      // Load Certificates
      try {
        const certsData = await api.certificates.getAll();
        setCerts(certsData && certsData.length > 0 ? certsData : defaultCerts);
      } catch (err) {
        console.warn('Failed to load certificates. Using fallback.');
        setCerts(defaultCerts);
      }

      // Load Education
      try {
        const eduData = await api.education.getAll();
        setEducation(eduData && eduData.length > 0 ? eduData : defaultEducation);
      } catch (err) {
        console.warn('Failed to load education timeline. Using fallback.');
        setEducation(defaultEducation);
      }

      // Load Experience
      try {
        const expData = await api.experience.getAll();
        setExperience(expData || []);
      } catch (err) {
        console.warn('Failed to load experience timeline.');
        setExperience([]);
      }

      // Load Settings
      try {
        const settingsData = await api.settings.get();
        setSettings(settingsData);
        if (settingsData?.title) {
          document.title = settingsData.title;
        }
      } catch (err) {
        console.warn('Failed to load settings.');
      }
    };
    
    loadPortfolioData();

    // 2. Log page visit analytics to Express
    api.logVisit('Portfolio Home Page');
  }, []);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitting(true);
    setContactStatus('idle');

    try {
      await api.submitContact({
        name: contactName,
        email: contactEmail,
        subject: contactSubject,
        message: contactMessage
      });
      
      setContactStatus('success');
      setContactName('');
      setContactEmail('');
      setContactSubject('');
      setContactMessage('');
    } catch (err) {
      console.error(err);
      setContactStatus('error');
    } finally {
      setContactSubmitting(false);
    }
  };

  // Group skills by category
  const skillCategories = ['Programming', 'Web Development', 'Database', 'Data Analytics', 'AI & Machine Learning', 'Tools'];
  
  // Filter projects
  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(projectSearch.toLowerCase()) || 
                          p.description.toLowerCase().includes(projectSearch.toLowerCase()) ||
                          p.technologies.some((t: string) => t.toLowerCase().includes(projectSearch.toLowerCase()));
    
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  // Unique categories in projects
  const projectCategories = ['All', ...Array.from(new Set(projects.map(p => p.category)))];

  // Helper values
  const defaultWords = ['Aspiring Data Analyst', 'AI & ML Enthusiast', 'Full Stack Developer'];
  const typingWords = profile?.title ? profile.title.split('|').map((t: string) => t.trim()) : defaultWords;

  const showBanner = profile?.social_links?.show_banner !== false;

    const renderSection = (section: string, isSubPage = false) => {
      switch (section) {
        case 'about':
          return (
            <section id="about" className={isSubPage ? "relative py-12 px-4 sm:px-6 lg:px-8" : "relative py-28 px-4 sm:px-6 lg:px-8 z-10 border-t border-white/5 bg-[#02000a]/20"}>
              <div className="max-w-6xl mx-auto animate-fade-in">
                <div className="text-center mb-16 space-y-2">
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">About Me</h2>
                  <div className="h-1.5 w-16 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
                  <div className="lg:col-span-2 space-y-6">
                    <h3 className="text-xl font-bold text-white tracking-tight">My Journey</h3>
                    <p className="text-gray-200 text-sm sm:text-md leading-relaxed whitespace-pre-line">
                      {profile?.biography || 'I am a highly motivated student/professional looking to build a career in data engineering, machine learning research, and front-end development. My objective is to leverage mathematical models and analytical applications to build software assets that resolve tangible real-world inquiries.'}
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                      <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-3">
                        <h4 className="text-xs font-bold text-purple-300 uppercase tracking-widest">Interests</h4>
                        <div className="flex flex-wrap gap-2 animate-fade-in">
                          {profile?.social_links?.interests && profile.social_links.interests.length > 0 ? (
                            profile.social_links.interests.map((interest: string, idx: number) => (
                              <span key={idx} className="text-[10px] px-2.5 py-1 rounded-xl bg-purple-500/10 text-purple-200 border border-purple-500/25 font-semibold">
                                {interest}
                              </span>
                            ))
                          ) : (
                            <>
                              <span className="text-[10px] px-2.5 py-1 rounded-xl bg-purple-500/10 text-purple-200 border border-purple-500/25 font-semibold">Machine Learning & Neural Networks</span>
                              <span className="text-[10px] px-2.5 py-1 rounded-xl bg-purple-500/10 text-purple-200 border border-purple-500/25 font-semibold">Business Intelligence & Dashboard Drafting</span>
                              <span className="text-[10px] px-2.5 py-1 rounded-xl bg-purple-500/10 text-purple-200 border border-purple-500/25 font-semibold">Quantitative Trading Algorithms</span>
                              <span className="text-[10px] px-2.5 py-1 rounded-xl bg-purple-500/10 text-purple-200 border border-purple-500/25 font-semibold">Full-Stack App Engineering</span>
                            </>
                          )}
                        </div>
                      </div>
                      
                      <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-3">
                        <h4 className="text-xs font-bold text-blue-300 uppercase tracking-widest">Languages Known</h4>
                        <div className="flex flex-wrap gap-2 animate-fade-in">
                          {profile?.social_links?.languages && profile.social_links.languages.length > 0 ? (
                            profile.social_links.languages.map((lang: string, idx: number) => (
                              <span key={idx} className="text-[10px] px-2.5 py-1 rounded-xl bg-blue-500/10 text-blue-200 border border-blue-500/25 font-semibold">
                                {lang}
                              </span>
                            ))
                          ) : (
                            <>
                              <span className="text-[10px] px-2.5 py-1 rounded-xl bg-blue-500/10 text-blue-200 border border-blue-500/25 font-semibold">English (Professional)</span>
                              <span className="text-[10px] px-2.5 py-1 rounded-xl bg-blue-500/10 text-blue-200 border border-blue-500/25 font-semibold">Hindi (Native)</span>
                              <span className="text-[10px] px-2.5 py-1 rounded-xl bg-blue-500/10 text-blue-200 border border-blue-500/25 font-semibold">Odia (Conversational)</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-1 glass-panel p-6 rounded-2xl border border-white/5 space-y-6">
                    <h3 className="text-md font-bold text-white tracking-tight">Quick Info</h3>
                    <div className="space-y-4">
                      {profile?.email && (
                        <div className="flex items-center space-x-3 text-xs">
                          <FiMail className="text-purple-400 w-4 h-4 flex-shrink-0" />
                          <span className="text-gray-300 truncate">{profile.email}</span>
                        </div>
                      )}
                      {profile?.phone && (
                        <div className="flex items-center space-x-3 text-xs">
                          <FiPhone className="text-purple-400 w-4 h-4 flex-shrink-0" />
                          <span className="text-gray-300">{profile.phone}</span>
                        </div>
                      )}
                      {profile?.location && (
                        <div className="flex items-center space-x-3 text-xs">
                          <FiMapPin className="text-purple-400 w-4 h-4 flex-shrink-0" />
                          <span className="text-gray-300">{profile.location}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 pt-4 border-t border-white/5">
                      {profile?.social_links?.github && (
                        <a href={profile.social_links.github} target="_blank" rel="noreferrer" className={`p-2 rounded-xl transition-all duration-300 flex-1 flex justify-center items-center cursor-pointer border shadow-md ${getPlatformStyles('github')}`} title="GitHub Profile">
                          {getSocialIcon('github', 'w-4 h-4')}
                        </a>
                      )}
                      {profile?.social_links?.linkedin && (
                        <a href={profile.social_links.linkedin} target="_blank" rel="noreferrer" className={`p-2 rounded-xl transition-all duration-300 flex-1 flex justify-center items-center cursor-pointer border shadow-md ${getPlatformStyles('linkedin')}`} title="LinkedIn Profile">
                          {getSocialIcon('linkedin', 'w-4 h-4')}
                        </a>
                      )}
                      {profile?.social_links?.custom_links && profile.social_links.custom_links.map((link: any, idx: number) => (
                        <a key={idx} href={link.url} target="_blank" rel="noreferrer" className={`p-2 rounded-xl transition-all duration-300 flex-1 flex justify-center items-center cursor-pointer border shadow-md ${getPlatformStyles(link.platform)}`} title={`${link.platform} Link`}>
                          {getSocialIcon(link.platform, 'w-4 h-4')}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          );
        case 'skills':
          return (
            <div className="animate-fade-in">
              <section id="skills" className={isSubPage ? "relative py-12 px-4 sm:px-6 lg:px-8" : "relative py-28 px-4 sm:px-6 lg:px-8 z-10 border-t border-white/5"}>
                <div className="max-w-6xl mx-auto">
                  <div className="text-center mb-16 space-y-2">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Skills Inventory</h2>
                    <div className="h-1.5 w-16 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {skillCategories.map((cat, idx) => {
                      const catSkills = skills.filter(s => s.category === cat);
                      if (catSkills.length === 0) return null;
                      return (
                        <div 
                          key={cat} 
                          className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col justify-between"
                        >
                          <div>
                            <h3 className="text-sm font-bold text-white tracking-wider border-b border-white/5 pb-3 mb-4 flex items-center space-x-2">
                              <FiCpu className="w-4 h-4 text-purple-400" />
                              <span>{cat}</span>
                            </h3>
                            <div className="space-y-4">
                              {catSkills.map((skill) => (
                                <div key={skill.id} className="space-y-1.5">
                                  <div className="flex items-center justify-between text-xs font-semibold">
                                    <div className="flex items-center space-x-2 text-gray-100">
                                      <SkillIcon name={skill.icon_name} className="w-4 h-4 text-blue-400" />
                                      <span>{skill.name}</span>
                                    </div>
                                    <span className="text-purple-300 font-bold">{skill.proficiency}%</span>
                                  </div>
                                  <div className="w-full bg-black/40 rounded-full h-1.5 overflow-hidden border border-white/10">
                                    <div 
                                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full"
                                      style={{ width: `${skill.proficiency}%` }}
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>

              <section id="diagnostics" className={isSubPage ? "relative py-12 px-4 sm:px-6 lg:px-8 border-t border-white/5 bg-[#02000a]/10" : "relative py-28 px-4 sm:px-6 lg:px-8 z-10 border-t border-white/5 bg-[#02000a]/10"}>
                <div className="max-w-6xl mx-auto">
                  <div className="text-center mb-16 space-y-2">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Model Diagnostics & Statistics</h2>
                    <p className="text-gray-400 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed mt-2">
                      Neural network learning curves and model performance statistics compiled from recent machine learning test pipelines.
                    </p>
                    <div className="h-1.5 w-16 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full mt-3"></div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <TiltCard className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col justify-between">
                      <div className="mb-4" style={{ transform: 'translateZ(30px)' }}>
                        <h4 className="text-xs font-bold text-purple-400 uppercase tracking-widest">Training Loss Convergence</h4>
                        <p className="text-gray-500 text-[10px] mt-1">Stochastic Gradient Descent (Epochs 1-10)</p>
                      </div>

                      <div className="w-full h-36 mt-4" style={{ transform: 'translateZ(15px)' }}>
                        <svg viewBox="0 0 200 100" className="w-full h-full overflow-visible">
                          <defs>
                            <linearGradient id="trainLossGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                            </linearGradient>
                            <linearGradient id="valLossGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.2" />
                              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                            </linearGradient>
                          </defs>
                          <line x1="0" y1="90" x2="200" y2="90" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
                          <line x1="0" y1="50" x2="200" y2="50" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
                          <line x1="0" y1="10" x2="200" y2="10" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
                          <path d="M 10,85 Q 40,30 90,20 T 190,12" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
                          <path d="M 10,88 Q 45,42 90,28 T 190,19" fill="none" stroke="#8b5cf6" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3,3" />
                          <circle cx="90" cy="20" r="3" fill="#3b82f6" stroke="#030010" strokeWidth="1" />
                          <circle cx="90" cy="28" r="3" fill="#8b5cf6" stroke="#030010" strokeWidth="1" />
                        </svg>
                      </div>

                      <div className="flex items-center justify-between text-[10px] font-semibold text-gray-500 uppercase mt-4" style={{ transform: 'translateZ(20px)' }}>
                        <span className="flex items-center space-x-1">
                          <span className="w-2.5 h-0.5 bg-blue-500 block"></span>
                          <span>Train Loss</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <span className="w-2.5 h-0.5 bg-purple-500 border-dashed block"></span>
                          <span>Val Loss</span>
                        </span>
                      </div>
                    </TiltCard>

                    <TiltCard className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col justify-between">
                      <div className="mb-4" style={{ transform: 'translateZ(30px)' }}>
                        <h4 className="text-xs font-bold text-blue-400 uppercase tracking-widest">Model Precision Metrics</h4>
                        <p className="text-gray-500 text-[10px] mt-1">Binary classification diagnostics</p>
                      </div>

                      <div className="grid grid-cols-3 gap-2 mt-4 text-center" style={{ transform: 'translateZ(20px)' }}>
                        <div className="space-y-2">
                          <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90">
                              <circle cx="32" cy="32" r="26" fill="transparent" stroke="rgba(255,255,255,0.03)" strokeWidth="3" />
                              <circle cx="32" cy="32" r="26" fill="transparent" stroke="#3b82f6" strokeWidth="3.5" strokeDasharray="163" strokeDashoffset="10" strokeLinecap="round" />
                            </svg>
                            <span className="absolute text-[10px] font-bold text-white font-mono">94.2%</span>
                          </div>
                          <p className="text-[10px] font-semibold text-gray-400 uppercase">Accuracy</p>
                        </div>
                        <div className="space-y-2">
                          <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90">
                              <circle cx="32" cy="32" r="26" fill="transparent" stroke="rgba(255,255,255,0.03)" strokeWidth="3" />
                              <circle cx="32" cy="32" r="26" fill="transparent" stroke="#8b5cf6" strokeWidth="3.5" strokeDasharray="163" strokeDashoffset="18" strokeLinecap="round" />
                            </svg>
                            <span className="absolute text-[10px] font-bold text-white font-mono">91.8%</span>
                          </div>
                          <p className="text-[10px] font-semibold text-gray-400 uppercase">Precision</p>
                        </div>
                        <div className="space-y-2">
                          <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90">
                              <circle cx="32" cy="32" r="26" fill="transparent" stroke="rgba(255,255,255,0.03)" strokeWidth="3" />
                              <circle cx="32" cy="32" r="26" fill="transparent" stroke="#ec4899" strokeWidth="3.5" strokeDasharray="163" strokeDashoffset="13" strokeLinecap="round" />
                            </svg>
                            <span className="absolute text-[10px] font-bold text-white font-mono">92.5%</span>
                          </div>
                          <p className="text-[10px] font-semibold text-gray-400 uppercase">F1-Score</p>
                        </div>
                      </div>

                      <div className="text-[9px] text-gray-500 mt-4 leading-relaxed text-center font-medium" style={{ transform: 'translateZ(10px)' }}>
                        Testing run on 25,000 hyperparameter iterations
                      </div>
                    </TiltCard>

                    <TiltCard className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col justify-between">
                      <div className="mb-4" style={{ transform: 'translateZ(30px)' }}>
                        <h4 className="text-xs font-bold text-pink-400 uppercase tracking-widest">Neuron Node Activation</h4>
                        <p className="text-gray-500 text-[10px] mt-1">Top feature input vector coefficients</p>
                      </div>

                      <div className="space-y-2.5 mt-2" style={{ transform: 'translateZ(20px)' }}>
                        {[
                          { name: 'Feature Engineering', val: 92, color: 'from-blue-500 to-purple-500' },
                          { name: 'Model Tuning', val: 78, color: 'from-purple-500 to-pink-500' },
                          { name: 'Data Pipeline clean', val: 65, color: 'from-pink-500 to-red-500' },
                          { name: 'Exploratory Analytics', val: 50, color: 'from-blue-400 to-teal-400' }
                        ].map((feat, idx) => (
                          <div key={idx} className="space-y-1">
                            <div className="flex items-center justify-between text-[9px] font-bold">
                              <span className="text-gray-300 uppercase tracking-wider">{feat.name}</span>
                              <span className="text-gray-400">{feat.val}%</span>
                            </div>
                            <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden border border-white/5">
                              <div 
                                className={`bg-gradient-to-r ${feat.color} h-full rounded-full`}
                                style={{ width: `${feat.val}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="text-[9px] text-gray-500 mt-4 leading-relaxed text-center font-medium" style={{ transform: 'translateZ(10px)' }}>
                        Weights calculated from Shapley value allocations
                      </div>
                    </TiltCard>
                  </div>
                </div>
              </section>
            </div>
          );
        case 'projects':
          return (
            <section id="projects" className={isSubPage ? "relative py-12 px-4 sm:px-6 lg:px-8" : "relative py-28 px-4 sm:px-6 lg:px-8 z-10 border-t border-white/5 bg-[#02000a]/20"}>
              <div className="max-w-6xl mx-auto animate-fade-in">
                <div className="text-center mb-16 space-y-2">
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Case Studies & Projects</h2>
                  <div className="h-1.5 w-16 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                  <div className="relative flex-1 max-w-md">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                      <FiSearch className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      value={projectSearch}
                      onChange={(e) => setProjectSearch(e.target.value)}
                      placeholder="Search projects by tech, title..."
                      className="block w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/5 focus:border-purple-500/40 text-xs text-white placeholder-gray-600 focus:outline-none transition-all"
                    />
                  </div>

                  <div className="flex flex-wrap gap-2" style={{ perspective: 1000, transformStyle: 'preserve-3d' }}>
                    {projectCategories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border cursor-pointer ${
                          selectedCategory === cat
                            ? 'bg-purple-600/20 text-purple-300 border-purple-500/25 shadow-lg shadow-purple-600/5'
                            : 'bg-white/5 text-gray-400 hover:bg-white/10 border-transparent'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  <AnimatePresence mode="popLayout">
                    {filteredProjects.map((project) => (
                      <div
                        key={project.id}
                        onClick={() => {
                          window.scrollTo({ top: 0, behavior: 'instant' });
                          setSelectedProject(project);
                        }}
                        className="cursor-pointer h-full"
                        style={{ perspective: 1000, transformStyle: 'preserve-3d' }}
                      >
                        <TiltCard className="glass-panel rounded-2xl overflow-hidden border border-white/5 flex flex-col justify-between group glass-panel-hover h-full">
                          <div className="relative h-44 bg-gray-900 overflow-hidden border-b border-white/5" style={{ transform: 'translateZ(10px)' }}>
                            {project.image_url ? (
                              <img src={project.image_url} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-purple-950/20 text-purple-400 text-xs font-bold">Showcase</div>
                            )}
                            <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[9px] font-bold text-purple-300 border border-white/10 uppercase tracking-wider">
                              {project.category}
                            </span>
                          </div>
                          
                          <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                            <div>
                              <h3 className="text-md font-bold text-white group-hover:text-purple-300 transition-colors leading-snug" style={{ transform: 'translateZ(30px)' }}>{project.title}</h3>
                              <p className="text-gray-400 text-xs mt-2 line-clamp-2 leading-relaxed" style={{ transform: 'translateZ(15px)' }}>{project.description}</p>
                              
                              {project.technologies && (
                                <div className="flex flex-wrap gap-1.5 mt-4" style={{ transform: 'translateZ(20px)' }}>
                                  {project.technologies.slice(0, 4).map((tech: string, i: number) => (
                                    <span key={i} className="text-[10px] px-2.5 py-1 rounded bg-white/10 text-gray-200 border border-white/10">
                                      {tech}
                                    </span>
                                  ))}
                                  {project.technologies.length > 4 && (
                                    <span className="text-[10px] px-2.5 py-1 rounded bg-purple-500/20 text-purple-200 border border-purple-500/20 font-bold">
                                      +{project.technologies.length - 4} More
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>

                            <div className="flex items-center justify-between border-t border-white/5 pt-4" style={{ transform: 'translateZ(20px)' }}>
                              {project.completion_date && (
                                <span className="text-[10px] text-gray-500 font-medium">
                                  {new Date(project.completion_date).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })}
                                </span>
                              )}
                              
                              <div className="flex items-center space-x-3">
                                {(project.live_url || project.github_url) && (
                                  <a
                                    href={project.live_url || project.github_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="text-[10px] px-2.5 py-1 rounded bg-purple-600/10 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/20 hover:border-transparent transition-all font-bold flex items-center space-x-1 cursor-pointer"
                                  >
                                    <span>Visit</span>
                                    <FiArrowUpRight className="w-3 h-3" />
                                  </a>
                                )}
                                <span className="text-xs text-purple-300 font-semibold group-hover:translate-x-1 transition-transform flex items-center space-x-1">
                                  <span>Details</span>
                                  <FiArrowRight className="w-3.5 h-3.5" />
                                </span>
                              </div>
                            </div>
                          </div>
                        </TiltCard>
                      </div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </section>
          );
        case 'certifications':
          return (
            <section id="certifications" className={isSubPage ? "relative py-12 px-4 sm:px-6 lg:px-8" : "relative py-28 px-4 sm:px-6 lg:px-8 z-10 border-t border-white/5"}>
              <div className="max-w-6xl mx-auto animate-fade-in">
                <div className="text-center mb-16 space-y-2">
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Credentials & Honors</h2>
                  <div className="h-1.5 w-16 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {certs.map((cert, idx) => {
                    const { image, pdf, drive } = (() => {
                      if (!cert.image_url) return { image: '', pdf: '', drive: '' };
                      if (cert.image_url.includes('|')) {
                        const parts = cert.image_url.split('|');
                        return {
                          image: parts[0]?.trim() || '',
                          pdf: parts[1]?.trim() || '',
                          drive: parts[2]?.trim() || ''
                        };
                      }
                      if (cert.image_url.toLowerCase().includes('.pdf')) {
                        return { image: '', pdf: cert.image_url.trim(), drive: '' };
                      }
                      return { image: cert.image_url.trim(), pdf: '', drive: '' };
                    })();

                    const finalPdf = pdf || (cert.verification_url?.toLowerCase().includes('.pdf') ? cert.verification_url : '');
                    const finalDrive = drive || (cert.verification_url?.toLowerCase().includes('drive.google.com') ? cert.verification_url : '');
                    const hasDoc = !!(finalPdf || finalDrive);

                    return (
                      <div 
                        key={cert.id} 
                        className="glass-panel p-5 rounded-2xl border border-white/5 flex flex-row items-center justify-between gap-4 group hover:border-white/10 transition-colors w-full"
                      >
                        <div className="flex flex-row items-center space-x-4 flex-1 min-w-0">
                          <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-purple-500/10 overflow-hidden flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform duration-300">
                            {image ? (
                              <img src={image} alt={cert.name} className="w-full h-full object-cover" />
                            ) : (
                              <FiAward className="w-5 h-5" />
                            )}
                          </div>
                          <div className="text-left flex-1 min-w-0">
                            <h3 className="text-xs sm:text-sm font-bold text-white leading-snug break-words whitespace-normal">{cert.name}</h3>
                            <p className="text-purple-300/80 text-[10px] sm:text-xs font-semibold mt-1 truncate">{cert.organization}</p>
                            {cert.issue_date && (
                              <span className="text-[9px] sm:text-[10px] text-gray-500 block mt-1.5">
                                Issued: {new Date(cert.issue_date).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex-shrink-0 flex items-center">
                          {hasDoc ? (
                            <button
                              onClick={() => {
                                window.scrollTo({ top: 0, behavior: 'instant' });
                                setActiveCertModal({ ...cert, pdf: finalPdf, drive: finalDrive });
                              }}
                              className="px-3.5 py-2 rounded-xl bg-purple-600/10 hover:bg-purple-600/20 text-purple-300 hover:text-white border border-purple-500/25 text-center text-xs font-semibold transition-all flex items-center justify-center space-x-1 cursor-pointer"
                            >
                              <span>Verify</span>
                              <FiArrowUpRight className="w-3 h-3" />
                            </button>
                          ) : cert.verification_url ? (
                            <a
                              href={cert.verification_url}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-purple-600/20 text-gray-300 hover:text-white border border-white/10 text-center text-xs font-semibold transition-all flex items-center justify-center space-x-1 cursor-pointer"
                            >
                              <span>Verify</span>
                              <FiArrowUpRight className="w-3 h-3" />
                            </a>
                          ) : null}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          );
        case 'experience':
          return (
            <section id="experience" className={isSubPage ? "relative py-12 px-4 sm:px-6 lg:px-8" : "relative py-28 px-4 sm:px-6 lg:px-8 z-10 border-t border-white/5 bg-[#02000a]/10"}>
              <div className="max-w-4xl mx-auto animate-fade-in">
                <div className="text-center mb-16 space-y-2">
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Work Experience</h2>
                  <div className="h-1.5 w-16 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full mt-3"></div>
                </div>

                <div className="relative border-l border-white/10 ml-4 md:ml-8 space-y-12">
                  {experience.map((exp, idx) => {
                    const startDisp = exp.start_date ? new Date(exp.start_date).toLocaleDateString(undefined, { year: 'numeric', month: 'short' }) : '';
                    const endDisp = exp.is_current ? 'Present' : (exp.end_date ? new Date(exp.end_date).toLocaleDateString(undefined, { year: 'numeric', month: 'short' }) : '');
                    
                    return (
                      <div 
                        key={exp.id} 
                        className="relative pl-8 md:pl-10"
                      >
                        <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-purple-600 border-4 border-[#030014] shadow-lg shadow-purple-600/30"></div>
                        
                        <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/10 w-fit">
                              {startDisp} - {endDisp}
                            </span>
                            {exp.location && (
                              <span className="text-xs text-gray-400 flex items-center space-x-1">
                                <FiMapPin className="w-3.5 h-3.5 text-purple-400" />
                                <span>{exp.location}</span>
                              </span>
                            )}
                          </div>
                          <div>
                            <h3 className="text-md font-bold text-white leading-snug">{exp.role}</h3>
                            <p className="text-purple-300 text-sm font-semibold mt-0.5">{exp.company}</p>
                          </div>
                          {exp.description && (
                            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                              {exp.description}
                            </p>
                          )}
                          {exp.skills && exp.skills.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-2">
                              {exp.skills.map((skill: string, sIdx: number) => (
                                <span key={sIdx} className="text-[10px] px-2.5 py-1 rounded bg-white/10 text-gray-200 border border-white/10">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          );
        case 'education':
          return (
            <section id="education" className={isSubPage ? "relative py-12 px-4 sm:px-6 lg:px-8" : "relative py-28 px-4 sm:px-6 lg:px-8 z-10 border-t border-white/5 bg-[#02000a]/20"}>
              <div className="max-w-4xl mx-auto animate-fade-in">
                <div className="text-center mb-16 space-y-2">
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Academic History</h2>
                  <div className="h-1.5 w-16 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
                </div>

                <div className="relative border-l border-white/10 ml-4 md:ml-8 space-y-12">
                  {education.map((edu, idx) => {
                    const parsed = parseYearAndType(edu.year);
                    return (
                      <div 
                        key={edu.id} 
                        className="relative pl-8 md:pl-10"
                      >
                        <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-purple-600 border-4 border-[#030014] shadow-lg shadow-purple-600/30"></div>
                        
                        <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/10 w-fit">
                              {parsed.year}
                            </span>
                            {edu.cgpa && (
                              <span className="text-xs text-emerald-400 font-bold font-mono">
                                {parsed.type === 'percentage' 
                                  ? `Percentage: ${(Number(edu.cgpa) * 10).toFixed(1)}%` 
                                  : parsed.type === 'gpa' 
                                    ? `GPA: ${Number(edu.cgpa).toFixed(2)}/4`
                                    : `CGPA: ${Number(edu.cgpa).toFixed(2)}/10`
                                }
                              </span>
                            )}
                          </div>
                          <div>
                            <h3 className="text-md font-bold text-white leading-snug">{edu.degree}</h3>
                            <p className="text-gray-300 text-sm mt-1">{edu.college}</p>
                            {edu.university && (
                              <p className="text-gray-500 text-xs mt-0.5">{edu.university}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          );
        case 'contact':
          return (
            <section id="contact" className={isSubPage ? "relative py-12 px-4 sm:px-6 lg:px-8" : "relative py-28 px-4 sm:px-6 lg:px-8 z-10 border-t border-white/5"}>
              <div className="max-w-6xl mx-auto animate-fade-in">
                <div className="text-center mb-16 space-y-2">
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Get In Touch</h2>
                  <div className="h-1.5 w-16 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start mt-12">
                  <div className="lg:col-span-2 space-y-6">
                    <h3 className="text-xl font-bold text-white tracking-tight">Collaboration & Inquiries</h3>
                    <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                      Have an interesting project, internship position, or simply want to connect? Drop a message and I will reply as soon as possible.
                    </p>
                    
                    <div className="space-y-4 pt-4 border-t border-white/5">
                      {profile?.email && (
                        <div className="flex items-center space-x-4">
                          <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/10">
                            <FiMail className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Email</p>
                            <a href={`mailto:${profile.email}`} className="text-sm font-semibold text-purple-300 hover:underline break-all">{profile.email}</a>
                          </div>
                        </div>
                      )}

                      {profile?.location && (
                        <div className="flex items-center space-x-4">
                          <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/10">
                            <FiMapPin className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Location</p>
                            <span className="text-sm font-semibold text-white">{profile.location}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 pt-6 border-t border-white/5">
                      {profile?.social_links?.github && (
                        <a href={profile.social_links.github} target="_blank" rel="noreferrer" className={`p-3 rounded-xl transition-all duration-300 flex-1 flex justify-center items-center cursor-pointer border shadow-md ${getPlatformStyles('github')}`} title="GitHub Profile">
                          {getSocialIcon('github', 'w-5 h-5')}
                        </a>
                      )}
                      {profile?.social_links?.linkedin && (
                        <a href={profile.social_links.linkedin} target="_blank" rel="noreferrer" className={`p-3 rounded-xl transition-all duration-300 flex-1 flex justify-center items-center cursor-pointer border shadow-md ${getPlatformStyles('linkedin')}`} title="LinkedIn Profile">
                          {getSocialIcon('linkedin', 'w-5 h-5')}
                        </a>
                      )}
                      {profile?.social_links?.custom_links && profile.social_links.custom_links.map((link: any, idx: number) => (
                        <a key={idx} href={link.url} target="_blank" rel="noreferrer" className={`p-3 rounded-xl transition-all duration-300 flex-1 flex justify-center items-center cursor-pointer border shadow-md ${getPlatformStyles(link.platform)}`} title={`${link.platform} Link`}>
                          {getSocialIcon(link.platform, 'w-5 h-5')}
                        </a>
                      ))}
                    </div>
                  </div>

                  <div className="lg:col-span-3 glass-panel p-8 rounded-2xl border border-white/5">
                    <form onSubmit={handleContactSubmit} className="space-y-6">
                      {contactStatus === 'success' && (
                        <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/25 text-emerald-300 text-xs flex items-center space-x-2">
                          <FiCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                          <span>Your message has been submitted and logged. Thank you!</span>
                        </div>
                      )}

                      {contactStatus === 'error' && (
                        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/25 text-red-300 text-xs">
                          Failed to submit message. Please try again.
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Your Name</label>
                          <input
                            type="text"
                            required
                            value={contactName}
                            onChange={(e) => setContactName(e.target.value)}
                            placeholder="Jane Doe"
                            className="block w-full px-4 py-3 rounded-xl bg-black/40 border border-white/5 focus:border-purple-500/40 text-xs text-white placeholder-gray-600 focus:outline-none transition-all"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Email Address</label>
                          <input
                            type="email"
                            required
                            value={contactEmail}
                            onChange={(e) => setContactEmail(e.target.value)}
                            placeholder="jane@example.com"
                            className="block w-full px-4 py-3 rounded-xl bg-black/40 border border-white/5 focus:border-purple-500/40 text-xs text-white placeholder-gray-600 focus:outline-none transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Subject</label>
                        <input
                          type="text"
                          required
                          value={contactSubject}
                          onChange={(e) => setContactSubject(e.target.value)}
                          placeholder="e.g. Internship Inquiry"
                          className="block w-full px-4 py-3 rounded-xl bg-black/40 border border-white/5 focus:border-purple-500/40 text-xs text-white placeholder-gray-600 focus:outline-none transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Message</label>
                        <textarea
                          required
                          value={contactMessage}
                          onChange={(e) => setContactMessage(e.target.value)}
                          placeholder="Draft your message details..."
                          rows={5}
                          className="block w-full px-4 py-3 rounded-xl bg-black/40 border border-white/5 focus:border-purple-500/40 text-xs text-white placeholder-gray-600 focus:outline-none transition-all resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={contactSubmitting}
                        className="w-full sm:w-auto px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs tracking-wider uppercase transition-all duration-300 shadow-lg shadow-purple-600/20 disabled:opacity-50 cursor-pointer flex items-center justify-center space-x-2"
                      >
                        {contactSubmitting ? (
                          <>
                            <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span>Sending...</span>
                          </>
                        ) : (
                          <>
                            <FiSend className="w-3.5 h-3.5" />
                            <span>Send Message</span>
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </section>
          );
        default:
          return null;
      }
    };

  // Immersive sub-pages for Projects and Certificates
  if (selectedProject) {
    return (
      <div className="relative min-h-screen bg-[#030014] text-gray-200 flex flex-col justify-between z-50">
        {/* Particle Canvas */}
        <div className="absolute inset-0 z-0">
          <ParticleBackground />
        </div>

        {/* Decorative Orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-purple-900/10 via-blue-900/5 to-transparent blur-[120px] pointer-events-none z-0"></div>

        {/* Header with Back Button */}
        <header className="sticky top-0 left-0 w-full z-50 glass-panel py-4 px-6 flex items-center justify-between border-b border-white/5 backdrop-blur-md">
          <button
            onClick={() => setSelectedProject(null)}
            className="flex items-center space-x-2 px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs font-bold hover:bg-purple-500/20 hover:text-white transition-all duration-300 cursor-pointer"
          >
            <span>&larr; Back to Portfolio</span>
          </button>
          <span className="text-sm font-extrabold tracking-widest bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent uppercase">
            Project Overview
          </span>
          <div className="w-28 hidden sm:block"></div> {/* spacer */}
        </header>

        {/* Project Content */}
        <main className="relative z-10 flex-1 max-w-4xl w-full mx-auto px-4 py-12 space-y-8 animate-fade-in">
          {/* Main Card with Image */}
          <div className="glass-panel rounded-3xl overflow-hidden border border-white/10 relative h-[40vh] sm:h-[50vh] flex items-center justify-center">
            {selectedProject.image_url ? (
              <img
                src={selectedProject.image_url}
                alt={selectedProject.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-purple-950/20 flex items-center justify-center text-purple-300 font-bold uppercase tracking-wider">
                {selectedProject.title}
              </div>
            )}
            <span className="absolute bottom-6 left-6 px-4 py-2 rounded-full bg-black/70 backdrop-blur-md text-xs font-bold text-purple-300 border border-white/15 uppercase tracking-wider">
              {selectedProject.category}
            </span>
          </div>

          <div className="space-y-6">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">{selectedProject.title}</h1>
            {selectedProject.completion_date && (
              <div className="flex items-center space-x-2 text-sm text-gray-500 mt-2 font-medium">
                <FiCalendar className="w-4 h-4" />
                <span>Completed: {new Date(selectedProject.completion_date).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })}</span>
              </div>
            )}

            <div className="border-t border-white/5 pt-6 space-y-3">
              <h2 className="text-sm font-bold text-purple-300 tracking-wider uppercase">Project Details</h2>
              <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                {selectedProject.description}
              </p>
            </div>

            {selectedProject.technologies && (
              <div className="border-t border-white/5 pt-6 space-y-3">
                <h2 className="text-sm font-bold text-purple-300 tracking-wider uppercase">Technologies Used</h2>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.technologies.map((tech: string, i: number) => (
                    <span key={i} className="text-xs px-3.5 py-1.5 rounded-full bg-white/5 text-gray-300 border border-white/5 font-semibold">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="border-t border-white/5 pt-8 flex items-center space-x-4">
              {selectedProject.github_url && (
                <a
                  href={selectedProject.github_url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white text-white hover:text-black text-xs font-bold tracking-wider uppercase transition-all border border-white/20 flex items-center space-x-2 cursor-pointer shadow-md shadow-white/5"
                >
                  <FaGithub className="w-4 h-4" />
                  <span>GitHub Repository</span>
                </a>
              )}
              {selectedProject.live_url && (
                <a
                  href={selectedProject.live_url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold tracking-wider uppercase transition-all flex items-center space-x-2 shadow-lg shadow-purple-600/20 cursor-pointer"
                >
                  <FiLink className="w-4 h-4" />
                  <span>Live Demo</span>
                </a>
              )}
            </div>
          </div>
        </main>

        {/* Unified Copyright Footer */}
        <footer className="relative z-10 w-full py-8 border-t border-white/5 bg-[#02000a] text-center mt-16">
          <p 
            onClick={() => navigate('/login')} 
            className="text-gray-400 text-sm font-medium tracking-tight text-center cursor-pointer select-none hover:text-gray-300 transition-colors"
          >
            Copy-right &copy; Arun. Made with <span className="inline-block animate-pulse text-red-500">💖</span> by <span className="font-bold underline text-white">Arun Software Solutions</span>
          </p>
        </footer>
      </div>
    );
  }

  if (activeCertModal) {
    return (
      <div className="relative min-h-screen bg-[#030014] text-gray-200 flex flex-col justify-between z-50">
        {/* Particle Canvas */}
        <div className="absolute inset-0 z-0">
          <ParticleBackground />
        </div>

        {/* Decorative Orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-purple-900/10 via-blue-900/5 to-transparent blur-[120px] pointer-events-none z-0"></div>

        {/* Header with Back Button */}
        <header className="sticky top-0 left-0 w-full z-50 glass-panel py-4 px-6 flex items-center justify-between border-b border-white/5 backdrop-blur-md">
          <button
            onClick={closeCertModal}
            className="flex items-center space-x-2 px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs font-bold hover:bg-purple-500/20 hover:text-white transition-all duration-300 cursor-pointer"
          >
            <span>&larr; Back to Portfolio</span>
          </button>
          <span className="text-sm font-extrabold tracking-widest bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent uppercase">
            Certificate Credentials
          </span>
          <div className="w-28 hidden sm:block"></div> {/* spacer */}
        </header>

        {/* Certificate Content */}
        <main className="relative z-10 flex-1 max-w-4xl w-full mx-auto px-4 py-12 space-y-8 animate-fade-in flex flex-col justify-center">
          <div className="glass-panel p-8 rounded-3xl border border-white/10 space-y-6 flex-1 flex flex-col justify-between">
            <div className="flex items-start justify-between border-b border-white/5 pb-6">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400 flex-shrink-0">
                  <FiAward className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-white tracking-tight">{activeCertModal.name}</h3>
                  <p className="text-purple-300 text-sm font-semibold mt-1">{activeCertModal.organization}</p>
                </div>
              </div>
            </div>

            {showInlinePreview && previewBlobUrl ? (
              <div className="space-y-6 flex-1 flex flex-col">
                <div className="w-full flex-1 min-h-[50vh] bg-black/40 rounded-xl overflow-hidden border border-white/5 relative">
                  <iframe
                    src={`${previewBlobUrl}#toolbar=0`}
                    className="w-full h-full border-none absolute inset-0"
                    title="Certificate PDF Preview"
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowInlinePreview(false)}
                    className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-semibold text-xs border border-white/10 transition-all cursor-pointer"
                  >
                    Back to Options
                  </button>
                  <button
                    onClick={async () => {
                      const link = document.createElement('a');
                      link.href = previewBlobUrl;
                      link.setAttribute('download', `${activeCertModal.name.replace(/\s+/g, '_')}_Certificate.pdf`);
                      document.body.appendChild(link);
                      link.click();
                      link.remove();
                    }}
                    className="flex-1 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-all cursor-pointer animate-pulse-glow"
                  >
                    Download PDF Document
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4 max-w-md mx-auto w-full py-12">
                {/* Preview Option */}
                {activeCertModal.drive ? (
                  <a
                    href={activeCertModal.drive}
                    target="_blank"
                    rel="noreferrer"
                    onClick={closeCertModal}
                    className="flex items-center justify-center space-x-2 w-full py-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-all duration-300 shadow-lg shadow-purple-600/20 cursor-pointer text-center text-decoration-none"
                  >
                    <FiEye className="w-4 h-4" />
                    <span>Preview Certificate (Google Drive)</span>
                  </a>
                ) : activeCertModal.pdf ? (
                  <button
                    disabled={pdfLoading}
                    onClick={() => handlePreviewClick(activeCertModal.pdf)}
                    className="flex items-center justify-center space-x-2 w-full py-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-all duration-300 shadow-lg shadow-purple-600/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {pdfLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <FiEye className="w-4 h-4" />
                    )}
                    <span>{pdfLoading ? 'Loading Preview...' : 'Preview Certificate'}</span>
                  </button>
                ) : null}

                {/* Download Option */}
                {activeCertModal.pdf ? (
                  <button
                    onClick={async () => {
                      try {
                        const response = await fetch(activeCertModal.pdf);
                        const blob = await response.blob();
                        const url = window.URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.href = url;
                        link.setAttribute('download', `${activeCertModal.name.replace(/\s+/g, '_')}_Certificate.pdf`);
                        document.body.appendChild(link);
                        link.click();
                        link.remove();
                        window.URL.revokeObjectURL(url);
                      } catch (error) {
                        window.open(activeCertModal.pdf, '_blank');
                      }
                      closeCertModal();
                    }}
                    className="flex items-center justify-center space-x-2 w-full py-4 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 font-semibold text-xs transition-all duration-300 cursor-pointer"
                  >
                    <FiDownload className="w-4 h-4 text-purple-400" />
                    <span>Download PDF Document</span>
                  </button>
                ) : activeCertModal.drive ? (
                  <a
                    href={activeCertModal.drive}
                    target="_blank"
                    rel="noreferrer"
                    onClick={closeCertModal}
                    className="flex items-center justify-center space-x-2 w-full py-4 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 font-semibold text-xs transition-all duration-300 cursor-pointer text-center text-decoration-none"
                  >
                    <FiDownload className="w-4 h-4 text-purple-400" />
                    <span>View & Download on Drive</span>
                  </a>
                ) : null}

                {activeCertModal.verification_url && !activeCertModal.verification_url.toLowerCase().includes('drive.google.com') && (
                  <a
                    href={activeCertModal.verification_url}
                    target="_blank"
                    rel="noreferrer"
                    onClick={closeCertModal}
                    className="flex items-center justify-center space-x-1.5 text-xs text-blue-400 hover:text-blue-300 font-semibold transition-colors mt-4 text-center mx-auto"
                  >
                    <span>Go to official Verification page</span>
                    <FiArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            )}
          </div>
        </main>

        {/* Unified Copyright Footer */}
        <footer className="relative z-10 w-full py-8 border-t border-white/5 bg-[#02000a] text-center mt-16">
          <p 
            onClick={() => navigate('/login')} 
            className="text-gray-400 text-sm font-medium tracking-tight text-center cursor-pointer select-none hover:text-gray-300 transition-colors"
          >
            Copy-right &copy; Arun. Made with <span className="inline-block animate-pulse text-red-500">💖</span> by <span className="font-bold underline text-white">Arun Software Solutions</span>
          </p>
        </footer>
      </div>
    );
  }

  if (activeSection) {
    return (
      <div className="relative min-h-screen bg-[#030014] text-gray-200 flex flex-col justify-between z-50 pt-20">
        {/* Particle Canvas */}
        <div className="absolute inset-0 z-0">
          <ParticleBackground />
        </div>

        {/* Decorative Orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-purple-900/10 via-blue-900/5 to-transparent blur-[120px] pointer-events-none z-0"></div>

        {/* Specialized Sub-page Header with Back to Home Button */}
        <header className="sticky top-0 left-0 w-full z-50 glass-panel py-4 px-6 flex items-center justify-between border-b border-white/5 backdrop-blur-md">
          <button
            onClick={() => {
              setSearchParams({});
              window.scrollTo({ top: 0, behavior: 'instant' });
            }}
            className="flex items-center space-x-2 px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs font-bold hover:bg-purple-500/20 hover:text-white transition-all duration-300 cursor-pointer"
          >
            <span>&larr; Back to Home</span>
          </button>
          <span className="text-sm font-extrabold tracking-widest bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent uppercase">
            {activeSection === 'certifications' ? 'Certifications' : activeSection}
          </span>
          <div className="w-28 hidden sm:block"></div> {/* spacer */}
        </header>

        {/* Section Main Content */}
        <main className="relative z-10 flex-1">
          {renderSection(activeSection, true)}
        </main>

        {/* Copyright Footer */}
        <footer className="relative z-10 w-full py-8 border-t border-white/5 bg-[#02000a] text-center mt-16">
          <p 
            onClick={() => navigate('/login')} 
            className="text-gray-400 text-sm font-medium tracking-tight text-center cursor-pointer select-none hover:text-gray-300 transition-colors"
          >
            Copy-right &copy; Arun. Made with <span className="inline-block animate-pulse text-red-500">💖</span> by <span className="font-bold underline text-white">Arun Software Solutions</span>
          </p>
        </footer>
      </div>
    );
  }


  return (
    <div className="relative min-h-screen bg-[#030014] overflow-x-hidden text-gray-200">
      {/* Decorative Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-purple-900/10 via-blue-900/5 to-transparent blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute top-[1200px] right-0 w-[400px] h-[400px] bg-purple-900/5 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute top-[2200px] left-0 w-[450px] h-[450px] bg-blue-900/5 rounded-full blur-[150px] pointer-events-none z-0"></div>

      {/* Cover Banner */}
      {showBanner && (
        <div className="relative w-full h-[200px] sm:h-[280px] md:h-[320px] overflow-hidden z-0">
          {profile?.cover_photo ? (
            <img 
              src={profile.cover_photo} 
              alt="Cover Banner" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-blue-950/40 via-purple-950/40 to-pink-950/40" />
          )}
          {/* Gradients to blend banner to header and main body */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#030014]/60 via-transparent to-[#030014]"></div>
        </div>
      )}

      {/* Particle lines animation canvas */}
      <ParticleBackground />

      {/* ==========================================
          HERO SECTION
          ========================================== */}
      <section 
        id="hero" 
        className={`relative flex items-center justify-center px-4 sm:px-6 lg:px-8 z-10 ${
          showBanner 
            ? 'pt-12 pb-16 min-h-[40vh] sm:min-h-[50vh]' 
            : 'pt-24 pb-12 min-h-screen'
        }`}
      >
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Profile Photo */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`relative w-36 h-36 mx-auto cursor-pointer ${
              showBanner ? '-mt-24 sm:-mt-28' : ''
            }`}
          >
            <TiltCard className="w-full h-full rounded-full p-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-2xl shadow-purple-500/20">
              <div className="w-full h-full rounded-full bg-gray-900 overflow-hidden flex items-center justify-center border-2 border-black" style={{ transform: 'translateZ(30px)' }}>
                {profile?.profile_photo ? (
                  <img src={profile.profile_photo} alt={profile.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-4xl text-purple-400 font-bold" style={{ transform: 'translateZ(15px)' }}>👤</div>
                )}
              </div>
            </TiltCard>
          </motion.div>

          {/* Name & Subtitle */}
          <div className="space-y-4">
            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white"
            >
              Hi, I'm <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-500 bg-clip-text text-transparent">{profile?.name || 'Loading...'}</span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <TypingTitle words={typingWords} />
            </motion.div>
          </div>

          {/* Short Introduction */}
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-gray-400 text-sm sm:text-md max-w-xl mx-auto leading-relaxed"
          >
            {profile?.biography || 'Passionate about translating complex datasets into actionable business intelligence, drafting predictive algorithms, and designing clean interface web portals.'}
          </motion.p>

          {/* Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
            style={{ perspective: 1000, transformStyle: 'preserve-3d' }}
          >
            <motion.button 
              onClick={() => {
                setSearchParams({ section: 'projects' });
                window.scrollTo({ top: 0, behavior: 'instant' });
              }}
              whileTap={{ scale: 0.9, rotateX: -15, rotateY: 15 }}
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-all duration-300 shadow-lg shadow-purple-600/20 text-center tracking-wider cursor-pointer"
            >
              View Projects
            </motion.button>
            {profile?.resume_url && (
              <motion.a 
                href={profile.resume_url}
                target="_blank"
                rel="noreferrer"
                whileTap={{ scale: 0.9, rotateX: -15, rotateY: 15 }}
                className="w-full sm:w-auto px-5 py-3 rounded-full bg-white/5 hover:bg-white/10 text-white font-semibold text-xs transition-all duration-300 border border-white/10 text-center tracking-wider flex items-center justify-center space-x-2 cursor-pointer"
              >
                <FiEye className="w-4 h-4 text-blue-400" />
                <span>View Resume</span>
              </motion.a>
            )}
          </motion.div>
        </div>
      </section>

      {/* Inline scrollable sections on home page */}
      {renderSection('about')}
      {renderSection('skills')}
      {renderSection('experience')}
      {renderSection('projects')}
      {renderSection('certifications')}
      {renderSection('education')}
      {renderSection('contact')}
    </div>
  );
};
export default Portfolio;
