
OGC API Features client for cadastre OGC API Features
- with a tiny batching OGC API Features client

Steps

1) Get an api-key ( see <https://www.maanmittauslaitos.fi/rajapinnat/api-avaimen-ohje>
2) Replace 'INSERT-YOUR-API-KEY' with your api-key in ./data/style.json 
3) Prepare authenticated access (usually a proxy) to the Features service at <https://sopimus-paikkatieto.maanmittauslaitos.fi/kiinteisto-avoin/simple-features/v3>
4) Prepare a local NPM environment 
5) And then run
```
npm i
npm run build
npm start

```

6) Then open in browser at http://localhost:1234
