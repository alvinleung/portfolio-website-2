const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      plugins: [new TsconfigPathsPlugin()],
    },
  });
};

exports.createPages = async ({ actions, graphql, reporter }) => {
  const { createPage } = actions;
  const blogPostTemplate = require.resolve(
    `./src/templates/ProjectTemplate.tsx`
  );
  const result = await graphql(`
    {
      allMdx(limit: 1000) {
        edges {
          node {
            frontmatter {
              slug
            }
          }
        }
      }
    }
  `);
  // Handle errors
  if (result.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`);
    return;
  }
  result.data.allMdx.edges.forEach(({ node }) => {
    createPage({
      path: node.frontmatter.slug,
      component: blogPostTemplate,
      context: {
        // additional data can be passed via context
        slug: node.frontmatter.slug,
      },
    });
  });
};

/**
 * Converting images into webp in build time
 */

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const getAllFiles = (dirPath, exts, arrayOfFiles) => {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function (file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, exts, arrayOfFiles);
      return;
    }

    // its not a directory
    const extension = path.extname(file);

    // add to record if the extension matches
    if (exts.some((str) => `.${str}` === extension))
      arrayOfFiles.push(path.join(__dirname, dirPath, "/", file));
  });

  return arrayOfFiles;
};

// crawl the image directory covert them to webp
exports.onPreInit = () => {
  const IMAGE_DIR = "static/img/";
  const IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "gif"];

  console.log(`Gathering images under ${IMAGE_DIR}...`);
  const allImages = getAllFiles(IMAGE_DIR, IMAGE_EXTENSIONS);

  console.log(`Converting images into webp...`);
  allImages.forEach((imgPath) => {
    const relativeImgPath = path.relative(__dirname, imgPath);
    const extName = path.extname(relativeImgPath);
    const fileName = path.basename(relativeImgPath, extName);
    const pathWithoutExt = relativeImgPath.substring(
      0,
      relativeImgPath.indexOf(extName)
    );
    const writeFilePath = pathWithoutExt + ".webp";

    console.log(`Writing "${writeFilePath}"`);
    // get the image and converting it into webp
    sharp(relativeImgPath).webp().toFile(writeFilePath);
  });
};
