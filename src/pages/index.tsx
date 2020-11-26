import React from 'react';
import { PageProps, graphql } from 'gatsby';
import '../style/typography.scss';
import '../style/layout.scss';
import '../style/variables.scss';

import LandingHero from '@/components/LandingHero';
import ProjectCard from '@/components/ProjectCard';

interface Props {
  readonly data: PageQueryData;
}

const Home: React.FC<Props> = ({ data }: Props) => {
  const projectCaseStudies = data.allMdx.edges;

  return (
    <>
      {/* <Cursor /> */}
      <main className="full-width">
        {/* <Title /> */}
        <LandingHero />
        <section id="works">
          {projectCaseStudies.map((project) => (
            <ProjectCard
              title={project.node.frontmatter.title}
              slug={project.node.frontmatter.slug}
              catagory={project.node.frontmatter.catagory}
              tagline={project.node.frontmatter.tagline}
              cover={project.node.frontmatter.cover}
              isViewing={false}
            />
          ))}
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
