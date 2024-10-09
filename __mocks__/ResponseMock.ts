export class ResponseMock {
    body: any;
    status: number;
    headers: any;

    constructor(body: any, init: { status: number; headers?: any } = { status: 200 }) {
        this.body = body;
        this.status = init.status;
        this.headers = init.headers || {};
    }

    text() {
        return Promise.resolve(this.body);
    }

    json() {
        return Promise.resolve(JSON.parse(this.body));
    }
}
