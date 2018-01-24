const Jarvis = require("webpack-jarvis");
const webpack = require("webpack");
const nodeExternals = require("webpack-node-externals");

module.exports = {
  name: "ssr",
  entry: __dirname + "/src/ssr.js",
  output: {
    path: __dirname + "/build",
    filename: "ssr.js",
    libraryTarget: "commonjs2"
  },
  target: "node",
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              [
                "env",
                {
                  targets: {
                    node: 8
                  }
                }
              ]
            ],
            plugins: [
              "transform-react-jsx",
              "transform-object-rest-spread",
              "transform-class-properties"
            ]
          }
        }
      },
      {
        test: /\.css$/,
        use: ["css-loader"]
      }
    ]
  },
};
