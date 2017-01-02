module.exports = {
	entry: {
		test: __dirname + '/public/js/test.js'
	},
	module: {
		loaders: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
				query: {
					presets:['react']
				}
			}
		]
	},
	output: {
		//filename: 'transformed_[name].js',
		filename: 'transformed.js',
		path: __dirname + '/public/js/build'
	},
};