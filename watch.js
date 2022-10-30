const liveServer = require("live-server");
const options = {
    port: 8181,
    host: "0.0.0.0",
    open: true,
    ignore: '.git,.idea,node_modules',
    file: "index.html",
    wait: 1000,
    logLevel: 2,
};
liveServer.start(options);