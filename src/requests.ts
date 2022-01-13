import * as https from 'https';
import { Events } from './events';

interface RequestData {
    hostname: string,
    port: number,
    path: string,
    method: string,
    data?: object
}

type RequestCallback = (err: any, data?: any) => void;

class Requests extends Events {
    constructor() {
        super();
    }

    public request(opts: RequestData, callback?: RequestCallback) {
        opts.method = opts.method || 'GET';

        let options = {
            hostname: opts.hostname,
            port: opts.port,
            path: opts.path,
            method: opts.method,
            headers: {
                'Content-Type': '',
                'Content-Length': 0 
            }
        };

        let json = null;
        if (opts.data) {
            json = JSON.stringify(opts.data);

            options.headers['Content-Type'] = 'application/json';
            options.headers['Content-Length'] = json.length;
        }

        const req = https.request(options, res => {
            let total = '';
            res.on('data', d => {
                total += d;
            })
            res.on('end', () => {
                if (callback) 
                    callback(null, total);

                this.emit('req_data', total);
            });
        });

        req.on('error', err => {
            if (callback) 
                callback(err);
            this.emit('req_error', err);
        });

        if (json) {
            req.write(json);
        }
        req.end();
    }
}

export { Requests };