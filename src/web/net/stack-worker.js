import { WASI } from "./../../vendor/browser_wasi_shim/src/index";
import { Iovec, Ciovec, EVENTTYPE_CLOCK, EVENTTYPE_FD_READ, EVENTTYPE_FD_WRITE } from "./../../vendor/browser_wasi_shim/src/wasi_defs";

onmessage = (msg) => {
    serveIfInitMsg(msg);
    var fds = [
        undefined, // 0: stdin
        undefined, // 1: stdout
        undefined, // 2: stderr
        undefined, // 3: receive certificates
        undefined, // 4: socket listenfd
        undefined, // 5: accepted socket fd (multi-connection is unsupported)
        // 6...: used by wasi shim
    ];
    var certfd = 3;
    var listenfd = 4;
    var args = ['arg0', '--certfd='+certfd, '--net-listenfd='+listenfd, '--debug'];
    var env = [];
    var wasi = new WASI(args, env, fds);
    wasiHack(wasi, certfd, 5);
    wasiHackSocket(wasi, listenfd, 5);
    const proxyWasmUrl = "https://ktock.github.io/container2wasm-demo/src/c2w-net-proxy.wasm";
    fetch(proxyWasmUrl).then((resp) => {
        resp['arrayBuffer']().then((wasm) => {
            WebAssembly.instantiate(wasm, {
                "wasi_snapshot_preview1": wasi.wasiImport,
                "env": envHack(wasi),
            }).then((inst) => {
                wasi.start(inst.instance);
            });
        })
    });
};

// definition from wasi-libc https://github.com/WebAssembly/wasi-libc/blob/wasi-sdk-19/expected/wasm32-wasi/predefined-macros.txt
const ERRNO_INVAL = 28;
const ERRNO_AGAIN= 6;

function wasiHack(wasi, certfd, connfd) {
    var certbuf = new Uint8Array(0);
    var _fd_close = wasi.wasiImport.fd_close;
    wasi.wasiImport.fd_close = (fd) => {
        if (fd == certfd) {
            sendCert(certbuf);
            return 0;
        }
        return _fd_close.apply(wasi.wasiImport, [fd]);
    }
    var _fd_fdstat_get = wasi.wasiImport.fd_fdstat_get;
    wasi.wasiImport.fd_fdstat_get = (fd, fdstat_ptr) => {
        if (fd == certfd) {
            return 0;
        }
        return _fd_fdstat_get.apply(wasi.wasiImport, [fd, fdstat_ptr]);
    }
    wasi.wasiImport.fd_fdstat_set_flags = (fd, fdflags) => {
        // TODO
        return 0;
    }
    var _fd_write = wasi.wasiImport.fd_write;
    wasi.wasiImport.fd_write = (fd, iovs_ptr, iovs_len, nwritten_ptr) => {
        if ((fd == 1) || (fd == 2) || (fd == certfd)) {
            var buffer = new DataView(wasi.inst.exports.memory.buffer);
            var buffer8 = new Uint8Array(wasi.inst.exports.memory.buffer);
            var iovecs = Ciovec.read_bytes_array(buffer, iovs_ptr, iovs_len);
            var wtotal = 0
            for (i = 0; i < iovecs.length; i++) {
                var iovec = iovecs[i];
                var buf = buffer8.slice(iovec.buf, iovec.buf + iovec.buf_len);
                if (buf.length == 0) {
                    continue;
                }
                console.log(new TextDecoder().decode(buf));
                if (fd == certfd) {
                    certbuf = appendData(certbuf, buf);
                }
                wtotal += buf.length;
            }
            buffer.setUint32(nwritten_ptr, wtotal, true);
            return 0;
        }
        console.log("fd_write: unknown fd " + fd);
        return _fd_write.apply(wasi.wasiImport, [fd, iovs_ptr, iovs_len, nwritten_ptr]);
    }
    wasi.wasiImport.poll_oneoff = (in_ptr, out_ptr, nsubscriptions, nevents_ptr) => {
        if (nsubscriptions == 0) {
            return ERRNO_INVAL;
        }
        let buffer = new DataView(wasi.inst.exports.memory.buffer);
        let in_ = Subscription.read_bytes_array(buffer, in_ptr, nsubscriptions);
        let isReadPollStdin = false;
        let isReadPollConn = false;
        let isClockPoll = false;
        let pollSubStdin;
        let pollSubConn;
        let clockSub;
        let timeout = Number.MAX_VALUE;
        for (let sub of in_) {
            if (sub.u.tag.variant == "fd_read") {
                if ((sub.u.data.fd != 0) && (sub.u.data.fd != connfd)) {
                    return ERRNO_INVAL; // only fd=0 and connfd is supported as of now (FIXME)
                }
                if (sub.u.data.fd == 0) {
                    isReadPollStdin = true;
                    pollSubStdin = sub;
                } else {
                    isReadPollConn = true;
                    pollSubConn = sub;
                }
            } else if (sub.u.tag.variant == "clock") {
                if (sub.u.data.timeout < timeout) {
                    timeout = sub.u.data.timeout
                    isClockPoll = true;
                    clockSub = sub;
                }
            } else {
                return ERRNO_INVAL; // FIXME
            }
        }
        let events = [];
        if (isReadPollStdin || isReadPollConn || isClockPoll) {
            var sockreadable = sockWaitForReadable(timeout / 1000000000);
            if (isReadPollConn) {
                if (sockreadable == errStatus) {
                    return ERRNO_INVAL;
                } else if (sockreadable == true) {
                    let event = new Event();
                    event.userdata = pollSubConn.userdata;
                    event.error = 0;
                    event.type = new EventType("fd_read");
                    events.push(event);
                }
            }
            if (isClockPoll) {
                let event = new Event();
                event.userdata = clockSub.userdata;
                event.error = 0;
                event.type = new EventType("clock");
                events.push(event);
            }
        }
        var len = events.length;
        Event.write_bytes_array(buffer, out_ptr, events);
        buffer.setUint32(nevents_ptr, len, true);
        return 0;
    }
}

