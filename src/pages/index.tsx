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

const Home: React.FC<Props> = ({
  data: {
    allMarkdownRemark: { edges },
  },
}) => {
  return (
    <>
      {/* <Cursor /> */}
      <main className="full-width">
        {/* <Title /> */}
        <LandingHero />
        <section id="works">
          <ProjectCard
            title="HelpMate"
            slug="/projects/HelpMate"
            catagory="UX/UI Design"
            tagline="Build connections in the community one task at a time"
          ></ProjectCard>
          <ProjectCard
            title="FreeGeek"
            slug="/projects/FreeGeek"
            catagory="UX/UI Design"
            tagline="Build connections in the community one task at a time"
          ></ProjectCard>
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
  allMarkdownRemark: {
    edges: {
      node: {
        excerpt: string;
        fields: {
          slug: string;
        };
        frontmatter: {
          date: string;
          title: string;
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
    allMarkdownRemark(limit: 1000) {
      edges {
        node {
          excerpt
          frontmatter {
            slug
            title
            tagline
            catagory
          }
        }
      }
    }
  }
`;
