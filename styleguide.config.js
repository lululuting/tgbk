const path = require('path');
module.exports = {
  title: "文档名", // 文档名
  components: 'components/**/*.{js,jsx,ts,tsx}',
  styleguideComponents: {
    Wrapper: path.join(__dirname, 'styleguide/Wrapper'),
    // StyleGuideRenderer: path.join( __dirname, 'styleguide/StyleGuideRenderer')
  },
  theme: {
    color: {
      base: '#333',
      light: '#767676',
      lightest: '#ccc',
      link: '#58a6ff',
      linkHover: '#3EA9FF',
      focus: 'rgba(22, 115, 177, 0.25)',
      border: '#e8e8e8',
      name: '#690',
      type: '#905',
      error: '#c00',
      baseBackground: '#fff',
      codeBackground: '#161b22',
      sidebarBackground: '#081116',
      ribbonBackground: '#3EA9FF',
      ribbonText: '#3EA9FF',

      // Based on default Prism theme
      codeBase: '#c9d1d9',
      codeComment: '#8b949e',
      codePunctuation: '#c9d1d9',
      codeProperty: '#f8c555',
      codeDeleted: '#D2A8F9',
      codeString: '#7DC0FB',
      codeInserted: '#690',
      codeOperator: '#7DC0FB',
      codeKeyword: '#ff7b72',
      codeFunction: '#7ee787',
      codeVariable: '#e90',
    },
    fontFamily: {
      base: '"Comic Sans MS", "Comic Sans", cursive'
    }
  },
  showCode: true,
  template: {
    favicon: 'https://assets-cdn.github.com/favicon.ico'
  },
  propsParser: (filePath, source, resolver, handlers) => {
    const { ext } = path.parse(filePath);
    return ext === '.tsx' || ext === '.ts'
      ? require('react-docgen-typescript').parse(
          filePath,
          source,
          resolver,
          handlers
        )
      : require('react-docgen').parse(source, resolver, handlers);
  },
  verbose: true, // 打印详细信息
  usageMode: 'expand', // 自动打开文档的缩放
  pagePerSection: true, // 是否每页一个组件显示
  styles: {
    Logo: {
      logo: {
        animation: '$blink ease-in-out 1000ms infinite'
      },
      '@keyframes blink': {
        to: { opacity: 0 }
      }
    }
  },
  webpackConfig: {
    module: {
      rules: [
        {
          test: /\.(jsx|js)?$/,
          exclude: /node_modules/,
          loader: 'babel-loader'
        },
        { 
          test: /\.(tsx|ts)?$/, 
          exclude: /node_modules'/, 
          use: ['babel-loader', 'ts-loader']
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        },
        {
          test: /\.less$/,
          use: ['style-loader', 'css-loader', 'less-loader']
        },
      ]
    },
    resolve: {
      // 配置解析模块路径别名: 优点简写路径 缺点路径没有提示
      alias: {
        '@': path.resolve(__dirname),
        'components': path.resolve(__dirname, 'components')
      },
    },
  }
}