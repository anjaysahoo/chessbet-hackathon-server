const collectionRoutes = require('./match');
const lichessProxyRoutes = require('./lichess-proxy');

module.exports = (app) => {
    app.use("/api", collectionRoutes);
    app.use("/api", lichessProxyRoutes);
};
