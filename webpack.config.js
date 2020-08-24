
const path = require('path');       //path package 
 //in webpack has four core concepts : entry point,output,loaders,plugins
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {  //one object exported
    entry: ['babel-polyfill', './src/js/index.js'],
    //polyfill the features that the babel cannot load    
    //babel-polyfill package helps to convert codes like promises that were not in es5 //here it will bundle together our code and polyfill
    output: {
        path: path.resolve(__dirname, 'dist'), //absolute path //so we need node package require path
        filename: 'js/bundle.js'
        //now webpack will output our file to dist>bundle.js

    },
      // mode: 'development'  //i took it to npm script package json
    devServer: {
        contentBase: './dist' //specify the folder from which webpack should serve
    },
    plugins: [ //in order to inject src index.html to dist also
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/index.html'
        })
    ],
    module: {   //after installing babel packages and loader
        rules: [  //array of all of the loaders
            {
                test: /\.js$/,    //all file ending with .js will apply babel-loader
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            }
        ]
    }
};
