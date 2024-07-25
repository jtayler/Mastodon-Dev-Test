const { merge } = require('webpack-merge');
const sharedConfig = require('./config/webpack/shared');
const { env } = require('./config/webpack/configuration');

let envConfig;
if (env.NODE_ENV === 'production') {
  envConfig = require('./config/webpack/production');
} else {
  envConfig = require('./config/webpack/development');
}

module.exports = merge(sharedConfig, envConfig);