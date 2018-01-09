module.exports = {
  env: {
    es6: true,
    node: true,
    mocha: true
  },
  extends: ["eslint:recommended", "prettier"],
  plugins: ["prettier", "mocha"],
  parser: "babel-eslint",
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: "module"
  },
  rules: {
    "prettier/prettier": "error",
    "mocha/no-exclusive-tests": "error"
  }
};
