import app from './app.mjs';

const port = process.env.PORT || 8080;
const host = process.env.HOSTNAME || '0.0.0.0';

// Launch Node.js server
app.listen(port, host, () => {
    console.log(`Node.js API server is listening on http://${host}:${port}/`);
});
