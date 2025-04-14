const http = require('http');

const options = {
  hostname: 'localhost',
  port: process.env.PORT || 10000,
  path: '/api/health',
  method: 'GET',
  timeout: 2000,
};

const request = http.request(options, (res) => {
  if (res.statusCode === 200) {
    process.exit(0);
  } else {
    process.exit(1);
  }
});

request.on('error', (err) => {
  console.error('Health check failed:', err);
  process.exit(1);
});

request.end(); 