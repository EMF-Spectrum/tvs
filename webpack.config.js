/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */
const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

/** @type webpack.Configuration */
module.exports = {
	entry: {
		display: "./src/display.ts",
		admin: "./src/admin.tsx",
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: "ts-loader",
				exclude: /node_modules/,
			},
		],
	},
	resolve: {
		extensions: [".tsx", ".ts", ".js"],
		alias: {
			"@": path.resolve(__dirname, "src"),
		},
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: "static/admin.html",
			chunks: ["admin"],
			filename: "admin.html",
		}),
		new HtmlWebpackPlugin({
			template: "static/display.html",
			chunks: ["display"],
			filename: "display.html",
		}),
		new CopyWebpackPlugin(["static/index.html"]),
	],
	mode: "development",
	devtool: "inline-source-map",
	output: {
		filename: "[name].js",
		path: path.resolve(__dirname, "_build"),
	},
	devServer: {
		inline: true,
		proxy: {
			"/socket": {
				target: "ws://localhost:8081",
				ws: true,
			},
			"/api": "http://localhost:8081",
		},
	},
};
