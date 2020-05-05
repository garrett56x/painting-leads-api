const sql = require("./db.js");

// constructor
const Authenticate = function(auth) {
    this.email = auth.email;
    this.password = auth.password;
};

Authenticate.login = (auth, result) => {
    sql.query(`SELECT id, password FROM Users WHERE email = "${auth.email}"`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            if (auth.password === res[0].password) {
                console.log("Successfully logged in!");
                result(null, { id: res[0].id });
            } else {
                console.log("Incorrect password.");
                result({ kinds: "failed_login" }, null);
            }
            return;
        }

        // User not found by email
        result({ kinds: "not_found" }, null);
    });
};

module.exports = Authenticate;
