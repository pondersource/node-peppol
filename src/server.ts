import { createServer } from "http";
import { createInvoice } from "peppol-billing";
import { Peppol } from "./index";

const creds = JSON.parse(process.env.CREDS);

async function go() {
  const peppol = new Peppol(process.env.WEBHOOKS_ROOT);
  peppol.addService(creds.acube);
  const invoice = await createInvoice();
  console.log("Invoice created, sending");
  peppol.send(invoice);
  createServer(peppol.handleWebhook).listen(process.env.PORT);
}

// ...
go();
