import React from 'react';
import { graphql } from 'gatsby';
import ProjectTitle from '@/components/ProjectLayout/ProjectTitle/ProjectTitle';
import ProjectCard from '@/components/ProjectCard';
import { MDXRenderer } from 'gatsby-plugin-mdx';
import { MDXProvider } from '@mdx-js/react';

import {
  ProjectInfo,
  ProjectInfoItem,
} from '@/components/ProjectLayout/ProjectInfo/ProjectInfo';

import {
  SectionDescription,
  SectionNumber,
  SectionTitle,
} from '@/components/ProjectLayout/ProjectSectionHeader/ProjectSectionHeader';
import ProjectSectionSeperator from '@/components/ProjectLayout/ProjectSectionSeperator/ProjectSectionSeperator';

export default function Template({
  data, // this prop will be injected by the GraphQL query below.
}) {
  // const { markdownRemark } = data; // data.markdownRemark holds your post data
  const { frontmatter, body } = data.mdx;

  return (
    // <div className="blog-post-container">
    //   <div className="blog-post">
    //     <h1>{frontmatter.title}</h1>
    //     <h2>{frontmatter.date}</h2>
    //     <div
    //       className="blog-post-content"
    //       dangerouslySetInnerHTML={{ __html: html }}
    //     />
    //   </div>
    // </div>
    <>
      <header className="nav-padding">
        <ProjectTitle
          title={frontmatter.title}
          description={frontmatter.description}
        />
        {/* <ProjectCard name={frontmatter.slug} isViewing={true}></ProjectCard> */}
        <ProjectCard
          title={frontmatter.title}
          slug={frontmatter.slug}
          catagory={frontmatter.catagory}
          tagline={frontmatter.tagline}
          isViewing={true}
        ></ProjectCard>
      </header>
      <main className="full-width article-grid">
        <MDXProvider
          components={{
            // overriding default markdown syntax for custom look
            h2: SectionHead,
            h3: SectionDescription,
            p: ParagraphProcessor,
            hr: ThematicBreak,
            // context for custom react component layout
            ProjectInfo,
            ProjectInfoItem,
          }}
        >
          <MDXRenderer>{body}</MDXRenderer>
        </MDXProvider>
      </main>
    </>
  );
}

// hack to automatically generate an incrementing section text
const SectionHead = ({ children, key }) => {
  const headingText = children.substring(3);
  const headingNumber = children.substring(0, 3);
  // get the
  return (
    <>
      <SectionNumber>{headingNumber}</SectionNumber>
      <SectionTitle>{headingText}</SectionTitle>
      {/* <SectionDescription></SectionDescription> */}
    </>
  );
};

// for large break between sections
const ThematicBreak = () => <ProjectSectionSeperator />;

// for processing paragraph text
const ParagraphProcessor = ({ children }) => {
  const isSectopmHeadingParagrah = children.substring(0, 2) === '--';

  if (isSectopmHeadingParagrah) {
    return (
      <p className="article-grid__primary-col article__section-description">
        {children.substring(2)}
      </p>
    );
  }
  return <p className="article-grid__primary-col">{children}</p>;
};

export const pageQuery = graphql`
  query($slug: String!) {
    mdx(frontmatter: { slug: { eq: $slug } }) {
      body
      frontmatter {
        slug
        title
        description
      }
    }
  }
`;
