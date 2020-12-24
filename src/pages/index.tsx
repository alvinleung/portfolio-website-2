import React, { useEffect } from 'react';
import { PageProps, graphql } from 'gatsby';
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

  return (
    <>
      {/* <Cursor /> */}
      <main className="full-width nav-padding">
        {/* <Title /> */}
        <LandingHero />
        <section id="works" className="main-grid">
          <VerticalLabel>Featured Project</VerticalLabel>
          <div className="main-grid__full-content">
            {projectCaseStudies.map((project, index) => (
              <ProjectCardLink
                key={index}
                title={project.node.frontmatter.title}
                slug={project.node.frontmatter.slug}
                catagory={project.node.frontmatter.catagory}
                tagline={project.node.frontmatter.tagline}
                cover={project.node.frontmatter.cover}
                isViewOnly={false}
              />
            ))}
          </div>
          <div className="main-grid__vertical-label">Visual Design</div>
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
          }
        }
      }
    }
  }
`;
