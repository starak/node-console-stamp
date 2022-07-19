const { PassThrough } = require('stream');

class SpyStream extends PassThrough{
    constructor() {
        super();
        this._stream = [];
        this.on('data', d => this._stream.push(d.toString()));
    }

    get length(){
        return this._stream.length;
    }

    get last(){
        return this._stream[this._stream.length - 1];
    }

    flush(){
        this._stream = [];
    }

    get asArray(){
        return this._stream;
    }
}

module.exports = SpyStream;
