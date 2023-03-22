import http from 'http';

const promisifyReq = (url, config) => new Promise((done, fail) => {
    const chunks = [];
    const req = http.request(url, config, res => {
        res.on('error', fail);
        res.on('data', chunk => chunks.push(chunk));
        res.on('end', () => {
            try {
                const json = Buffer.concat(chunks).toString('utf-8');
                const data = JSON.parse(json);
                done(data);
            } catch(err) {
                fail(err);
            }
        });
    });
    req.on('error', fail);
    req.end();
});

class RestCli {
    constructor(url) {
        this.url = url;
    }
    get(path) {
        const url = this.url + path;
        return promisifyReq(url, {
            method: 'GET'
        });
    }
}

const skyfield = new RestCli('http://127.0.0.1:25601');

export default skyfield;
