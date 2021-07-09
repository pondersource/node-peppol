# node-peppol

*** UNDER CONSTRUCTION ***

Send and receive Peppol invoices.

This module is meant to run as a backend service, you can combine it with https://github.com/pondersource/invoice-gateway for the GUI part.

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