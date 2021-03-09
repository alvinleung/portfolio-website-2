require("dotenv").config();

module.exports = {
  // Since `gatsby-plugin-typescript` is automatically included in Gatsby you
  // don't need to define it here (just if you need to change the options)
  siteMetadata: {
    title: `Alvin Leung - Experience designer, Visual Designer`,
  },

  plugins: [
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-sass`,
    {
      resolve: "gatsby-plugin-web-font-loader",
      options: {
        typekit: {
          // id: process.env.TYPEKIT_ID,
          id: "sdz1siz",
        },
        google: {
          families: ["Roboto Mono"],
        },
      },
    },
    // for sourcing and transforming the markdwon files
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `markdown-pages`,
        path: `${__dirname}/src/data/projects`,
      },
    },
    // for sourcing and transforming the image files
    // muted for not using the image processing
    // {
    //   resolve: `gatsby-source-filesystem`,
    //   options: {
    //     name: `markdown-pages`,
    //     path: `${__dirname}/src/data/img`,
    //   },
    // },
    `gatsby-plugin-sharp`,
    `gatsby-remark-images`,
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        gatsbyRemarkPlugins: [],
        extensions: [`.md`, `.mdx`],
        gatsbyRemarkPlugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 1035,
              sizeByPixelDensity: true,
            },
          },
        ],
      },
    },
    {
      resolve: `gatsby-plugin-netlify`,
      options: {
        headers: {
          "/**/*.html": [
            "cache-control: public",
            "cache-control: max-age=0",
            "cache-control: must-revalidate",
          ],
          "/page-data/*.json": [
            "cache-control: public",
            "cache-control: max-age=0",
            "cache-control: must-revalidate",
          ],
          "/app-data.json": [
            "cache-control: public",
            "cache-control: max-age=0",
            "cache-control: must-revalidate",
          ],
          "/static/img/*": [
            "cache-control: public",
            "cache-control: max-age=31536000",
            "cache-control: immutable",
          ],
        },
      },
    },
  ],
};
