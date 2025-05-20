const fs = require('fs').promises;
const pathModule = require('path');

// Utility: Convert kebab-case to camelCase
const toCamelCase = (str) => str.replace(/-([a-z])/g, (_, char) => char.toUpperCase());

// Utility: Fix JSX-unsafe attributes
const fixSvgAttributes = (svg) => {
	return (
		svg
			// Replace known namespaced attributes
			.replace(/xmlns:xlink/g, 'xmlnsXlink')
			.replace(/xml:space/g, 'xmlSpace')
			.replace(/xmlns:serif/g, 'xmlnsSerif')
			.replace(/serif:id/g, 'serifId')
			.replace(/clip-path="url\(#_clip1\)"/g, '')
			// Add viewBox if known size
			.replace(/width="24px" height="24px"/g, 'width="24px" height="24px" viewBox="0 0 24 24"')
			.replace(/width="40px" height="40px"/g, 'width="40px" height="40px" viewBox="0 0 40 40"')
			// Replace all kebab-case attributes with camelCase (JSX-friendly)
			.replace(/([ :])([a-z]+-[a-z0-9\-]+)=/gi, (_, prefix, attr) => {
				const camelAttr = toCamelCase(attr);
				return `${prefix}${camelAttr}=`;
			})
	);
};

// Recursively walk through all files in the directory tree
async function processDirectory(dir) {
	const entries = await fs.readdir(dir, { withFileTypes: true });

	for (const entry of entries) {
		const fullPath = pathModule.join(dir, entry.name);

		if (entry.isDirectory()) {
			await processDirectory(fullPath);
		} else if (entry.isFile() && entry.name.endsWith('.svg')) {
			try {
				const rawSvg = await fs.readFile(fullPath, 'utf-8');
				const fixedSvg = fixSvgAttributes(rawSvg);
				await fs.writeFile(fullPath, fixedSvg, 'utf-8');
				console.log(`✅ Converted: ${fullPath}`);
			} catch (error) {
				console.error(`❌ Failed: ${fullPath}`, error);
			}
		}
	}
}

// Run it
processDirectory('svg').catch(console.error);
