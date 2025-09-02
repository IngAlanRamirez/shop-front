/* Configuracion de proxys en local*/
/* Para evitar la configuracion de CORS*/

const PROXY_CONFIG = [
  {
    /* url cortas*/
    context: [
      "/products",
      "/users",
      "/sales",
      "/auth",
    ],
    /*target para dev*/
    target: "http://localhost:3000",
    secure: false,
    changeOrigin: true,
  },
];

module.exports = PROXY_CONFIG;
