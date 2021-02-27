import React from 'react';
import { graphql } from 'gatsby';

import { motion } from 'framer-motion';

// imports for custom react component in the article
import ProjectTitle from '@/components/ProjectLayout/ProjectTitle/ProjectTitle';
import ProjectCardCover from '@/components/ProjectCard/ProjectCardCover';
import ComparisonView from '@/components/ComparisonView/ComparisonView';
import ComparisonItem from '@/components/ComparisonView/ComparisonItem';

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
import { AnimationConfig } from '@/components/AnimationConfig';

const variants = {
  initial: {
    opacity: 0,
  },
  enter: {
    opacity: 1,
    transition: {
      duration: AnimationConfig.FAST,
      delay: 1,
      when: 'beforeChildren',
    },
  },
  exit: {
    opacity: 0,
    y: 50,
    // page transition exit after the children
    transition: { duration: AnimationConfig.FAST },
  },
};

export default function Template({
  data, // this prop will be injected by the GraphQL query below.
}) {
  // const { markdownRemark } = data; // data.markdownRemark holds your post data
  const { frontmatter, body } = data.mdx;

  return (
    <>
      <motion.header className="nav-padding">
        <ProjectTitle
          title={frontmatter.title}
          description={frontmatter.description}
        />
        {/* <ProjectCard name={frontmatter.slug} isViewing={true}></ProjectCard> */}
        <ProjectCardCover
          slug={frontmatter.slug}
          cover={frontmatter.cover}
          className="full-width"
          style={{
            maxHeight: '50rem',
          }}
        ></ProjectCardCover>
      </motion.header>
      <motion.main
        className="full-width main-grid"
        variants={variants}
        initial="initial"
        animate="enter"
        exit="exit"
      >
        <MDXProvider
          components={{
            // overriding default markdown syntax for custom look
            h2: SectionHead,
            h3: SectionDescription,
            p: ParagraphProcessor,
            hr: ThematicBreak,
            img: ImageSub,
            // context for custom react component layout
            ProjectInfo,
            ProjectInfoItem,
            ComparisonView,
            ComparisonItem,
          }}
        >
          <MDXRenderer>{body}</MDXRenderer>
        </MDXProvider>
      </motion.main>
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
  // make sure the pargraph is string only
  if (typeof children === 'string') {
    const isSectopmHeadingParagrah = children.substring(0, 2) === '--';
    if (isSectopmHeadingParagrah) {
      return (
        <p className="main-grid__primary-col article__section-description">
          {children.substring(2)}
        </p>
      );
    }
  }
  return <p className="main-grid__primary-col">{children}</p>;
};

const ImageSub = (props) => (
  <img
    src={props.src}
    alt={props.alt}
    className="main-grid__primary-col"
    style={{ width: '100%' }}
  />
);

export const pageQuery = graphql`
  query($slug: String!) {
    mdx(frontmatter: { slug: { eq: $slug } }) {
      body
      frontmatter {
        slug
        title
        description
        cover
      }
    }
  }
`;
