---
to: packages/services/grpc/<%= name %>/.babelrc
---
{
  "presets": ["@babel/preset-env", "@babel/preset-typescript"],
  "plugins": ["@babel/plugin-transform-runtime"]
}