function envHack(wasi){
    return {
        http_send: function(addressP, addresslen, reqP, reqlen, idP){
            var buffer = new DataView(wasi.inst.exports.memory.buffer);
            var address = new Uint8Array(wasi.inst.exports.memory.buffer, addressP, addresslen);
            var req = new Uint8Array(wasi.inst.exports.memory.buffer, reqP, reqlen);
            streamCtrl[0] = 0;
            postMessage({
                type: "http_send",
                address: address,
                req: req,
            });
            Atomics.wait(streamCtrl, 0, 0);
            if (streamStatus[0] < 0) {
                return ERRNO_INVAL;
            }
            var id = streamStatus[0];
            buffer.setUint32(idP, id, true);
            return 0;
        },
        http_writebody: function(id, bodyP, bodylen, nwrittenP, isEOF){
            var buffer = new DataView(wasi.inst.exports.memory.buffer);
            var body = new Uint8Array(wasi.inst.exports.memory.buffer, bodyP, bodylen);
            streamCtrl[0] = 0;
            postMessage({
                type: "http_writebody",
                id: id,
                body: body,
                isEOF: isEOF,
            });
            Atomics.wait(streamCtrl, 0, 0);
            if (streamStatus[0] < 0) {
                return ERRNO_INVAL;
            }
            buffer.setUint32(nwrittenP, bodylen, true);
            return 0;
        },
        http_isreadable: function(id, isOKP){
            var buffer = new DataView(wasi.inst.exports.memory.buffer);
            streamCtrl[0] = 0;
            postMessage({type: "http_isreadable", id: id});
            Atomics.wait(streamCtrl, 0, 0);
            if (streamStatus[0] < 0) {
                return ERRNO_INVAL;
            }
            var readable = 0;
            if (streamData[0] == 1) {
                readable = 1;
            }
            buffer.setUint32(isOKP, readable, true);
            return 0;
        },
        http_recv: function(id, respP, bufsize, respsizeP, isEOFP){
            var buffer = new DataView(wasi.inst.exports.memory.buffer);
            var buffer8 = new Uint8Array(wasi.inst.exports.memory.buffer);

            streamCtrl[0] = 0;
            postMessage({type: "http_recv", id: id, len: bufsize});
            Atomics.wait(streamCtrl, 0, 0);
            if (streamStatus[0] < 0) {
                return ERRNO_INVAL;
            }
            var ddlen = streamLen[0];
            var resp = streamData.slice(0, ddlen);
            buffer8.set(resp, respP);
            buffer.setUint32(respsizeP, ddlen, true);
            if (streamStatus[0] == 1) {
                buffer.setUint32(isEOFP, 1, true);
            } else {
                buffer.setUint32(isEOFP, 0, true);
            }
            return 0;
        },
        http_readbody: function(id, bodyP, bufsize, bodysizeP, isEOFP){
            var buffer = new DataView(wasi.inst.exports.memory.buffer);
            var buffer8 = new Uint8Array(wasi.inst.exports.memory.buffer);

            streamCtrl[0] = 0;
            postMessage({type: "http_readbody", id: id, len: bufsize});
            Atomics.wait(streamCtrl, 0, 0);
            if (streamStatus[0] < 0) {
                return ERRNO_INVAL;
            }
            var ddlen = streamLen[0];
            var body = streamData.slice(0, ddlen);
            buffer8.set(body, bodyP);
            buffer.setUint32(bodysizeP, ddlen, true);
            if (streamStatus[0] == 1) {
                buffer.setUint32(isEOFP, 1, true);
            } else {
                buffer.setUint32(isEOFP, 0, true);
            }
            return 0;
        }
    };
}

