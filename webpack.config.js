const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = (env, argv) => {
  const isProduction = argv.mode === "production";

  return {
    // Точка входа
    entry: "./src/index.js",

    // Выходная папка и имя файла
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "bundle.[contenthash].js",
      clean: true, // Очищать папку dist перед сборкой
      assetModuleFilename: "assets/[name].[hash][ext][query]", // Для картинок/шрифтов
    },

    // Source maps для отладки
    devtool: isProduction ? "source-map" : "eval-source-map",

    // Модули и лоадеры
    module: {
      rules: [
        // 🔹 JavaScript + Babel
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: [
                [
                  "@babel/preset-env",
                  {
                    useBuiltIns: "usage",
                    corejs: 3,
                    targets: "> 0.25%, not dead",
                  },
                ],
              ],
            },
          },
        },

        // 🔹 SCSS/SASS → CSS
        {
          test: /\.(scss|css)$/,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : "style-loader",
            {
              loader: "css-loader",
              options: {
                importLoaders: 1, // Позволяет обрабатывать @import до css-loader
              },
            },
            "sass-loader",
          ],
        },

        // 🔹 Картинки (png, jpg, svg, gif)
        {
          test: /\.(png|jpe?g|gif|svg)$/i,
          type: "asset",
          parser: {
            dataUrlCondition: {
              maxSize: 8 * 1024, // ≤8KB → inline как base64
            },
          },
          generator: {
            filename: "assets/images/[name].[hash][ext][query]",
          },
        },

        // 🔹 Шрифты
        {
          test: /\.(woff2?|eot|ttf|otf)$/i,
          type: "asset/resource",
          generator: {
            filename: "assets/fonts/[name].[hash][ext][query]",
          },
        },
      ],
    },

    // Плагины
    plugins: [
      new HtmlWebpackPlugin({
        template: "./src/index.html",
        filename: "index.html",
        minify: isProduction
          ? {
              collapseWhitespace: true,
              removeComments: true,
              removeRedundantAttributes: true,
            }
          : false,
      }),
      // 🔹 Извлекать CSS в отдельный файл только для продакшена
      ...(isProduction
        ? [
            new MiniCssExtractPlugin({
              filename: "styles.[contenthash].css",
            }),
          ]
        : []),
    ],

    // Dev Server для разработки
    devServer: {
      static: {
        directory: path.join(__dirname, "dist"),
      },
      port: 8080,
      open: true,
      hot: true,
      client: {
        logging: "warn",
        progress: true,
      },
      // Для истории браузера (если будет роутинг)
      historyApiFallback: true,
    },

    // 🔍 Оптимизация (для продакшена)
    optimization: {
      minimize: isProduction,
      splitChunks: {
        chunks: "all", // Выносить зависимости в отдельный chunk
      },
    },

    // 🔌 Разрешаем импорты без расширений
    resolve: {
      extensions: [".js"],
      modules: ["node_modules"],
    },
  };
};
