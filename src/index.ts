import * as fetch from "node-fetch";
import { IncomingMessage, ServerResponse } from "http";
export const INTEGRATION_QUICKBOOKS = "quickbooks";

export type ServiceDefinition = {
  email: string;
  password: string;
};

export class Peppol {
  service: ServiceDefinition;
  session: { token: string };
  users: {
    [index: string]: {
      integration: string;
      integrationAccess: string;
    };
  };
  webhooksRoot: string;
  constructor(webhooksRoot: string) {
    this.webhooksRoot = webhooksRoot;
    this.users = {};
  }
  async registerWebhook(event: string): Promise<void> {
    console.log("registering webhook", event);
    const result = await fetch(
      "https://peppol-sandbox.api.acubeapi.com/webhooks",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.session.token}`,
        },
        body: JSON.stringify({
          event,
          url: `${this.webhooksRoot}/acube-incoming`,
        }),
      }
    );
    console.log(result);
  }
  async addService(definition: ServiceDefinition): Promise<void> {
    this.service = definition;
    if (this.webhooksRoot) {
      await this.registerWebhook("incoming-document");
      await this.registerWebhook("outgoing-document");
    }
  }
  async ensureSession(): Promise<void> {
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
  async send(invoice: Buffer): Promise<void> {
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
  async handleWebhook(
    req: IncomingMessage,
    res: ServerResponse
  ): Promise<void> {
    console.log(req.url);
    let str = "";
    req.on("data", (chunk) => {
      str += chunk;
    });
    req.on("end", () => {
      console.log("webhook post body", str);
    });
    res.writeHead(200);
    res.end("OK");
  }
  connect(
    peppolId: string,
    options: {
      integration: string;
      integrationAccess: string;
    }
  ): void {
    this.users[peppolId] = options;
  }
}
