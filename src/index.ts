import * as fetch from "node-fetch";

export class Peppol {
  service: any;
  session: any;
  constructor() {}
  addService(definition) {
    this.service = definition;
  }
  async ensureSession() {
    if (this.session) {
      return;
    }
    const result = await fetch("https://auth-sandbox.acubeapi.com/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: this.service.email,
        password: this.service.password,
      }),
    });
    this.session = await result.json();
    console.log("Acube session open", this.session);
  }
  async send(invoice: Buffer) {
    await this.ensureSession();
    const result = await fetch(
      "https://peppol-sandbox.api.acubeapi.com/invoices/outgoing/ubl",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/xml",
          Authorization: `Bearer ${this.session.token}`,
        },
        body: invoice,
      }
    );
    console.log("invoice sent", result);
  }
}
