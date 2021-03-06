import React from 'react';
import { graphql, Link } from 'gatsby';

import { motion } from 'framer-motion';

// imports for custom react component in the article
import ProjectTitle from '@/components/ProjectLayout/ProjectTitle/ProjectTitle';
import ProjectCardCover from '@/components/ProjectCard/ProjectCardCover';
import ComparisonView from '@/components/ProjectLayout/ComparisonView/ComparisonView';
import ComparisonItem from '@/components/ProjectLayout/ComparisonView/ComparisonItem';

import { MDXRenderer } from 'gatsby-plugin-mdx';
import { MDXProvider } from '@mdx-js/react';

import { ListItem, ListLayout } from '@/components/ProjectLayout/ListLayout';

import {
  ProjectInfo,
  ProjectInfoItem,
} from '@/components/ProjectLayout/ProjectInfo/ProjectInfo';

import InterfaceDemo from '../components/ProjectLayout/InterfaceDemo';
import ResourceLink from '../components/ResourceLink';

import {
  HalfImage,
  FullImage,
} from '../components/ProjectLayout/ImageLayout/ImageLayout';

import {
  SectionDescription,
  SectionNumber,
  SectionTitle,
} from '@/components/ProjectLayout/ProjectSectionHeader/ProjectSectionHeader';
import ProjectSectionSeperator from '@/components/ProjectLayout/ProjectSectionSeperator/ProjectSectionSeperator';
import { AnimationConfig } from '@/components/AnimationConfig';
import SEOHeader from '@/components/SEOHeader';

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

  // creating a custom paragraph processor for the functions
  const customParagraphProcessor = createParagraphProcessor([
    {
      token: '--',
      output: (content) => (
        <p className="main-grid__primary-col article__section-description">
          {content}
        </p>
      ),
    },
    {
      token: '->',
      output: (content) => (
        <p className="main-grid__secondary-col">{content}</p>
      ),
    },
  ]);

  return (
    <>
      <SEOHeader pageTitle={frontmatter.title} />
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
            h4: SubSectionHead,
            h5: ParagraphHead,
            // p: ParagraphProcessor,
            p: customParagraphProcessor,
            hr: ThematicBreak,
            img: ImageSub,
            a: LinkElement,
            // context for custom react component layout
            ProjectInfo,
            ProjectInfoItem,
            ComparisonView,
            ComparisonItem,
            FullImage,
            HalfImage,
            Pill,
            InterfaceDemo,
            ResourceLink,
            ListItem,
            ListLayout,
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

const SubSectionHead = ({ children, key }) => (
  <h4 className="main-grid__full-width">{children}</h4>
);

const ParagraphHead = ({ children, key }) => (
  <h5 className="main-grid__primary-col">{children}</h5>
);

// for large break between sections
const ThematicBreak = () => <ProjectSectionSeperator />;

// factory for paragraph processor
interface IParagraphProcessor {
  token: string;
  output: Function;
}
const createParagraphProcessor = (
  processorList: Array<IParagraphProcessor>,
) => {
  // function that would be called in runtime
  const combinedProcessor = ({ children }) => {
    const isChildrenString = typeof children === 'string';
    const paragraphHeadingChunk = (() => {
      if (isChildrenString) return children;
      if (Array.isArray(children)) return children[0];
    })();

    const defaultParagraphFormat = (content) => (
      <p className="main-grid__primary-col">{content}</p>
    );

    if (typeof paragraphHeadingChunk !== 'string')
      return defaultParagraphFormat(children);

    const trimParagraphToken = (children, token) => {
      console.log(typeof children);
      if (Array.isArray(children)) {
        let newChildren = [...children];
        newChildren[0] = paragraphHeadingChunk.substring(token.length);
        return newChildren;
      }

      if (isChildrenString) return children.substring(token.length);
    };

    const reducerFunction = (
      accumulator: IParagraphProcessor,
      { token, output }: IParagraphProcessor,
    ) => {
      const isMatchingToken =
        paragraphHeadingChunk.substring(0, token.length) === token;
      if (isMatchingToken) {
        return output(trimParagraphToken(children, token));
      }
      return accumulator;
    };

    const result = processorList.reduce<
      React.ReactElement | IParagraphProcessor
    >(
      reducerFunction,
      // default value is the children
      defaultParagraphFormat(children),
    );
    return result;
  };
  return combinedProcessor;
};

const LinkElement = (props) => {
  return (
    <Link to={props.href} target={'blank'}>
      {props.children}
    </Link>
  );
};

const ImageSub = (props) => (
  <img
    src={props.src}
    alt={props.alt}
    loading="lazy"
    className="main-grid__full-content"
    style={{ width: '100%' }}
  />
);

const Pill = ({ color, round, children }) => {
  return (
    <span className="main-grid__col">
      <span
        style={{
          display: 'inline',
          fontSize: '.75rem',
          textTransform: 'uppercase',
          letterSpacing: '.07em',
          fontWeight: 500,
          backgroundColor: color,
          color: '#FFF',
          borderRadius: round ? '5em' : '0rem',
          paddingLeft: '.5rem',
          paddingRight: '.5rem',
        }}
      >
        {children}
      </span>
    </span>
  );
};

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
