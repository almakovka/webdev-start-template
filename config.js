const configFile = {
  PORT: 5000,
  PATHS: {
    dist: "dist",
    srcFiles: [
      "src/**/*",
      "!src/{assets,data,layouts,pages,partials}",
      "!src/{assets,data,layouts,pages,partials}/**/*",
      "src/assets/**/*",
      "!src/assets/{img,js,css}",
      "!src/assets/{img,js,css}/**/*"
    ],
    entries: "src/assets/js/app.js"
  },
  webpackConfig: {
    module: {
      rules: [
        {
          test: /.js$/,
          use: [
            {
              loader: 'babel-loader'
            }
          ]
        }
      ]
    }
  }
}

export default configFile;