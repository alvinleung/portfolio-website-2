import React from 'react';
import { PageProps } from 'gatsby';
import '../style/typography.scss';
import '../style/layout.scss';

import LandingHero from '@/components/LandingHero';
import ProjectCard from '@/components/ProjectCard';

const Home: React.FC<PageProps> = () => (
  <main>
    {/* <Title /> */}
    <LandingHero />
    <ProjectCard>test</ProjectCard>
    <ProjectCard>tesfdsat</ProjectCard>
  </main>
);

export default Home;
