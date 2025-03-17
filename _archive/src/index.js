var r = require("process");
r.versions.node = "1.0.0";

const path = require("path");
const postcss = require("postcss");
const postcssImport = require("postcss-import");

import tailwindTheme from 'inline:../node_modules/tailwindcss/theme.css';
import tailwindPreflight from 'inline:../node_modules/tailwindcss/preflight.css';
import tailwindUtilities from 'inline:../node_modules/tailwindcss/utilities.css';
import tailwindIndex from 'inline:../node_modules/tailwindcss/index.css';

const tailwindcss = {
    '/tailwindcss/theme.css': tailwindTheme,
    '/tailwindcss/preflight.css': tailwindPreflight,
    '/tailwindcss/utilities.css': tailwindUtilities,
    '/tailwindcss/index.css': tailwindIndex,
};

async function compile(customCss) {
    const cssPath = '/';
    const tailwindcssFiles = {
        [cssPath]: customCss,
        ...tailwindcss
    };

    const processor = postcss()
        .use(postcssImport({
            filter: () => true,
            async resolve(id, basedir) {
                let _path = path.resolve(basedir, id);

                if (tailwindcssFiles[_path]) {
                    return _path;
                }

                if (!id.endsWith('.css')) {
                    id = id.concat('/index.css')
                }

                _path = path.join(basedir, id);

                if (tailwindcssFiles[_path]) {
                    return _path;
                }
            },
            load(file) {
                if (tailwindcssFiles[file]) {
                    return tailwindcssFiles[file];
                }
            }
        }));

    const result = await processor.process(tailwindcssFiles[cssPath], {
        from: cssPath
    });

    return result.css;
}

function main() {
    async function bundleCSS(css) {
        return await compile(css ?? '');
    }
    return bundleCSS;
}
window.bundleCSS = main();