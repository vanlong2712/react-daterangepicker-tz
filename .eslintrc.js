module.exports = {
  root: true,
  // This tells ESLint to load the config from the package `eslint-config-custom`
  extends: ["custom"],
  rules: {
    "no-console": "off", //we want to keep it in dev to debug
    "no-useless-escape": "off", //support regex
    "react/display-name": "off", //some time we need anonymos function without Name
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "no-prototype-builtins": "off",
    "no-unused-vars": "error",
    "react/jsx-uses-react": "error",
    "react/jsx-uses-vars": "error",
    "react/prop-types": "off",
    eqeqeq: "off",
    "react/no-unescaped-entities": "off",
    "no-extra-boolean-cast": "off",
    "import/no-webpack-loader-syntax": "off",
  },
  settings: {
    next: {
      rootDir: ["apps/*/"],
    },
  },
};
