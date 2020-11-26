import React from 'react';
import { graphql } from 'gatsby';
import ProjectTitle from '@/components/ProjectLayout/ProjectTitle/ProjectTitle';
import ProjectCard from '@/components/ProjectCard';
import {
  ProjectSectionHeader,
  SectionDescription,
  SectionNumber,
  SectionTitle,
} from '@/components/ProjectLayout/ProjectSectionHeader/ProjectSectionHeader';

export default function Template({
  data, // this prop will be injected by the GraphQL query below.
}) {
  // const { markdownRemark } = data; // data.markdownRemark holds your post data
  const { frontmatter, html } = data.mdx;

  // console.log(markdownRemark);

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
        <ProjectSectionHeader>
          <SectionNumber>01</SectionNumber>
          <SectionTitle>Project Context</SectionTitle>
          <SectionDescription>
            As a final project in an Interface Design course at Simon Fraser
            University, our team designed, prototyped, tested and pitched an App
            idea to the class in 7 weeks.
          </SectionDescription>
        </ProjectSectionHeader>
      </main>
    </>
  );
}
export const pageQuery = graphql`
  query($slug: String!) {
    mdx(frontmatter: { slug: { eq: $slug } }) {
      html
      frontmatter {
        slug
        title
        description
      }
    }
  }
`;
