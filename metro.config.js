const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);
// Drizzle migrations are imported as .sql files.
config.resolver.sourceExts.push('sql');
// sql.js WebAssembly binary for the web preview database.
config.resolver.assetExts.push('wasm');

module.exports = config;
