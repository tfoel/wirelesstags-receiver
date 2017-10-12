import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import PrettyError from 'pretty-error';
import moment from 'moment';
import axios from 'axios'

const esUrl = process.env.ES_URL || 'http://elasticsearch:9200/sensors/measurement';
const app = express();

console.log(`Starting up with ES URL: ${esUrl}`);
app.set('trust proxy', 'loopback');
app.use(
    cors({
        origin(origin, cb) {
            const whitelist = process.env.CORS_ORIGIN
                ? process.env.CORS_ORIGIN.split(',')
                : [];
            cb(null, whitelist.includes(origin));
        },
        credentials: true,
    }),
);

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.post('/measurement', (req, res) => {
    let measurement = req.body;

    measurement['@timestamp'] = moment().format();
    axios.post(esUrl, measurement)
        .then(() => {
            res.status(200).end();
        })
        .catch(error => {
            console.error(error);
            res.status(500).end();
        })
});

const pe = new PrettyError();
pe.skipNodeFiles();
pe.skipPackage('express');

app.use((err, req, res, next) => {
    process.stderr.write(pe.render(err));
    next();
});

export default app;
