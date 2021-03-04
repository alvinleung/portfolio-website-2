import React, { useEffect } from 'react';
import { PageProps, graphql } from 'gatsby';

import SEOHeader from '../components/SEOHeader';

import '../style/typography.scss';
import '../style/layout.scss';
import '../style/variables.scss';
import '../style/reset.scss';

import LandingHero from '@/components/LandingHero';
import ProjectCardLink from '@/components/ProjectCard/ProjectCardLink';
import VerticalLabel from '@/components/VerticalLabel/VerticalLabel';

interface Props {
  readonly data: PageQueryData;
}

const Home: React.FC<Props> = ({ data }: Props) => {
  const projectCaseStudies = data.allMdx.edges;

  const filterProjectByTag = (projectCaseStudies, tag: string) => {
    return projectCaseStudies.filter((project) => {
      const tagList = project.node.frontmatter.tag.split(' ');
      const isMatchingProject = tagList.some((val) => val === tag);
      if (isMatchingProject) return true;
      return false;
    });
  };

  const featuredProjectList = filterProjectByTag(
    projectCaseStudies,
    'featured',
  );

  const visualDesignProjectList = filterProjectByTag(
    projectCaseStudies,
    'visual-design',
  );

  const buildProjectList = (projectList) => {
    return projectList.map((project, index) => (
      <ProjectCardLink
        key={index}
        title={project.node.frontmatter.title}
        slug={project.node.frontmatter.slug}
        catagory={project.node.frontmatter.catagory}
        tagline={project.node.frontmatter.tagline}
        cover={project.node.frontmatter.cover}
        isViewOnly={false}
      />
    ));
  };

  return (
    <>
      <SEOHeader pageTitle="Works" />
      {/* <Cursor /> */}
      <main className="full-width nav-padding">
        {/* <Title /> */}
        <LandingHero />
        <section id="works" className="main-grid">
          <VerticalLabel>Featured</VerticalLabel>
          <div className="main-grid__full-content">
            {buildProjectList(featuredProjectList)}
          </div>
          <div className="main-grid__section-seperator"></div>
          <VerticalLabel>Visual Design</VerticalLabel>
          <div className="main-grid__full-content">
            {buildProjectList(visualDesignProjectList)}
          </div>
        </section>
      </main>
    </>
  );
};

export default Home;

interface PageQueryData {
  site: {
    siteMetadata: {
      title: string;
    };
  };
  allMdx: {
    edges: {
      node: {
        frontmatter: {
          slug: string;
          title: string;
          catagory: string;
          tagline: string;
          cover: string;
          tag: string;
        };
      };
    }[];
  };
}

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMdx(limit: 1000, sort: { fields: frontmatter___weight }) {
      edges {
        node {
          frontmatter {
            slug
            title
            tagline
            catagory
            cover
            tag
          }
        }
      }
    }
  }
`;
