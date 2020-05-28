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
        rooms: req.body.rooms,
        estimate_requests: req.body.estimate_requests,
        description: req.body.description,
        type1: req.body.type1,
        type2: req.body.type2,
        type3: req.body.type3,
    });

    lead.size = "S";
    if (lead.type3 === "Full") {
        lead.size = "L";
        if (lead.stories > 2) {
            lead.size = "XL";
        } else if (lead.stories < 2) {
            lead.size = "M";
        }
    }

    if (lead.type1 === "Interior") {
        if (lead.rooms < 2) lead.size = "XS";
    }

    if (lead.type1 === "Both") {
        lead.size = "XL";
    }

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
    Lead.getAll((err, data) => {
        if (err) {
            res.status(500).send({
                message: err.message || "An error occured while retrieving leads.",
            });
        } else {
            data.forEach((lead) => {
                switch (lead.size) {
                    case "XL":
                        lead.price = 20;
                        break;
                    case "L":
                        lead.price = 15;
                        break;
                    case "S":
                        lead.price = 5;
                        break;
                    case "XS":
                        lead.price = 0;
                        break;
                    default:
                        lead.price = 10;
                }
                const createdAt = new Date(lead.created_at).valueOf();
                const nowDate = new Date().valueOf();
                const timeDiff = nowDate - createdAt;

                if (timeDiff > 604800000) {
                    lead.price -= 5;
                }

                if (timeDiff > 1209600000) {
                    lead.price -= 5;
                }

                if (timeDiff > 1814400000 || lead.price < 0) {
                    lead.price = 0;
                }
            });

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

// Purchase leads for user
exports.purchase = (req, res) => {
    Lead.purchase(req.body.userId, req.body.leadIds, (err, data) => {
        if (err) {
            res.status(500).send({
                message: err.message || "An error occured while purchasing the lead(s).",
            });
        } else {
            res.send({ message: "Lead(s) purchased successfully!" });
        }
    });
};
