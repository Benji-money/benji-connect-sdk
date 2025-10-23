module.exports = {
  presets: [
    ["@babel/preset-env", { modules: false, targets: ">0.25%, not dead" }]
  ],
  plugins: [
    ["transform-define", {
      __VERSION__: require("./package.json").version
    }]
  ],
  sourceMaps: true
}