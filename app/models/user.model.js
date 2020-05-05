const sql = require("./db.js");

// constructor
const User = function(user) {
    this.email = user.email;
    this.phone = user.phone;
    this.name = user.name;
    this.company = user.company;
    this.password = user.password;
};

User.create = (newUser, result) => {
    sql.query("INSERT INTO Users SET ?", newUser, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        console.log("created user: ", { id: res.insertId });
        result(null, { id: res.insertId, ...newUser });
    });
};

User.findById = (userId, result) => {
    sql.query(`SELECT * FROM Users WHERE id = ${userId}`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            console.log("found user with Id: ", res[0].id);
            result(null, res[0]);
            return;
        }

        // User not found by ID
        result({ kinds: "not_found" }, null);
    });
};

User.getAll = result => {
    sql.query("SELECT * FROM Users", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        console.log("Returning all Users.");
        result(null, res);
    });
};

User.updateById = (id, user, result) => {
    sql.query(
        "UPDATE Users SET email = ?, phone = ?, name = ?, company = ?, password = ?, WHERE id = ?",
        [user.email, user.phone, user.name, user.company, user.password, id],
        (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }

            if (res.affectedRows == 0) {
                // User not found by ID
                result({ kinds: "not_found" }, null);
                return;
            }

            console.log("updated user with Id: ", id);
            result(null, { id, ...user });
        }
    );
};

User.remove = (id, result) => {
    sql.query("DELETE FROM Users WHERE id = ?", id, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.affectedRows == 0) {
            // User not found by ID
            result({ kinds: "not_found" }, null);
            return;
        }

        console.log("deleted user with id: ", id);
        result(null, res);
    });
};

module.exports = User;
