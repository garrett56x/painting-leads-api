const sql = require("./db.js");

// constructor
const Lead = function(lead) {
    this.email = lead.email;
    this.phone = lead.phone;
    this.name = lead.name;
    this.address1 = lead.address1;
    this.address2 = lead.address2;
    this.address3 = lead.address3;
    this.city = lead.city;
    this.state = lead.state;
    this.zip = lead.zip;
    this.stories = lead.stories;
    this.estimate_requests = lead.estimate_requests;
    this.description = lead.description;
};

Lead.create = (newLead, result) => {
    sql.query("INSERT INTO leads SET ?", newLead, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        console.log("created lead: ", { id: result.insertId, ...newLead });
        result(null, { id: res.insertId, ...newLead });
    });
};

Lead.findById = (leadId, result) => {
    sql.query(`SELECT * FROM leads WHERE id = ${leadId}`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            console.log("found lead: ", res[0]);
            result(null, res[0]);
            return;
        }

        // Lead not found by ID
        result({ kinds: "not_found" }, null);
    });
};

Lead.getAll = result => {
    sql.query("SELECT * FROM leads", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        console.log("Returning all leads");
        result(null, res);
    });
};

Lead.updateById = (id, lead, result) => {
    sql.query(
        `UPDATE leads SET email = ?, phone = ?, name = ?, address1 = ?, address2 = ?, address3 = ?,
        city = ?, state = ?, zip = ?, stories = ?, estimate_requests = ?, description = ? WHERE id = ?`,
        [
            lead.email, lead.phone, lead.name, lead.address1, lead.address2, lead.address3,
            lead.city, lead.state, lead.zip, lead.stories, lead.estimate_requests, lead.description, id
        ],
        (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }

            if (res.affectedRows == 0) {
                // Lead not found by ID
                result({ kinds: "not_found" }, null);
                return;
            }

            console.log("updated lead: ", { id: id, ...lead });
            result(null, { id: id, ...lead });
        }
    );
};

Lead.remove = (id, result) => {
    sql.query("DELETE FROM leads WHERE id = ?", id, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.affectedRows == 0) {
            // Lead not found by ID
            result({ kinds: "not_found" }, null);
            return;
        }

        console.log("deleted lead with id: ", id);
        result(null, res);
    });
};

Lead.getLeadsForUser = (id, result) => {
    sql.query("SELECT * FROM user_leads WHERE user_id = ?", id, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        console.log("Returning all leads for User.");
        result(null, res);
    });
};

module.exports = Lead;
