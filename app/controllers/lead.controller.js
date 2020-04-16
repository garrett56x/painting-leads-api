const Lead = require("../models/lead.model.js");

// Create & Save a new lead
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content cannot be empty!",
        });
    }

    // Create a lead
    const lead = new Lead({
        email: req.body.email,
        phone: req.body.phone,
        name: req.body.name,
        address1: req.body.address1,
        address2: req.body.address2,
        address3: req.body.address3,
        city: req.body.city,
        state: req.body.state,
        zip: req.body.zip,
        stories: req.body.stories,
        estimate_requests: req.body.estimate_requests,
        description: req.body.description,
    });

    // Save lead in the database
    Lead.create(lead, (err, data) => {
        if (err) {
            res.status(500).send({
                message: err.message || "An error occured while creating the lead.",
            });
        } else {
            res.send(data);
        }
    });
};

// Retrieve all leads from the database.
exports.findAll = (req, res) => {
    console.log("IN LEADS?");
    Lead.getAll((err, data) => {
        if (err) {
            res.status(500).send({
                message: err.message || "An error occured while retrieving leads.",
            });
        } else {
            res.send(data);
        }
    });
};

// Find a single leads with a leadId
exports.findOne = (req, res) => {
    Lead.findById(req.params.leadId, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `lead with id ${req.params.leadId} not found.`,
                });
            } else {
                res.status(500).send({
                    message: `Error retrieving lead with id ${req.params.leadId}`,
                });
            }
        } else {
            res.send(data);
        }
    });
};

// Update a lead identified by the leadId in the request
exports.update = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content cannot be empty!",
        });
    }

    Lead.updateById(
        req.params.leadId,
        new Lead(req.body),
        (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Lead with id ${req.params.leadId} not found.`,
                    });
                } else {
                    res.status(500).send({
                        message: `Error updating lead with id ${req.params.leadId}`,
                    });
                }
            } else {
                res.send(data);
            }
        }
    );
};

// Delete a lead with the specified leadId in the request
exports.delete = (req, res) => {
    Lead.remove(req.params.leadId, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Lead with id ${req.params.leadId} not found.`,
                });
            } else {
                res.status(500).send({
                    message: `Could not delete lead with id ${req.params.leadId}`,
                });
            }
        } else {
            res.send({ message: "Lead was deleted successfully!" });
        }
    });
};
