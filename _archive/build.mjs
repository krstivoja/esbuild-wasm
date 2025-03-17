import { build } from "esbuild";
import { polyfillNode } from "esbuild-plugin-polyfill-node";
import inlineImportPlugin from "esbuild-plugin-inline-import";

build({
    entryPoints: ["src/index.js"],
    bundle: true,
    minify: true,
    treeShaking: true,
    legalComments: "none",
    outfile: "./index.js",
    plugins: [
        inlineImportPlugin(),
        polyfillNode({
            polyfills: {
                fs: true,
                path: true,
            },
        }),
    ],
});