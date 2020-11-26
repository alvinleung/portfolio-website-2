import React from 'react';
import { PageProps } from 'gatsby';
import { AnimatePresence, motion } from 'framer-motion';
import '../style/typography.scss';
import '../style/layout.scss';

import ProjectCard from '@/components/ProjectCard';
import ProjectTitle from '@/components/ProjectLayout/ProjectTitle/ProjectTitle';
import {
  ProjectInfo,
  ProjectInfoItem,
} from '@/components/ProjectLayout/ProjectInfo/ProjectInfo';
import {
  ProjectSectionHeader,
  SectionDescription,
  SectionNumber,
  SectionTitle,
} from '@/components/ProjectLayout/ProjectSectionHeader/ProjectSectionHeader';

const CaseStudy: React.FC<PageProps> = () => (
  <>
    <header className="nav-padding">
      <ProjectTitle
        title="HelpMate"
        description="A community-based task finding application that allows users to help their community members with household chores."
      />
      <ProjectCard name="HelpMate" isViewing={true}></ProjectCard>
    </header>
    <main className="full-width article-grid">
      <ProjectSectionHeader>
        <SectionNumber>01</SectionNumber>
        <SectionTitle>Project Context</SectionTitle>
        <SectionDescription>
          As a final project in an Interface Design course at Simon Fraser
          University, our team designed, prototyped, tested and pitched an App
          idea to the class in 7 weeks.
        </SectionDescription>
      </ProjectSectionHeader>

      <div className="article-grid__primary-col">
        <ProjectInfo>
          <ProjectInfoItem
            fieldName="My Role"
            value="UX/UI Design, Illustration"
          />
          <ProjectInfoItem
            fieldName="Project Scope"
            value="7 weeks school porject"
          />
          <ProjectInfoItem fieldName="Tools" value="Figma" />
          <ProjectInfoItem
            fieldName="Team"
            value="Jessie Li, Jennifer Ho, Mattias Hallin, Alvin Leung"
          />
        </ProjectInfo>
      </div>

      <ProjectSectionHeader>
        <SectionNumber>02</SectionNumber>
        <SectionTitle>Key Contribution</SectionTitle>
        <SectionDescription>
          As a final project in an Interface Design course at Simon Fraser
          University, our team designed, prototyped, tested and pitched an App
          idea to the class in 7 weeks.
        </SectionDescription>
      </ProjectSectionHeader>
    </main>
  </>
);

export default CaseStudy;
