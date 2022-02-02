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
      darkBackground={project.node.frontmatter.darkBackground}
      isViewOnly={false}
      small={isSmall}
    />
  );

  const buildProjectList = (projectList) => {
    let indexOffset = 0;

    return projectList.map((project, projetIndex) => {
      // don't render anything if it's empty
      if (project.node.frontmatter.hidden) {
        indexOffset++;
        return <></>;
      }

      // ignore the
      const indexIgnoredHidden = projetIndex - indexOffset;
      const isLastProject = projetIndex + 1 === projectList.length;
      // hero
      if (indexIgnoredHidden === 0)
        return (
          <div className="main-grid__full-content" key={indexIgnoredHidden}>
            {buildProject(project, false)}
          </div>
        );
      // first row, second
      else if (indexIgnoredHidden % 4 === 2)
        return (
          <div
            className="main-grid__secondary-col-small"
            key={indexIgnoredHidden}
          >
            {buildProject(project, true)}
          </div>
        );
      // first row, first
      else if (indexIgnoredHidden % 4 === 1)
        return (
          <div
            className="main-grid__primary-col-large"
            key={indexIgnoredHidden}
          >
            {buildProject(project, false)}
          </div>
        );
      // 2nd row, first
      else if (indexIgnoredHidden % 4 === 3) {
        if (isLastProject) {
          return (
            <div
              className="main-grid__secondary-col-large"
              key={indexIgnoredHidden}
            >
              {buildProject(project, false)}
            </div>
          );
        }

        return (
          <div
            className="main-grid__primary-col-small"
            key={indexIgnoredHidden}
          >
            {buildProject(project, true)}
          </div>
        );
        // 2nd row, second
      } else
        return (
          <div
            className="main-grid__secondary-col-large"
            key={indexIgnoredHidden}
          >
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
        <section id="featured" className="main-grid">
          <VerticalLabel>Featured Works</VerticalLabel>
          {buildProjectList(featuredProjectList)}
        </section>
        <div className="main-grid__section-seperator"></div>
        <section id="visual-design" className="main-grid">
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
          hidden: boolean;
          darkBackground: boolean;
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
            hidden
            darkBackground
          }
        }
      }
    }
  }
`;