////////////////////////////////////////////////////////////
//
// utilities
//
////////////////////////////////////////////////////////////

var streamCtrl;
var streamStatus;
var streamLen;
var streamData;
function registerSocketBuffer(shared){
    streamCtrl = new Int32Array(shared, 0, 1);
    streamStatus = new Int32Array(shared, 4, 1);
    streamLen = new Int32Array(shared, 8, 1);
    streamData = new Uint8Array(shared, 12);
}

var numchunks;
function serveIfInitMsg(msg) {
    const req_ = msg.data;
    if (typeof req_ == "object"){
        if (req_.type == "init") {
            if (req_.buf) {
                var shared = req_.buf;
                registerSocketBuffer(shared);
            }
            numchunks = req_.chunks;
            return true;
        }
    }

    return false;
}

const errStatus = {
    val: 0,
};

function sockAccept(){
    streamCtrl[0] = 0;
    postMessage({type: "accept"});
    Atomics.wait(streamCtrl, 0, 0);
    return streamData[0] == 1;
}
function sockSend(data){
    streamCtrl[0] = 0;
    postMessage({type: "send", buf: data});
    Atomics.wait(streamCtrl, 0, 0);
    if (streamStatus[0] < 0) {
        errStatus.val = streamStatus[0]
        return errStatus;
    }
}
function sockRecv(len){
    streamCtrl[0] = 0;
    postMessage({type: "recv", len: len});
    Atomics.wait(streamCtrl, 0, 0);
    if (streamStatus[0] < 0) {
        errStatus.val = streamStatus[0]
        return errStatus;
    }
    let ddlen = streamLen[0];
    var res = streamData.slice(0, ddlen);
    return res;
}

function sockWaitForReadable(timeout){
    streamCtrl[0] = 0;
    postMessage({type: "recv-is-readable", timeout: timeout});
    Atomics.wait(streamCtrl, 0, 0);
    if (streamStatus[0] < 0) {
        errStatus.val = streamStatus[0]
        return errStatus;
    }
    return streamData[0] == 1;
}

function sendCert(data){
    streamCtrl[0] = 0;
    postMessage({type: "send_cert", buf: data});
    Atomics.wait(streamCtrl, 0, 0);
    if (streamStatus[0] < 0) {
        errStatus.val = streamStatus[0]
        return errStatus;
    }
}

function appendData(data1, data2) {
    let buf2 = new Uint8Array(data1.byteLength + data2.byteLength);
    buf2.set(new Uint8Array(data1), 0);
    buf2.set(new Uint8Array(data2), data1.byteLength);
    return buf2;
}

