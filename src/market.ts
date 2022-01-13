import * as crypto from 'crypto';
import * as http from 'http';
import * as https from 'https';
import { Requests } from './requests';
import { Context } from './context';

interface MarketOptions {
    hostname: string,
    path: string,
    port: number,
    userid: number,
    secret: string,
    transfer_path: string,
    purchase_path: string
}

type ContextCallback = (ctx: Context) => {};

interface HttpsCert {
    key: string,
    cert: string
}

class NeverloseMarket extends Requests {
    private options: MarketOptions

    constructor(options: MarketOptions) {
        super();

        options.hostname = options.hostname || 'neverlose.cc';
        options.path = options.path || '/api/market/';
        options.port = options.port || 443;
        options.transfer_path = options.transfer_path || '/balance_transfer';
        options.purchase_path = options.purchase_path || '/item_purchase';

        if (options.transfer_path[ options.transfer_path.length-1] == '/')
            options.transfer_path =  options.transfer_path.substring(0,  options.transfer_path.length-1);

        if (options.purchase_path[options.purchase_path.length-1] == '/')
            options.purchase_path = options.purchase_path.substring(0, options.purchase_path.length-1);

        this.options = options;
        this.on('http_request', this.on_http_request);
    }

    // Methods
    public give_for_free(code: string, username: string, callback?: ContextCallback) {
        this.market_request('give-for-free', {username:username,code:code,id:1338}, callback);
    }

    public transfer_money(username: string, amount: number, callback?: ContextCallback) {
        this.market_request('transfer-money', {username:username,amount:amount,id:1337}, callback);
    }

    public gift_product(username: string, cnt: number, callback?: ContextCallback) {
        this.market_request('gift-product', {username:username,cnt:cnt,id:2}, callback);
    }

    // Server utils
    public create_http_server(port?: number) {
        port = port || 80;

        const _this = this;
        http.createServer((req, res) => {
            this.http_waiter(_this, req, res);
        }).listen(port);
    }

    public create_https_server(cert: any, port?: number) {
        port = port || 443;

        const _this = this;
        http.createServer(cert, (req, res) => {
            this.http_waiter(_this, req, res);
        }).listen(port);
    }

    private http_waiter(_this: NeverloseMarket, req: any, res: any) {

        var total = '';
        req.on('data', (chunk: any) => {
            total += chunk.toString();
        });

        req.on('end', () => {
            _this.emit('http_request', req, res, total);
        });

        res.end();
    }

    private on_http_request(req: any, res: any, total: string)
    {
        try {
            const body = JSON.parse(total);
            if (body && this.validate_signature(body)) {
                let url = req.url;
                if (url[url.length-1] == '/')
                    url = url.substring(0, url.length-1);

                const is_transfer = url == this.options.transfer_path

                if (is_transfer || url == this.options.purchase_path) {
                    const ctx: Context = new Context(null, body);

                    this.emit(is_transfer && 'balance_transfer' || 'item_purchase', ctx);
                }
            }   
        } 
        catch (err: any) {
            this.on('http_error', err);
        }
    }

    // Utils
    public generate_signature(obj: any, secret?: string) {
        delete obj["signature"];

        secret = secret || this.options.secret;
        const str = (() => {
            const sorted = Object.keys(obj).sort().reduce(function (result: any, key: any) {
                result[key] = obj[key];
                return result;
            }, {});

            let res = '';
            for (let p in sorted) {
                if (sorted.hasOwnProperty(p))
                    res += p+sorted[p];
            }
            return res;
        })();

        const sha256 = crypto.createHash('sha256').update(str+secret).digest('hex');
        return sha256;
    }

    public validate_signature(obj: any, secret?: string) {
        secret = secret || this.options.secret;
        const sig = obj['signature'];
        delete obj['signature'];
        return sig == this.generate_signature(obj, secret);
    }

    private market_request(method: string, params: any, callback?: ContextCallback) {
        params.user_id = this.options.userid;
        params.signature = this.generate_signature(params);

        this.request({
            hostname: this.options.hostname,
            port: this.options.port,
            path: this.options.path + method,
            method: 'POST',
            data: params
        }, (err: any, data?: any) => {
            let json: any = {};
            if (!err) {
                try {
                    json = JSON.parse(data.toString());
                }
                catch (err) {}

                if (!json.success)
                    err = json.error;
            }

            if (err || this.validate_signature(json)) {
                for (let p in params) {
                    if (params.hasOwnProperty(p))
                        json[p] = params[p];
                }
                delete json['signature'];

                json.method = method;
                const out: Context = new Context(err, json);
                this.emit('market_request', out);

                if (callback) {
                    callback(out);
                }
            }
        });
    }
}

export { NeverloseMarket, MarketOptions };