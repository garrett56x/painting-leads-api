const Authenticate = require("../models/authenticate.model.js");

exports.login = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content cannot be empty!",
        });
    }

    const lead = new Authenticate({
        email: req.body.email,
        password: req.body.password,
    });

    Authenticate.login(lead, (err, data) => {
        if (err) {
            if (err.kind === "failed_login") {
                res.status(401).send({
                    message: "Failed login attempt",
                });
            } else if (err.kind === "not_found") {
                res.status(404).send({
                    message: "No user found for provided email.",
                });
            } else {
                res.status(500).send({
                    message: `Error logging in.`,
                });
            }
        } else {
            res.send(data);
        }
    });
};
