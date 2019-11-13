exports.onCreateWebpackConfig = ({actions}) => {
  actions.setWebpackConfig({
    module: {
      rules: [
        {
          test: /\.mjs$/,
          include: /node_modules/,
          type: 'javascript/auto',
        },
      ],
    },
  })
}
