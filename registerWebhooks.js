const fetch = require('node-fetch');
async function go() {
  const url = `https://peppol-sandbox.api.acubeapi.com/webhooks`;
  console.log('Fetching', url);
  const result = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.ACUBE_BEARER}`,
    },
    body: JSON.stringify({
      event: "outgoing-document",
      url: `${process.argv[2]}/acube-incoming`,
    }),
  });
  const obj = await result.json();
  console.log(JSON.stringify(obj, null, 2));
}

// ...
go();
