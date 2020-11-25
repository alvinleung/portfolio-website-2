import React from 'react';
import { PageProps } from 'gatsby';
import { motion } from 'framer-motion';
import '../style/typography.scss';
import '../style/layout.scss';

import LandingHero from '@/components/LandingHero';
import ProjectCard from '@/components/ProjectCard';
import Cursor from '@/components/Cursor/Cursor';

const CaseStudy: React.FC<PageProps> = () => (
  <>
    {/* <Cursor /> */}
    <motion.main className="full-width">
      test
      <ProjectCard name="HelpMate" isViewing={true}></ProjectCard>
    </motion.main>
  </>
);

export default CaseStudy;
