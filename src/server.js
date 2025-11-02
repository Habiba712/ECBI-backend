// ? (creates http server; attach socket.io here if you want)

const http = require('http');
const app = require('./app');
const { connectDB } = require('./config/db');
const { port } = require('./config');

async function start() {
  await connectDB();
  const server = http.createServer(app);
  server.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
  });
}

start();