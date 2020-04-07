const User = require("../models/user.model.js");

// Create & Save a new User
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content cannot be empty!",
        });
    }

    // Create a User
    const user = new User({
        email: req.body.email,
        phone: req.body.phone,
        name: req.body.name,
        company: req.body.company,
        active: req.body.active,
        admin: req.body.admin,
    });

    // Save User in the database
    User.create(user, (err, data) => {
        if (err) {
            res.status(500).send({
                message: err.message || "An error occured while creating the User.",
            });
        } else {
            res.send(data);
        }
    });
};

// Retrieve all Users from the database.
exports.findAll = (req, res) => {
    User.getAll((err, data) => {
        if (err) {
            res.status(500).send({
                message: err.message || "An error occured while retrieving users.",
            });
        } else {
            res.send(data);
        }
    });
};

// Find a single Users with a userId
exports.findOne = (req, res) => {
    User.findById(req.params.userId, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `User with id ${req.params.userId} not found.`,
                });
            } else {
                res.status(500).send({
                    message: `Error retrieving User with id ${req.params.userId}`,
                });
            }
        } else {
            res.send(data);
        }
    });
};

// Update a User identified by the userId in the request
exports.update = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content cannot be empty!",
        });
    }

    User.updateById(
        req.params.userId,
        new User(req.body),
        (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `User with id ${req.params.userId} not found.`,
                    });
                } else {
                    res.status(500).send({
                        message: `Error updating User with id ${req.params.userId}`,
                    });
                }
            } else {
                res.send(data);
            }
        }
    );
};

// Delete a User with the specified userId in the request
exports.delete = (req, res) => {
    User.remove(req.params.userId, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `User with id ${req.params.userId} not found.`,
                });
            } else {
                res.status(500).send({
                    message: `Could not delete User with id ${req.params.userId}`,
                });
            }
        } else {
            res.send({ message: "User was deleted successfully!" });
        }
    });
};
