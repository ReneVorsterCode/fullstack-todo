const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  // app.use(
  //   "users/login",
  //   createProxyMiddleware({
  //     target: "http://localhost:8000",
  //     changeOrigin: true,
  //     followRedirects: true,
  //   })
  // );

  // app.use(
  //   "/login/data",
  //   createProxyMiddleware({
  //     target: "http://localhost:8000",
  //     changeOrigin: true,
  //     followRedirects: true,
  //   })
  // );

  // app.use(
  //   "/login/data/delete",
  //   createProxyMiddleware({
  //     target: "http://localhost:8000",
  //     changeOrigin: true,
  //     followRedirects: true,
  //   })
  // );

  app.use(
    "/users",
    createProxyMiddleware({
      target: "http://localhost:8000",
      changeOrigin: true,
      followRedirects: true,
    })
  );
};
