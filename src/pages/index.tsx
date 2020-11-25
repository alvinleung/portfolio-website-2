import React from 'react';
import { PageProps } from 'gatsby';
import '../style/typography.scss';
import '../style/layout.scss';

import LandingHero from '@/components/LandingHero';
import ProjectCard from '@/components/ProjectCard';
import Cursor from '@/components/Cursor/Cursor';

const Home: React.FC<PageProps> = () => (
  <>
    {/* <Cursor /> */}
    <main className="full-width">
      {/* <Title /> */}
      <LandingHero />
      <ProjectCard name="HelpMate"></ProjectCard>
      <ProjectCard name="FreeGeek"></ProjectCard>
    </main>
  </>
);

export default Home;
