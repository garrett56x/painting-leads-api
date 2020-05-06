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
    sql.query("INSERT INTO Leads SET ?", newLead, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        console.log("created lead with Id: ", { id: res.insertId });
        result(null, { id: res.insertId, ...newLead });
    });
};

Lead.findById = (leadId, result) => {
    sql.query(`SELECT * FROM Leads WHERE id = ${leadId}`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            console.log("found lead with Id: ", res[0].id);
            result(null, res[0]);
            return;
        }

        // Lead not found by ID
        result({ kinds: "not_found" }, null);
    });
};

Lead.getAll = result => {
    sql.query("SELECT * FROM Leads", (err, res) => {
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
        `UPDATE Leads SET email = ?, phone = ?, name = ?, address1 = ?, address2 = ?, address3 = ?,
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

            console.log("updated lead with Id: ", id);
            result(null, { id, ...lead });
        }
    );
};

Lead.remove = (id, result) => {
    sql.query("DELETE FROM Leads WHERE id = ?", id, (err, res) => {
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
    const query = `SELECT Leads.*, UserLeads.notes,
                    UserLeads.updated_at as user_updated_at,
                    UserLeads.created_at as purchase_date
                    FROM UserLeads
                    JOIN Leads ON UserLeads.lead_id = Leads.id
                    AND UserLeads.user_id = ?`;

    sql.query(query, id, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        console.log("Returning all leads for User.");
        result(null, res);
    });
};

Lead.purchase = (userId, leadIds, result) => {
    let query = "INSERT INTO UserLeads (user_id, lead_id) VALUES ";
    const params = [];
    for (let i=0; i<leadIds.length; i++) {
        query += "(?,?)";
        if (i < leadIds.length - 1) query += ", ";
        params.push(userId);
        params.push(leadIds[i]);
    }

    sql.query(query, params, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        console.log("Returning all leads for User.");
        result(null, res);
    });
}

module.exports = Lead;
