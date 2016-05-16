import { createServer } from 'net';
import { readFileSync } from 'fs';

const f = readFileSync(`${__dirname}/bundle.js`);
const html = `
<!DOCTYPE HTML>
<html>
  <head>
    <style>
      body {
        margin: 0px;
        padding: 0px;
      }
    </style>
  </head>
  <body>
    <canvas id="world" width="1440" height="800"></canvas>
    <script>
      ${f.toString()}
    </script>
  </body>
</html>      
`;

const server = createServer((socket) => {
  socket.end(html);
});


server.on('error', (err) => {
  throw err;
});

// grab a random port.
server.listen(3333, () => {

  console.log('opened server on %j', server.address());

});