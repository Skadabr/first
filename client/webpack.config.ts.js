module.exports = {
  name: "client",
  entry: __dirname + "/src/index.tsx",
  output: {
    path: __dirname + "/build",
    filename: "[name].js"
  },
  devtool: "cheap-module-source-map",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader"
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      }
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  }
};
