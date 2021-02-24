import express from 'express';
import bodyParser from 'body-parser';
import PrettyError from 'pretty-error';
import Influx from 'influx';

const influxDbHost = process.env.INFLUXDB_HOST;
const influxDbDb = process.env.INFLUXDB_DB;
const influxDbUser = process.env.INFLUXDB_USER;
const influxDbPass = process.env.INFLUXDB_PASS;

const influx = new Influx.InfluxDB({
    host: influxDbHost,
    database: influxDbDb,
    username: influxDbUser,
    password: influxDbPass,
    schema: [
        {
            measurement: 'humidity',
            fields: {
                value: Influx.FieldType.FLOAT,
            },
            tags: [
                'tag_number'
            ]
        },
        {
            measurement: 'temperature',
            fields: {
                value: Influx.FieldType.FLOAT,
            },
            tags: [
                'tag_number'
            ]
        },
        {
            measurement: 'battery_voltage',
            fields: {
                value: Influx.FieldType.FLOAT,
            },
            tags: [
                'tag_number'
            ]
        }
    ]
});

const app = express();

console.log(`Starting up with InfluxDB host: ${influxDbHost}`);
app.set('trust proxy', 'loopback');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.post('/measurement', (req, res) => {
    const measurement = req.body;
    const timestamp = new Date();

    influx.writePoints([
        {
            measurement: 'humidity',
            tags: {tag_number: measurement.tag_id},
            fields: {value: measurement.humidity},
            timestamp,
        },
        {
            measurement: 'temperature',
            tags: {tag_number: measurement.tag_id},
            fields: {value: measurement.temp},
            timestamp,
        },
        {
            measurement: 'battery_voltage',
            tags: {tag_number: measurement.tag_id},
            fields: {value: measurement.battery},
            timestamp,
        }
    ]).then(() => {
        res.status(200).end();
    }).catch(error => {
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
