// // babel.config.js
// module.exports = {
//   presets: [
//     [
//       "@babel/preset-env",
//       {
//         targets: {
//           node: "current", // targeting the current version of Node
//         },
//       },
//     ],
//   ],
//   plugins: ["@babel/plugin-syntax-import-assertions"],
// };

// babel.config.js
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
        },
        // Allow importing of ES modules
        modules: 'auto'
      },
    ],
  ],
  // Include these plugins to help with ESM compatibility
  plugins: [],
};