const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
	entry: [
		'./src/common.js',
		'./src/scss/main.scss'
	],
	output: {
		filename: './js/bundle.js',
		path: path.resolve(__dirname, 'dist')
	},
	devtool: 'source-map',
	module: {
		rules: [{
		    test: /\.js$/,
		    loader: 'babel-loader',
		},{
			test: /\.(sass|scss|css)$/,
			include: path.resolve(__dirname, 'src/scss'),
			use: ExtractTextPlugin.extract({
          		use: [{
              		loader: "css-loader",
              		options: {
		                sourceMap: true,
		                minimize: true,
		                url: false
              		}
            	},{
	              	loader: "resolve-url-loader"
	            },{
              		loader: "sass-loader",
              		options: {
                		sourceMap: true
              		}
            	}]
        	})
		},{
			test: /\.css$/,
			use:[
				'style-loader',
				'css-loader'
			]
		},{
	        test: /\.(png|jpg|gif)$/,
	        use: [
				{
					loader: 'file-loader',
					options: {name: 'images/[name].[ext]'}  
				}
	        ]
      	},{
	    
	    	test: /\.(csv|tsv)$/,
	    	use: [
	    		'csv-loader'
	    	]
	    },{
	    	test: /\.xml$/,
	    	use: [
	    		'xml-loader'
	    	]
	    },{
            test: /\.(eot|svg|ttf|woff|woff2)$/,
            loader: 'file?name=public/fonts/[name].[ext]'
        }]
	},
	plugins: [
		new CleanWebpackPlugin(['dist']),
		new ExtractTextPlugin({
	      filename: './css/main.css',
	      allChunks: true,
	    }),
	    new CopyWebpackPlugin(
		    [{
			    from: './src/fonts',
			    to: './fonts'
	      	},
	      	{
		        from: './src/images',
		        to: './images'
	    	}]
	    ),
	]
};