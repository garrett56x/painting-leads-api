module.exports = app => {
    const leads = require("../controllers/lead.controller.js");

    // Create a new lead
    app.post("/leads", leads.create);

    // Retrieve all leads
    app.get("/leads", leads.findAll);

    // Retrieve a single lead with leadId
    app.get("/leads/:leadId", leads.findOne);

    // Update a lead with leadId
    app.put("/leads/:leadId", leads.update);

    // Delete a lead with leadId
    app.delete("/leads/:leadId", leads.delete);

    // Purchase leads for user
    app.post("/leads/purchase", leads.purchase);
};
