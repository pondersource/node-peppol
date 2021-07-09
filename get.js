const fetch = require('node-fetch');
async function go() {
  const url = `https://peppol-sandbox.api.acubeapi.com${process.argv[2]}`;
  console.log('Fetching', url);
  const result = await fetch(url, {
    headers: {
      Authorization: `Bearer ${process.env.ACUBE_BEARER}`,
    }
  });
  const obj = await result.json();
  console.log(JSON.stringify(obj, null, 2));
}

// ...
go();

