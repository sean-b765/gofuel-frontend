module.exports = {
  webpack: {
    configure: (config) => {
      config.optimization.minimizer.forEach((m) => {
        if (m.options && m.options.terserOptions) {
          m.options.terserOptions.mangle = false
        }
      })
      return config
    },
  },
}
