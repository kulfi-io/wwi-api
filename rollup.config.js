import pkg from "./package.json";
import polyfills from "rollup-plugin-node-polyfills";
import resolve from '@rollup/plugin-node-resolve';

const _external = Object.keys(pkg.dependencies);

export default {
    input: "./src/index.js",
    external: _external,
    plugins: [
        resolve(),
        polyfills()
    ],
    output: [
        {
            file: `${pkg.outputDir}/${pkg.name}-cjs.js`,
            format: "cjs",
            sourcemap: true
        },
        {
            file: `${pkg.outputDir}/${pkg.name}-esm.js`,
            format: "es",
            sourcemap: true
        },
    ]
};
