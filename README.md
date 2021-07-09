# node-peppol

*** UNDER CONSTRUCTION ***

Send and receive Peppol invoices.

This module is designed to run as a separate backend service, for instance on Amazon Lambda. It contains the code needed to execute webhooks for incoming and outgoing business documents. You can combine it with https://github.com/pondersource/invoice-gateway and for the GUI part, so users can connect their bookkeeping system, go through KYC checks, etcetera.

Example using an AP+SMP provider like Acube or Storecove:
```js
import { Peppol } from 'node-peppol';
import { createInvoice } from 'peppol-billing';

const peppol = new Peppol();

peppol.addService({
  acoveCredentials: {
    email: '...',
    password: '...'
  }
});

// Send a single invoice:
const invoice = createInvoice({
  sender: 'NLKVK::12345678',
  receiver: 'NLKVK::12345679',
  items: [
    {
      description: 'shampoo',
      quantity: 4,
      unitPrice: 1.50,
      currency: 'EUR'
    }
  ]
})
peppol.send(invoice, { service: SERVICE_ACUBE });
peppol.on('incoming', (invoice) => {
  console.log(invoice);
});
```


Integration with ERP systems:
```js
peppol.addIntegration({
  quickbooksCredentials: {
    clientId: '...',
    clientSecret: '...'
  }
});

// Connect a Peppol ID to an ERP system user:
peppol.connect('NLKVK::12345678', {
  integration: INTEGRATION_QUICKBOOKS,
  integrationAccess: {
    userId: '...',
    accessToken: '...',
    refreshToken: '...'
  },
  autoSend: true,
  autoReceive: true,
});
```

# Example

Edit `./creds.js`:
```js
module.exports = {
  // Contact antonino.caccamo@a-cube.io to become a reseller of A-Cube, and fill in the credentials
  // you get from them, here:
  acube: {
    email: "...",
    password: "..."
  },
  // Use https://invoice-gateway.herokuapp.com to obtain a Quickbooks access token for your sandbox
  // company there:
  quickbooks: {
    "x_refresh_token_expires_in": ...,
    "refresh_token": "...",
    "access_token": "...",
    "token_type": "bearer",
    "expires_in": ...
  }
};
```

Now run:
```sh
npm ci
npm run build
node ./example.js
```