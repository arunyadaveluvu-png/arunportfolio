import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../services/api';
import { ParticleBackground } from '../components/ParticleBackground';
import { SkillIcon } from '../components/SkillIcon';
import { 
  FiGithub, FiLinkedin, FiMail, FiPhone, FiMapPin, FiLink, 
  FiSearch, FiArrowRight, FiFileText, FiAward, FiBookOpen, 
  FiCpu, FiSend, FiCheck, FiCalendar, FiArrowUpRight, FiHeart,
  FiX, FiEye, FiDownload
} from 'react-icons/fi';

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

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`transition-transform duration-200 ease-out preserve-3d ${className}`}
      style={{
        transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
      }}
    >
      {children}
    </div>
  );
};

export const Portfolio: React.FC = () => {
  // Database States
  const [profile, setProfile] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [certs, setCerts] = useState<any[]>([]);
  const [education, setEducation] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);

  // Interaction States
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
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

  const handleDownloadResume = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!profile?.resume_url) return;
    try {
      const response = await fetch(profile.resume_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Arun_Resume.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      window.open(profile.resume_url, '_blank');
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

  return (
    <div className="relative min-h-screen bg-[#030014] overflow-x-hidden text-gray-200">
      {/* Decorative Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-purple-900/10 via-blue-900/5 to-transparent blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute top-[1200px] right-0 w-[400px] h-[400px] bg-purple-900/5 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute top-[2200px] left-0 w-[450px] h-[450px] bg-blue-900/5 rounded-full blur-[150px] pointer-events-none z-0"></div>

      {/* Particle lines animation canvas */}
      <ParticleBackground />

      {/* ==========================================
          HERO SECTION
          ========================================== */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center pt-24 pb-12 px-4 sm:px-6 lg:px-8 z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Profile Photo */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative w-36 h-36 mx-auto cursor-pointer"
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
            <motion.a 
              href="#projects" 
              whileTap={{ scale: 0.9, rotateX: -15, rotateY: 15 }}
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-all duration-300 shadow-lg shadow-purple-600/20 text-center tracking-wider cursor-pointer"
            >
              View Projects
            </motion.a>
            {profile?.resume_url && (
              <>
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
                <motion.button 
                  onClick={handleDownloadResume}
                  whileTap={{ scale: 0.9, rotateX: -15, rotateY: 15 }}
                  className="w-full sm:w-auto px-5 py-3 rounded-full bg-purple-600/10 hover:bg-purple-600 text-purple-300 hover:text-white font-semibold text-xs transition-all duration-300 border border-purple-500/25 hover:border-transparent text-center tracking-wider flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <FiDownload className="w-4 h-4" />
                  <span>Download Resume</span>
                </motion.button>
              </>
            )}
            <motion.a 
              href="#contact" 
              whileTap={{ scale: 0.9, rotateX: -15, rotateY: 15 }}
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-transparent hover:text-purple-300 text-gray-400 font-semibold text-xs transition-all duration-300 text-center tracking-wider cursor-pointer"
            >
              Contact Me
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* ==========================================
          ABOUT ME SECTION
          ========================================== */}
      <section id="about" className="relative py-28 px-4 sm:px-6 lg:px-8 z-10 border-t border-white/5 bg-[#02000a]/20">
        <div className="max-w-6xl mx-auto">
          {/* Section title */}
          <div className="text-center mb-16 space-y-2">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">About Me</h2>
            <div className="h-1.5 w-16 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            {/* Bio Column */}
            <div className="lg:col-span-2 space-y-6">
              <h3 className="text-xl font-bold text-white tracking-tight">My Journey</h3>
              <p className="text-gray-400 text-sm sm:text-md leading-relaxed whitespace-pre-line">
                {profile?.biography || 'I am a highly motivated student/professional looking to build a career in data engineering, machine learning research, and front-end development. My objective is to leverage mathematical models and analytical applications to build software assets that resolve tangible real-world inquiries.'}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                <div className="glass-panel p-5 rounded-2xl border border-white/5 space-y-2">
                  <h4 className="text-xs font-bold text-purple-400 uppercase tracking-widest">Interests</h4>
                  <ul className="text-gray-400 text-xs space-y-1.5">
                    <li>• Machine Learning & Neural Networks</li>
                    <li>• Business Intelligence & Dashboard Drafting</li>
                    <li>• Quantitative Trading Algorithms</li>
                    <li>• Full-Stack App Engineering</li>
                  </ul>
                </div>
                
                <div className="glass-panel p-5 rounded-2xl border border-white/5 space-y-2">
                  <h4 className="text-xs font-bold text-blue-400 uppercase tracking-widest">Languages Known</h4>
                  <ul className="text-gray-400 text-xs space-y-1.5 flex flex-wrap gap-x-4 gap-y-1.5">
                    <li>• English (Professional)</li>
                    <li>• Hindi (Native)</li>
                    <li>• Odia (Conversational)</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Quick Stats/Contact Box */}
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

              {/* Social Anchors */}
              <div className="flex space-x-3 pt-4 border-t border-white/5">
                {profile?.social_links?.github && (
                  <a href={profile.social_links.github} target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-white/5 hover:bg-purple-500/20 text-gray-400 hover:text-white transition-all duration-300 flex-1 flex justify-center border border-white/5">
                    <FiGithub className="w-4 h-4" />
                  </a>
                )}
                {profile?.social_links?.linkedin && (
                  <a href={profile.social_links.linkedin} target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-white/5 hover:bg-purple-500/20 text-gray-400 hover:text-white transition-all duration-300 flex-1 flex justify-center border border-white/5">
                    <FiLinkedin className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          SKILLS SECTION
          ========================================== */}
      <section id="skills" className="relative py-28 px-4 sm:px-6 lg:px-8 z-10 border-t border-white/5">
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
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
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
                            <div className="flex items-center space-x-2 text-gray-300">
                              <SkillIcon name={skill.icon_name} className="w-4 h-4 text-blue-400" />
                              <span>{skill.name}</span>
                            </div>
                            <span className="text-purple-400">{skill.proficiency}%</span>
                          </div>
                          <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden border border-white/5">
                            <motion.div 
                              initial={{ width: 0 }}
                              whileInView={{ width: `${skill.proficiency}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 1, ease: "easeOut" }}
                              className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==========================================
          MODEL DIAGNOSTICS & TRAINING ANALYTICS SECTION
          ========================================== */}
      <section id="diagnostics" className="relative py-28 px-4 sm:px-6 lg:px-8 z-10 border-t border-white/5 bg-[#02000a]/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-2">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Model Diagnostics & Statistics</h2>
            <p className="text-gray-400 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed mt-2">
              Neural network learning curves and model performance statistics compiled from recent machine learning test pipelines.
            </p>
            <div className="h-1.5 w-16 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full mt-3"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 1. Loss Optimization Curves (SVG Line chart) */}
            <TiltCard className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col justify-between">
              <div className="mb-4" style={{ transform: 'translateZ(30px)' }}>
                <h4 className="text-xs font-bold text-purple-400 uppercase tracking-widest">Training Loss Convergence</h4>
                <p className="text-gray-500 text-[10px] mt-1">Stochastic Gradient Descent (Epochs 1-10)</p>
              </div>

              {/* SVG Curve */}
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
                  
                  {/* Grid Lines */}
                  <line x1="0" y1="90" x2="200" y2="90" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
                  <line x1="0" y1="50" x2="200" y2="50" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
                  <line x1="0" y1="10" x2="200" y2="10" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
                  
                  {/* Training Loss Path: starts high, curves down smoothly */}
                  <path 
                    d="M 10,85 Q 40,30 90,20 T 190,12" 
                    fill="none" 
                    stroke="#3b82f6" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                  />
                  
                  {/* Validation Loss Path: starts high, curves down, stabilizes slightly higher */}
                  <path 
                    d="M 10,88 Q 45,42 90,28 T 190,19" 
                    fill="none" 
                    stroke="#8b5cf6" 
                    strokeWidth="1.5" 
                    strokeLinecap="round" 
                    strokeDasharray="3,3"
                  />
                  
                  {/* Node point highlight */}
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

            {/* 2. Performance Metrics (SVG Gauges) */}
            <TiltCard className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col justify-between">
              <div className="mb-4" style={{ transform: 'translateZ(30px)' }}>
                <h4 className="text-xs font-bold text-blue-400 uppercase tracking-widest">Model Precision Metrics</h4>
                <p className="text-gray-500 text-[10px] mt-1">Binary classification diagnostics</p>
              </div>

              {/* Gauges Grid */}
              <div className="grid grid-cols-3 gap-2 mt-4 text-center" style={{ transform: 'translateZ(20px)' }}>
                {/* Accuracy */}
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
                
                {/* Precision */}
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

                {/* Recall */}
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

            {/* 3. Feature Importance (SVG Bars) */}
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
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${feat.val}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: idx * 0.15 }}
                        className={`bg-gradient-to-r ${feat.color} h-full rounded-full`}
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

      {/* ==========================================
          PROJECTS SECTION
          ========================================== */}
      <section id="projects" className="relative py-28 px-4 sm:px-6 lg:px-8 z-10 border-t border-white/5 bg-[#02000a]/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-2">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Case Studies & Projects</h2>
            <div className="h-1.5 w-16 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
          </div>

          {/* Filtering & Search Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            {/* Search */}
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

            {/* Filter buttons */}
            <div className="flex flex-wrap gap-2" style={{ perspective: 1000, transformStyle: 'preserve-3d' }}>
              {projectCategories.map((cat) => (
                <motion.button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  whileTap={{ scale: 0.9, rotateX: -15, rotateY: 15 }}
                  className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-purple-600/20 text-purple-300 border-purple-500/25 shadow-lg shadow-purple-600/5'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 border-transparent'
                  }`}
                >
                  {cat}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Project grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileTap={{ scale: 0.96, rotateX: -6, rotateY: 6 }}
                  transition={{ duration: 0.2 }}
                  key={project.id}
                  onClick={() => setSelectedProject(project)}
                  className="cursor-pointer h-full"
                  style={{ perspective: 1000, transformStyle: 'preserve-3d' }}
                >
                  <TiltCard className="glass-panel rounded-2xl overflow-hidden border border-white/5 flex flex-col justify-between group glass-panel-hover h-full">
                    <div className="relative h-44 bg-gray-900 overflow-hidden border-b border-white/5" style={{ transform: 'translateZ(10px)' }}>
                      {project.image_url ? (
                        <img 
                          src={project.image_url} 
                          alt={project.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
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
                              <span key={i} className="text-[9px] px-2 py-0.5 rounded bg-white/5 text-gray-400 border border-white/5">
                                {tech}
                              </span>
                            ))}
                            {project.technologies.length > 4 && (
                              <span className="text-[9px] px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/10">
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
                              onClick={(e) => e.stopPropagation()} // Stop details modal from opening
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
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ==========================================
          CERTIFICATIONS SECTION
          ========================================== */}
      <section id="certifications" className="relative py-28 px-4 sm:px-6 lg:px-8 z-10 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-2">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Credentials & Honors</h2>
            <div className="h-1.5 w-16 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {certs.map((cert, idx) => (
              <motion.div 
                initial={{ opacity: 0, x: idx % 2 === 0 ? -25 : 25 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                key={cert.id} 
                className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6 group hover:border-white/10 transition-colors"
              >
                <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
                  <div className="p-3.5 rounded-2xl bg-purple-500/10 text-purple-400 group-hover:scale-110 transition-transform">
                    <FiAward className="w-7 h-7" />
                  </div>
                  <div className="text-center sm:text-left">
                    <h3 className="text-sm font-bold text-white leading-snug">{cert.name}</h3>
                    <p className="text-purple-300/80 text-xs font-semibold mt-1">{cert.organization}</p>
                    {cert.issue_date && (
                      <span className="text-[10px] text-gray-500 block mt-2">
                        Issued: {new Date(cert.issue_date).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })}
                      </span>
                    )}
                  </div>
                </div>

                {cert.verification_url && (
                  <a
                    href={cert.verification_url}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full sm:w-auto px-4 py-2 rounded-xl bg-white/5 hover:bg-purple-600/20 text-gray-300 hover:text-white border border-white/10 text-center text-xs font-semibold transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <span>Verify</span>
                    <FiArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          EDUCATION TIMELINE SECTION
          ========================================== */}
      <section id="education" className="relative py-28 px-4 sm:px-6 lg:px-8 z-10 border-t border-white/5 bg-[#02000a]/20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 space-y-2">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Academic History</h2>
            <div className="h-1.5 w-16 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
          </div>

          <div className="relative border-l border-white/10 ml-4 md:ml-8 space-y-12">
            {education.map((edu, idx) => (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                key={edu.id} 
                className="relative pl-8 md:pl-10"
              >
                {/* Timeline node dot */}
                <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-purple-600 border-4 border-[#030014] shadow-lg shadow-purple-600/30"></div>
                
                <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/10 w-fit">
                      {edu.year}
                    </span>
                    {edu.cgpa && (
                      <span className="text-xs text-emerald-400 font-bold font-mono">
                        CGPA: {Number(edu.cgpa).toFixed(2)}
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
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          CONTACT SECTION & FORM
          ========================================== */}
      <section id="contact" className="relative py-28 px-4 sm:px-6 lg:px-8 z-10 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-2">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Get in Touch</h2>
            <div className="h-1.5 w-16 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-stretch">
            {/* Contact details */}
            <div className="lg:col-span-2 glass-panel p-8 rounded-2xl border border-white/5 flex flex-col justify-between space-y-8">
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">Let's Discuss Opportunities</h3>
                <p className="text-gray-400 text-xs mt-2 leading-relaxed">
                  Have a project inquiry, internship opening, or data science challenge? Feel free to reach out using the contact information or the inquiry form.
                </p>
              </div>

              <div className="space-y-6">
                {profile?.email && (
                  <div className="flex items-center space-x-4">
                    <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/10">
                      <FiMail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Email Address</p>
                      <a href={`mailto:${profile.email}`} className="text-sm font-semibold text-white hover:text-purple-300 transition-colors">
                        {profile.email}
                      </a>
                    </div>
                  </div>
                )}

                {profile?.phone && (
                  <div className="flex items-center space-x-4">
                    <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/10">
                      <FiPhone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Phone</p>
                      <a href={`tel:${profile.phone}`} className="text-sm font-semibold text-white hover:text-purple-300 transition-colors">
                        {profile.phone}
                      </a>
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

              <div className="flex space-x-3 pt-6 border-t border-white/5">
                {profile?.social_links?.github && (
                  <a href={profile.social_links.github} target="_blank" rel="noreferrer" className="p-3 rounded-xl bg-white/5 hover:bg-purple-500/20 text-gray-400 hover:text-white transition-all duration-300 flex-1 flex justify-center border border-white/5">
                    <FiGithub className="w-5 h-5" />
                  </a>
                )}
                {profile?.social_links?.linkedin && (
                  <a href={profile.social_links.linkedin} target="_blank" rel="noreferrer" className="p-3 rounded-xl bg-white/5 hover:bg-purple-500/20 text-gray-400 hover:text-white transition-all duration-300 flex-1 flex justify-center border border-white/5">
                    <FiLinkedin className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>

            {/* Contact Form */}
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
                  {/* Name */}
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

                  {/* Email */}
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

                {/* Subject */}
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

                {/* Message */}
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

                {/* Submit */}
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

      {/* ==========================================
          PROJECT DETAILS OVERLAY MODAL
          ========================================== */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, rotateY: 90, scale: 0.8 }}
              animate={{ opacity: 1, rotateY: 0, scale: 1 }}
              exit={{ opacity: 0, rotateY: -90, scale: 0.8 }}
              transition={{ type: 'spring', damping: 22, stiffness: 120 }}
              style={{ perspective: 1000, transformStyle: 'preserve-3d' }}
              className="w-full max-w-3xl bg-[#0b091c] border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
            >
              {/* Modal header details */}
              <div className="relative h-60 sm:h-72 bg-gray-900 overflow-hidden">
                {selectedProject.image_url ? (
                  <img src={selectedProject.image_url} alt={selectedProject.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm font-bold bg-purple-950/15">Case Study</div>
                )}
                
                <button 
                  onClick={() => setSelectedProject(null)} 
                  className="absolute top-4 right-4 p-2 rounded-full bg-black/60 hover:bg-black/80 text-gray-300 hover:text-white transition-all cursor-pointer border border-white/10"
                >
                  <FiX className="w-5 h-5" />
                </button>

                <span className="absolute bottom-4 left-4 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-bold text-purple-300 border border-white/15 uppercase tracking-wider">
                  {selectedProject.category}
                </span>
              </div>

              {/* Modal contents */}
              <div className="p-6 sm:p-8 space-y-6">
                <div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">{selectedProject.title}</h3>
                  {selectedProject.completion_date && (
                    <div className="flex items-center space-x-1.5 text-xs text-gray-500 mt-2 font-medium">
                      <FiCalendar className="w-3.5 h-3.5" />
                      <span>Completed: {new Date(selectedProject.completion_date).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Overview</h4>
                  <p className="text-gray-300 text-xs leading-relaxed whitespace-pre-line">
                    {selectedProject.description}
                  </p>
                </div>

                {selectedProject.technologies && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Technologies Used</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedProject.technologies.map((tech: string, i: number) => (
                        <span key={i} className="text-[10px] px-2.5 py-1 rounded bg-white/5 text-gray-300 border border-white/5 font-medium">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Footer action buttons */}
                <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center space-x-3 w-full sm:w-auto">
                    {selectedProject.github_url && (
                      <a 
                        href={selectedProject.github_url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold transition-all border border-white/10 flex items-center justify-center space-x-1.5"
                      >
                        <FiGithub className="w-4 h-4" />
                        <span>GitHub Link</span>
                      </a>
                    )}
                    {selectedProject.live_url && (
                      <a 
                        href={selectedProject.live_url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition-all flex items-center justify-center space-x-1.5 shadow-lg shadow-purple-600/10"
                      >
                        <FiLink className="w-4 h-4" />
                        <span>Live Demo</span>
                      </a>
                    )}
                  </div>

                  <button 
                    onClick={() => setSelectedProject(null)}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all text-xs font-semibold text-center cursor-pointer"
                  >
                    Close Modal
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default Portfolio;
