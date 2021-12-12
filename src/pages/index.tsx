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

  const buildProject = (project, isSmall) => (
    <ProjectCardLink
      title={project.node.frontmatter.title}
      slug={project.node.frontmatter.slug}
      catagory={project.node.frontmatter.catagory}
      tagline={project.node.frontmatter.tagline}
      cover={project.node.frontmatter.cover}
      isViewOnly={false}
      small={isSmall}
    />
  );

  const buildProjectList = (projectList) => {
    return projectList.map((project, index) => {
      // hero
      if (index === 0)
        return (
          <div className="main-grid__full-content" key={index}>
            {buildProject(project, false)}
          </div>
        );
      // first row, second
      else if (index % 4 === 2)
        return (
          <div className="main-grid__secondary-col-small" key={index}>
            {buildProject(project, true)}
          </div>
        );
      // first row, first
      else if (index % 4 === 1)
        return (
          <div className="main-grid__primary-col-large" key={index}>
            {buildProject(project, false)}
          </div>
        );
      // 2nd row, first
      else if (index % 4 === 3)
        return (
          <div className="main-grid__primary-col-small" key={index}>
            {buildProject(project, true)}
          </div>
        );
      // 2nd row, second
      else
        return (
          <div className="main-grid__secondary-col-large" key={index}>
            {buildProject(project, false)}
          </div>
        );
    });
  };

  // const buildProjectLayout = (projetList) =>
  //   buildProjectList(projetList).map((project, index) => {
  //     if (index === 0)
  //       return <div className="main-grid__full-content">{project}</div>;
  //     else if (index % 2 === 1)
  //       return <div className="main-grid__primary-col-large">{project}</div>;
  //     else
  //       return <div className="main-grid__secondary-col-small">{project}</div>;
  //   });
  return (
    <>
      <SEOHeader pageTitle="Works" />
      {/* <Cursor /> */}
      <main className="full-width nav-padding">
        {/* <Title /> */}
        <LandingHero />
        <section id="works" className="main-grid">
          <VerticalLabel>Featured</VerticalLabel>
          {buildProjectList(featuredProjectList)}
          <div className="main-grid__section-seperator"></div>
          <VerticalLabel>Visual Design</VerticalLabel>
          {buildProjectList(visualDesignProjectList)}
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
