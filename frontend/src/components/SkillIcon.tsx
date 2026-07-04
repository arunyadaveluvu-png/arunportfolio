import React from 'react';
import * as FaIcons from 'react-icons/fa';
import * as SiIcons from 'react-icons/si';
import * as DiIcons from 'react-icons/di';
import * as GiIcons from 'react-icons/gi';

interface SkillIconProps {
  name: string;
  className?: string;
}

export const SkillIcon: React.FC<SkillIconProps> = ({ name, className = "w-6 h-6" }) => {
  // FontAwesome
  if (name.startsWith('Fa')) {
    const IconComponent = (FaIcons as any)[name];
    if (IconComponent) return <IconComponent className={className} />;
  }
  
  // SimpleIcons
  if (name.startsWith('Si')) {
    const IconComponent = (SiIcons as any)[name];
    if (IconComponent) return <IconComponent className={className} />;
  }

  // DevIcons
  if (name.startsWith('Di')) {
    const IconComponent = (DiIcons as any)[name];
    if (IconComponent) return <IconComponent className={className} />;
  }

  // GameIcons
  if (name.startsWith('Gi')) {
    const IconComponent = (GiIcons as any)[name];
    if (IconComponent) return <IconComponent className={className} />;
  }

  // Generic fallback code icon
  return <FaIcons.FaCode className={className} />;
};
export default SkillIcon;
