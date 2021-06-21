const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

/** @type {import("webpack").Configuration} */
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
			{
				test: /\.scss$/,
				use: [
					// TODO: probs want mini css extract etc
					"style-loader",
					"css-loader",
					"sass-loader",
				],
			},
		],
	},
	resolve: {
		extensions: [".tsx", ".ts", `...`],
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
		new CopyWebpackPlugin({
			patterns: ["static/index.html"],
		}),
	],
	mode: "development",
	devtool: "inline-source-map",
	optimization: {
		splitChunks: {
			chunks: "all",
		},
	},
	output: {
		clean: true,
		path: path.resolve(__dirname, "_build"),
	},
	devServer: {
		inline: true,
		hot: true,
		proxy: {
			"/socket": {
				target: "ws://localhost:8081",
				ws: true,
			},
			"/api": "http://localhost:8081",
		},
	},
};
