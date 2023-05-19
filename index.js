var fs = require('fs');

async function convert(path) {
	let files = await fs.promises.opendir(path);

	const regex1 = new RegExp(`xmlns:xlink`, 'ig');
	const regex2 = new RegExp(`xml:space`, 'ig');
	const regex3 = new RegExp(`xmlns:serif`, 'ig');
	const regex4 = new RegExp('serif:id', 'ig');
	const regex5 = /clip-path="url\(#_clip1\)"/;

	for await (const file of files) {
		const isDirectory = (await fs.promises.lstat(`${path}/${file.name}`)).isDirectory();
		if (!isDirectory) {
			fs.readFile(`${path}/${file.name}`, 'utf-8', function (err, data) {
				if (err) throw err;

				let svg = data;

				svg = svg.replace(regex1, `xmlnsxlink`);
				svg = svg.replace(regex2, `xmlspace`);
				svg = svg.replace(regex3, `xmlnsserif`);
				svg = svg.replace(regex4, 'serifid');
				svg = svg.replace(regex5, '');

				fs.writeFile(`${path}/${file.name}`, svg, 'utf-8', function (err, data) {
					if (err) throw err;
					console.log(`Conversion of ${file.name} successful!`);
				});
			});
		} else {
			const filesDeep = await fs.promises.opendir(`${path}/${file.name}`);
			for await (const fileDeep of filesDeep) {
				const isDirectory2 = (await fs.promises.lstat(`${path}/${file.name}/${fileDeep.name}`)).isDirectory();
				if (!isDirectory2) {
					fs.readFile(`${path}/${file.name}/${fileDeep.name}`, 'utf-8', function (err, data) {
						if (err) throw err;

						let svg = data;

						svg = svg.replace(regex1, `xmlnsxlink`);
						svg = svg.replace(regex2, `xmlspace`);
						svg = svg.replace(regex3, `xmlnsserif`);
						svg = svg.replace(regex4, 'serifid');
						svg = svg.replace(regex5, '');
						data.replace;

						fs.writeFile(`${path}/${file.name}/${fileDeep.name}`, svg, 'utf-8', function (err, data) {
							if (err) throw err;
							console.log(`Conversion of ${fileDeep.name} successful!`);
						});
					});
				} else {
					const filesDeeper = await fs.promises.opendir(`${path}/${file.name}/${fileDeep.name}`);
					for await (const fileDeeper of filesDeeper) {
						const isDirectory2 = (
							await fs.promises.lstat(`${path}/${file.name}/${fileDeep.name}/${fileDeeper.name}`)
						).isDirectory();
						if (!isDirectory2) {
							fs.readFile(
								`${path}/${file.name}/${fileDeep.name}/${fileDeeper.name}`,
								'utf-8',
								function (err, data) {
									if (err) throw err;

									let svg = data;

									svg = svg.replace(regex1, `xmlnsxlink`);
									svg = svg.replace(regex2, `xmlspace`);
									svg = svg.replace(regex3, `xmlnsserif`);
									svg = svg.replace(regex4, 'serifid');
									svg = svg.replace(regex5, '');

									fs.writeFile(
										`${path}/${file.name}/${fileDeep.name}/${fileDeeper.name}`,
										svg,
										'utf-8',
										function (err, data) {
											if (err) throw err;
											console.log(`Conversion of ${fileDeeper.name} successful!`);
										}
									);
								}
							);
						} else {
							console.log(`Can't read deeper than two folders ( sorry! :< )`);
						}
					}
				}
			}
		}
	}
}

convert('svg');
