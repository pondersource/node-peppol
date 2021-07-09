const peppolBilling = require("peppol-billing");
const Peppol = require('.').Peppol;
const creds = require("./creds.js");

async function go() {
  const peppol = new Peppol();
  peppol.addService(creds.acube);
  const invoice = await peppolBilling.createInvoice();
  console.log("Invoice created, sending");
  peppol.send(invoice);
}

// ...
go();