function wasiHackSocket(wasi, listenfd, connfd) {
    // definition from wasi-libc https://github.com/WebAssembly/wasi-libc/blob/wasi-sdk-19/expected/wasm32-wasi/predefined-macros.txt
    const ERRNO_INVAL = 28;
    const ERRNO_AGAIN= 6;
    var connfdUsed = false;
    var connbuf = new Uint8Array(0);
    var _fd_close = wasi.wasiImport.fd_close;
    wasi.wasiImport.fd_close = (fd) => {
        if (fd == connfd) {
            connfdUsed = false;
            return 0;
        }
        return _fd_close.apply(wasi.wasiImport, [fd]);
    }
    var _fd_read = wasi.wasiImport.fd_read;
    wasi.wasiImport.fd_read = (fd, iovs_ptr, iovs_len, nread_ptr) => {
        if (fd == connfd) {
            return wasi.wasiImport.sock_recv(fd, iovs_ptr, iovs_len, 0, nread_ptr, 0);
        }
        return _fd_read.apply(wasi.wasiImport, [fd, iovs_ptr, iovs_len, nread_ptr]);
    }
    var _fd_write = wasi.wasiImport.fd_write;
    wasi.wasiImport.fd_write = (fd, iovs_ptr, iovs_len, nwritten_ptr) => {
        if (fd == connfd) {
            return wasi.wasiImport.sock_send(fd, iovs_ptr, iovs_len, 0, nwritten_ptr);
        }
        return _fd_write.apply(wasi.wasiImport, [fd, iovs_ptr, iovs_len, nwritten_ptr]);
    }
    var _fd_fdstat_get = wasi.wasiImport.fd_fdstat_get;
    wasi.wasiImport.fd_fdstat_get = (fd, fdstat_ptr) => {
        if ((fd == listenfd) || (fd == connfd) && connfdUsed){
            let buffer = new DataView(wasi.inst.exports.memory.buffer);
            // https://github.com/WebAssembly/WASI/blob/snapshot-01/phases/snapshot/docs.md#-fdstat-struct
            buffer.setUint8(fdstat_ptr, 6); // filetype = 6 (socket_stream)
            buffer.setUint8(fdstat_ptr + 1, 2); // fdflags = 2 (nonblock)
            return 0;
        }
        return _fd_fdstat_get.apply(wasi.wasiImport, [fd, fdstat_ptr]);
    }
    wasi.wasiImport.sock_accept = (fd, flags, fd_ptr) => {
        if (fd != listenfd) {
            console.log("sock_accept: unknown fd " + fd);
            return ERRNO_INVAL;
        }
        if (connfdUsed) {
            console.log("sock_accept: multi-connection is unsupported");
            return ERRNO_INVAL;
        }
        if (!sockAccept()) {
            return ERRNO_AGAIN;
        }
        connfdUsed = true;
        var buffer = new DataView(wasi.inst.exports.memory.buffer);
        buffer.setUint32(fd_ptr, connfd, true);
        return 0;
    }
    wasi.wasiImport.sock_send = (fd, iovs_ptr, iovs_len, si_flags/*not defined*/, nwritten_ptr) => {
        if (fd != connfd) {
            console.log("sock_send: unknown fd " + fd);
            return ERRNO_INVAL;
        }
        var buffer = new DataView(wasi.inst.exports.memory.buffer);
        var buffer8 = new Uint8Array(wasi.inst.exports.memory.buffer);
        var iovecs = Ciovec.read_bytes_array(buffer, iovs_ptr, iovs_len);
        var wtotal = 0
        for (i = 0; i < iovecs.length; i++) {
            var iovec = iovecs[i];
            var buf = buffer8.slice(iovec.buf, iovec.buf + iovec.buf_len);
            if (buf.length == 0) {
                continue;
            }
            var ret = sockSend(buf.buffer.slice(0, iovec.buf_len));
            if (ret == errStatus) {
                return ERRNO_INVAL;
            }
            wtotal += buf.length;
        }
        buffer.setUint32(nwritten_ptr, wtotal, true);
        return 0;
    }
    wasi.wasiImport.sock_recv = (fd, iovs_ptr, iovs_len, ri_flags, nread_ptr, ro_flags_ptr) => {
        if (ri_flags != 0) {
            console.log("ri_flags are unsupported"); // TODO
        }
        if (fd != connfd) {
            console.log("sock_recv: unknown fd " + fd);
            return ERRNO_INVAL;
        }
        var sockreadable = sockWaitForReadable();
        if (sockreadable == errStatus) {
            return ERRNO_INVAL;
        } else if (sockreadable == false) {
            return ERRNO_AGAIN;
        }
        var buffer = new DataView(wasi.inst.exports.memory.buffer);
        var buffer8 = new Uint8Array(wasi.inst.exports.memory.buffer);
        var iovecs = Iovec.read_bytes_array(buffer, iovs_ptr, iovs_len);
        var nread = 0;
        for (i = 0; i < iovecs.length; i++) {
            var iovec = iovecs[i];
            if (iovec.buf_len == 0) {
                continue;
            }
            var data = sockRecv(iovec.buf_len);
            if (data == errStatus) {
                return ERRNO_INVAL;
            }
            buffer8.set(data, iovec.buf);
            nread += data.length;
        }
        buffer.setUint32(nread_ptr, nread, true);
        // TODO: support ro_flags_ptr
        return 0;
    }
    wasi.wasiImport.sock_shutdown = (fd, sdflags) => {
        if (fd == connfd) {
            connfdUsed = false;
        }
        return 0;
    }
}

