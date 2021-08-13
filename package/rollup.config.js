import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";

export default [
  {
    input: "src/index.ts",
    output: [
      {
        format: "es",
        file: "dist/index.mjs",
        sourcemap: true,
      },
      {
        format: "cjs",
        file: "dist/index.js",
        sourcemap: true,
      },
    ],
    plugins: [
      // If you have external dependencies installed from
      // npm, you'll most likely need these plugins. In
      // some cases you'll need additional configuration -
      // consult the documentation for details:
      // https://github.com/rollup/plugins/tree/master/packages/commonjs
      resolve(),
      commonjs(),
      typescript({
        sourceMap: true,
      }),
    ],
  },
  {
    // path to your declaration files root
    input: "./src/index.d.ts",
    output: [{ file: "dist/index.d.ts", format: "es" }],
    plugins: [dts()],
  },
];
