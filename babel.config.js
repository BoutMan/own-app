module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    // Bundles drizzle/*.sql migrations as strings (see drizzle/migrations.js).
    plugins: [['inline-import', { extensions: ['.sql'] }]],
  };
};
