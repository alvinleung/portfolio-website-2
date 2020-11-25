import React from 'react';
import { PageProps } from 'gatsby';
import { motion } from 'framer-motion';
import '../style/typography.scss';
import '../style/layout.scss';

import LandingHero from '@/components/LandingHero';
import ProjectCard from '@/components/ProjectCard';
import Cursor from '@/components/Cursor/Cursor';
import { ProjectInfoCard } from '@/components/ProjectInfoCard/ProjectInfoCard';

const CaseStudy: React.FC<PageProps> = () => (
  <>
    {/* <Cursor /> */}
    <ProjectCard name="HelpMate" isViewing={true}></ProjectCard>
    <motion.main className="full-width nav-padding">
      <ProjectInfoCard name="HelpMate" />
      <div style={{ height: '10rem' }}></div>
    </motion.main>
  </>
);

export default CaseStudy;
