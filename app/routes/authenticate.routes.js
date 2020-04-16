module.exports = app => {
    const authenticate = require("../controllers/authenticate.controller.js");

    // Authenticate user
    app.post("/authenticate", authenticate.login);
};
