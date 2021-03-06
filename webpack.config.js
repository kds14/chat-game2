const path = require('path');

module.exports = {
	entry: './src/client.js',
	mode: 'development',
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'public/javascripts')
	}
};
