const Jarvis = require("webpack-jarvis");

module.exports = {
  name: "client",
  entry: __dirname + "/src/index.js",
  output: {
    path: __dirname + "/build",
    filename: "[name].js"
  },
  devtool: "cheap-module-source-map",
  module: {
    rules: [
      {
        test: /\.js$/,
        use: "babel-loader"
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      }
    ]
  },
  plugins: [
    new Jarvis({port: 1337})
  ]
};
