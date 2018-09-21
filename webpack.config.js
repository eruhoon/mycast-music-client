var path = require('path');

module.exports = {
	mode: 'development',

	entry: './src/index.ts',

	devtool: 'inline-source-map',

	module: {
		rules: [
			// All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/
			}

			// All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
			// {
			// 	enforce: "pre",
			// 	test: /\.js$/,
			// 	loader: "source-map-loader"
			// }
		]
	},

	resolve: {
		extensions: ['.ts', '.tsx', '.js'],
		modules: [
			path.resolve('./node_modules'),
			path.resolve('./src')
		]
	},

	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname + '/dist')
	}
};