const autoprefixer = require("autoprefixer");

module.exports = function(paths) {
  return {
    module: {
      rules: [
        {
          test: /\.(sa|sc|c)ss$/,
          include: paths,
          use: [
            "style-loader",
            "css-loader",
            {
              loader: "postcss-loader",
              options: {
                plugins: [autoprefixer()],
                sourceMap: true
              }
            },
            {
              loader: "resolve-url-loader"
            },
            {
              loader: "sass-loader",
              options: {
                sourceMap: true,
                sourceMapContents: false
              }
            }
          ]
        }
      ]
    }
  };
};