////////////////////////////////////////////////////////////
//
// event-related classes adopted from the on-going discussion
// towards poll_oneoff support in browser_wasi_sim project.
// Ref: https://github.com/bjorn3/browser_wasi_shim/issues/14#issuecomment-1450351935
//
////////////////////////////////////////////////////////////

class EventType {
    /*:: variant: "clock" | "fd_read" | "fd_write"*/

    constructor(variant/*: "clock" | "fd_read" | "fd_write"*/) {
        this.variant = variant;
    }

    static from_u8(data/*: number*/)/*: EventType*/ {
        switch (data) {
        case EVENTTYPE_CLOCK:
            return new EventType("clock");
        case EVENTTYPE_FD_READ:
            return new EventType("fd_read");
        case EVENTTYPE_FD_WRITE:
            return new EventType("fd_write");
        default:
            throw "Invalid event type " + String(data);
        }
    }

    to_u8()/*: number*/ {
        switch (this.variant) {
        case "clock":
            return EVENTTYPE_CLOCK;
        case "fd_read":
            return EVENTTYPE_FD_READ;
        case "fd_write":
            return EVENTTYPE_FD_WRITE;
        default:
            throw "unreachable";
        }
    }
}

class Event {
    /*:: userdata: UserData*/
    /*:: error: number*/
    /*:: type: EventType*/
    /*:: fd_readwrite: EventFdReadWrite | null*/

    write_bytes(view/*: DataView*/, ptr/*: number*/) {
        view.setBigUint64(ptr, this.userdata, true);
        view.setUint8(ptr + 8, this.error);
        view.setUint8(ptr + 9, 0);
        view.setUint8(ptr + 10, this.type.to_u8());
        // if (this.fd_readwrite) {
        //     this.fd_readwrite.write_bytes(view, ptr + 16);
        // }
    }

    static write_bytes_array(view/*: DataView*/, ptr/*: number*/, events/*: Array<Event>*/) {
        for (let i = 0; i < events.length; i++) {
            events[i].write_bytes(view, ptr + 32 * i);
        }
    }
}

class SubscriptionClock {
    /*:: timeout: number*/

    static read_bytes(view/*: DataView*/, ptr/*: number*/)/*: SubscriptionFdReadWrite*/ {
        let self = new SubscriptionClock();
        self.timeout = Number(view.getBigUint64(ptr + 8, true));
        return self;
    }
}

class SubscriptionFdReadWrite {
    /*:: fd: number*/

    static read_bytes(view/*: DataView*/, ptr/*: number*/)/*: SubscriptionFdReadWrite*/ {
        let self = new SubscriptionFdReadWrite();
        self.fd = view.getUint32(ptr, true);
        return self;
    }
}

class SubscriptionU {
    /*:: tag: EventType */
    /*:: data: SubscriptionClock | SubscriptionFdReadWrite */

    static read_bytes(view/*: DataView*/, ptr/*: number*/)/*: SubscriptionU*/ {
        let self = new SubscriptionU();
        self.tag = EventType.from_u8(view.getUint8(ptr));
        switch (self.tag.variant) {
        case "clock":
            self.data = SubscriptionClock.read_bytes(view, ptr + 8);
            break;
        case "fd_read":
        case "fd_write":
            self.data = SubscriptionFdReadWrite.read_bytes(view, ptr + 8);
            break;
        default:
            throw "unreachable";
        }
        return self;
    }
}

class Subscription {
    /*:: userdata: UserData */
    /*:: u: SubscriptionU */

    static read_bytes(view/*: DataView*/, ptr/*: number*/)/*: Subscription*/ {
        let subscription = new Subscription();
        subscription.userdata = view.getBigUint64(ptr, true);
        subscription.u = SubscriptionU.read_bytes(view, ptr + 8);
        return subscription;
    }

    static read_bytes_array(view/*: DataView*/, ptr/*: number*/, len/*: number*/)/*: Array<Subscription>*/ {
        let subscriptions = [];
        for (let i = 0; i < len; i++) {
            subscriptions.push(Subscription.read_bytes(view, ptr + 48 * i));
        }
        return subscriptions;
    }
}
