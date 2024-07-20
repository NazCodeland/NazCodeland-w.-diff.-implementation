import { createHighlighter } from 'shiki';
import {
	transformerNotationDiff,
	// 	transformerMetaHighlight,
	// 	transformerNotationHighlight,
	// 	transformerNotationWordHighlight,
	transformerNotationFocus
	// 	transformerNotationErrorLevel,
	// 	transformerMetaWordHighlight
} from '@shikijs/transformers';


import path from 'node:path';
import { fileURLToPath } from 'node:url';
const dirname = path.resolve(fileURLToPath(import.meta.url), '../');
console.log({ dirname });

// --------------------------------------------------------------------------------

let highlighter;
(async () => {
	if (!highlighter) {
		highlighter = await createHighlighter({
			themes: ['poimandres', 'tokyo-night'],
			langs: ['html', 'css', 'js', 'ts', 'svelte', 'json', 'python']
		});
	}
})();

// including '.svelte' in the extensions array throws an arrow with the Giscus Component,
// filled an issue: https://github.com/pngwn/MDsveX/issues/505
const config = {
	extensions: ['.md', '.svx'],
	highlight: {
		highlighter: (code, lang) => {
			return highlighter
				.codeToHtml(code, {
					lang,
					theme: lang === 'python' ? 'tokyo-night' : 'poimandres',

					transformers: [
						transformerNotationDiff(),
						// transformerNotationHighlight(),
						// transformerNotationWordHighlight(),
						transformerNotationFocus(),
						// transformerNotationErrorLevel(),
						{
							pre(node) {
								delete node.properties.tabindex;
							}
						}
					]
				})
				.replace(/{/g, '&#123;')
				.replace(/}/g, '&#125;');
		}
	},
	layout: {
		// Blog: path.join(dirname, './src/lib/components/layout/Blog.svelte'),
	}
};

export default config;
