import { ptr, size, u16, u32, u64, s64, u8, cstring, byte, bytes } from './baseTypes';
import { ArgumentTransfer, MemoryTransferDirection, WasiFunctionSignature, ArgumentsTransfer, CustomMemoryTransfer } from './wasiMeta';
export type fd = u32;
export type exitcode = u32;
export type errno = u16;
export declare namespace Errno {
    /**
     * No error occurred. System call completed successfully.
     */
    const success = 0;
    /**
     * Argument list too long.
     */
    const toobig = 1;
    /**
     *  Permission denied.
     */
    const acces = 2;
    /**
     * Address in use.
     */
    const addrinuse = 3;
    /**
     * Address not available.
     */
    const addrnotavail = 4;
    /**
     * Address family not supported.
     */
    const afnosupport = 5;
    /**
     * Resource unavailable, or operation would block.
     */
    const again = 6;
    /**
     * Connection already in progress.
     */
    const already = 7;
    /**
     * Bad file descriptor.
     */
    const badf = 8;
    /**
     * Bad message.
     */
    const badmsg = 9;
    /**
     * Device or resource busy.
     */
    const busy = 10;
    /**
     * Operation canceled.
     */
    const canceled = 11;
    /**
     *  No child processes.
     */
    const child = 12;
    /**
     * Connection aborted.
     */
    const connaborted = 13;
    /**
     * Connection refused.
     */
    const connrefused = 14;
    /**
     * Connection reset.
     */
    const connreset = 15;
    /**
     * Resource deadlock would occur.
     */
    const deadlk = 16;
    /**
     * Destination address required.
     */
    const destaddrreq = 17;
    /**
     * Mathematics argument out of domain of function.
     */
    const dom = 18;
    /**
     * Reserved.
     */
    const dquot = 19;
    /**
     * File exists.
     */
    const exist = 20;
    /**
     * Bad address.
     */
    const fault = 21;
    /**
     * File too large.
     */
    const fbig = 22;
    /**
     * Host is unreachable.
     */
    const hostunreach = 23;
    /**
     * Identifier removed.
     */
    const idrm = 24;
    /**
     * Illegal byte sequence.
     */
    const ilseq = 25;
    /**
     * Operation in progress.
     */
    const inprogress = 26;
    /**
     * Interrupted function.
     */
    const intr = 27;
    /**
     * Invalid argument.
     */
    const inval = 28;
    /**
     * I/O error.
     */
    const io = 29;
    /**
     * Socket is connected.
     */
    const isconn = 30;
    /**
     * Is a directory.
     */
    const isdir = 31;
    /**
     * Too many levels of symbolic links.
     */
    const loop = 32;
    /**
     * File descriptor value too large.
     */
    const mfile = 33;
    /**
     * Too many links.
     */
    const mlink = 34;
    /**
     * Message too large.
     */
    const msgsize = 35;
    /**
     * Reserved.
     */
    const multihop = 36;
    /**
     * Filename too long.
     */
    const nametoolong = 37;
    /**
     * Network is down.
     */
    const netdown = 38;
    /**
     * Connection aborted by network.
     */
    const netreset = 39;
    /**
     * Network unreachable.
     */
    const netunreach = 40;
    /**
     * Too many files open in system.
     */
    const nfile = 41;
    /**
     * No buffer space available.
     */
    const nobufs = 42;
    /**
     * No such device.
     */
    const nodev = 43;
    /**
     * No such file or directory.
     */
    const noent = 44;
    /**
     * Executable file format error.
     */
    const noexec = 45;
    /**
     * No locks available.
     */
    const nolck = 46;
    /**
     * Reserved.
     */
    const nolink = 47;
    /**
     * Not enough space.
     */
    const nomem = 48;
    /**
     * No message of the desired type.
     */
    const nomsg = 49;
    /**
     * Protocol not available.
     */
    const noprotoopt = 50;
    /**
     * No space left on device.
     */
    const nospc = 51;
    /**
     * Function not supported.
     */
    const nosys = 52;
    /**
     * The socket is not connected.
     */
    const notconn = 53;
    /**
     * Not a directory or a symbolic link to a directory.
     */
    const notdir = 54;
    /**
     * Directory not empty.
     */
    const notempty = 55;
    /**
     * State not recoverable.
     */
    const notrecoverable = 56;
    /**
     * Not a socket.
     */
    const notsock = 57;
    /**
     * Not supported, or operation not supported on socket.
     */
    const notsup = 58;
    /**
     * Inappropriate I/O control operation.
     */
    const notty = 59;
    /**
     * No such device or address.
     */
    const nxio = 60;
    /**
     * Value too large to be stored in data type.
     */
    const overflow = 61;
    /**
     * Previous owner died.
     */
    const ownerdead = 62;
    /**
     * Operation not permitted.
     */
    const perm = 63;
    /**
     * Broken pipe.
     */
    const pipe = 64;
    /**
     * Protocol error.
     */
    const proto = 65;
    /**
     * Protocol not supported.
     */
    const protonosupport = 66;
    /**
     * Protocol wrong type for socket.
     */
    const prototype = 67;
    /**
     * Result too large.
     */
    const range = 68;
    /**
     * Read-only file system.
     */
    const rofs = 69;
    /**
     * Invalid seek.
     */
    const spipe = 70;
    /**
     * No such process.
     */
    const srch = 71;
    /**
     * Reserved.
     */
    const stale = 72;
    /**
     * Connection timed out.
     */
    const timedout = 73;
    /**
     * Text file busy.
     */
    const txtbsy = 74;
    /**
     * Cross-device link.
     */
    const xdev = 75;
    /**
     * Extension: Capabilities insufficient.
     */
    const notcapable = 76;
    function toString(value: errno): string;
}
export declare class WasiError extends Error {
    readonly errno: errno;
    constructor(errno: errno);
}
export type rights = u64;
export declare namespace Rights {
    /**
     * The right to invoke fd_datasync. If path_open is set, includes the right
     * to invoke path_open with fdflags::dsync.
     */
    const fd_datasync: bigint;
    /**
     * The right to invoke fd_read and sock_recv. If rights::fd_seek is set,
     * includes the right to invoke fd_pread.
     */
    const fd_read: bigint;
    /**
     * The right to invoke fd_seek. This flag implies rights::fd_tell.
     */
    const fd_seek: bigint;
    /**
     * The right to invoke fd_fdstat_set_flags.
     */
    const fd_fdstat_set_flags: bigint;
    /**
     * The right to invoke fd_sync. If path_open is set, includes the right to
     * invoke path_open with fdflags::rsync and fdflags::dsync.
     */
    const fd_sync: bigint;
    /**
     * The right to invoke fd_seek in such a way that the file offset remains
     * unaltered (i.e., whence::cur with offset zero), or to invoke fd_tell.
     */
    const fd_tell: bigint;
    /**
     * The right to invoke fd_write and sock_send. If rights::fd_seek is set,
     * includes the right to invoke fd_pwrite.
     */
    const fd_write: bigint;
    /**
     * The right to invoke fd_advise.
     */
    const fd_advise: bigint;
    /**
     * The right to invoke fd_allocate.
     */
    const fd_allocate: bigint;
    /**
     * The right to invoke path_create_directory.
     */
    const path_create_directory: bigint;
    /**
     * If path_open is set, the right to invoke path_open with oflags::creat.
     */
    const path_create_file: bigint;
    /**
     * The right to invoke path_link with the file descriptor as the source
     * directory.
     */
    const path_link_source: bigint;
    /**
     * The right to invoke path_link with the file descriptor as the target
     * directory.
     */
    const path_link_target: bigint;
    /**
     * The right to invoke path_open.
     */
    const path_open: bigint;
    /**
     * The right to invoke fd_readdir.
     */
    const fd_readdir: bigint;
    /**
     * The right to invoke path_readlink.
     */
    const path_readlink: bigint;
    /**
     * The right to invoke path_rename with the file descriptor as the source
     * directory.
     */
    const path_rename_source: bigint;
    /**
     * The right to invoke path_rename with the file descriptor as the target
     * directory.
     */
    const path_rename_target: bigint;
    /**
     * The right to invoke path_filestat_get.
     */
    const path_filestat_get: bigint;
    /**
     * The right to change a file's size (there is no path_filestat_set_size).
     * If path_open is set, includes the right to invoke path_open with
     * oflags::trunc.
     */
    const path_filestat_set_size: bigint;
    /**
     * The right to invoke path_filestat_set_times.
     */
    const path_filestat_set_times: bigint;
    /**
     * The right to invoke fd_filestat_get.
     */
    const fd_filestat_get: bigint;
    /**
     * The right to invoke fd_filestat_set_size.
     */
    const fd_filestat_set_size: bigint;
    /**
     * The right to invoke fd_filestat_set_times.
     */
    const fd_filestat_set_times: bigint;
    /**
     * The right to invoke path_symlink.
     */
    const path_symlink: bigint;
    /**
     * The right to invoke path_remove_directory.
     */
    const path_remove_directory: bigint;
    /**
     * The right to invoke path_unlink_file.
     */
    const path_unlink_file: bigint;
    /**
     * If rights::fd_read is set, includes the right to invoke poll_oneoff to
     * subscribe to eventtype::fd_read. If rights::fd_write is set, includes
     * the right to invoke poll_oneoff to subscribe to eventtype::fd_write.
     */
    const poll_fd_readwrite: bigint;
    /**
     * The right to invoke sock_shutdown.
     */
    const sock_shutdown: bigint;
    /**
     * The right to invoke sock_accept.
     */
    const sock_accept: bigint;
    const sock_recv: bigint;
    const sock_send: bigint;
    /**
     * Check if the given rights contain the requested rights.
     * @param rights The granted rights.
     * @param check The rights to check.
     * @returns true if the granted rights contain the rights to check.
     */
    function contains(rights: rights, check: rights): boolean;
    /**
     * Check if the given rights support the requested flags
     * @param rights The granted rights.
     * @param fdflags The requested flags.
     * @returns true if the granted rights support the given flags
     */
    function supportFdflags(rights: rights, fdflags: fdflags): boolean;
    /**
     * Check if the given rights support the requested flags
     * @param rights The granted rights.
     * @param fdflags The requested flags.
     * @returns true if the granted rights support the given flags
     */
    function supportOflags(rights: rights, oflags: oflags): boolean;
    /**
     * No rights
     */
    const None: rights;
    /**
     * All rights
     */
    const All: bigint;
    /**
     * All read rights in terms of modifying disk state.
     */
    const ReadOnly: bigint;
    function toString(value: rights): string;
}
export declare namespace Rights {
    const $param: import("./wasiMeta").BigintParam;
}
export type dircookie = u64;
export type fdflags = u16;
export declare namespace Fdflags {
    /**
     * No flags.
     */
    const none = 0;
    /**
     * Append mode: Data written to the file is always appended to the file's
     * end.
     */
    const append: number;
    function appendOn(value: fdflags): boolean;
    /**
     * Write according to synchronized I/O data integrity completion. Only the
     * data stored in the file is synchronized.
     */
    const dsync: number;
    function dsyncOn(value: fdflags): boolean;
    /**
     * Non-blocking mode.
     */
    const nonblock: number;
    function nonblockOn(value: fdflags): boolean;
    /**
     * Synchronized read I/O operations.
     */
    const rsync: number;
    function rsyncOn(value: fdflags): boolean;
    /**
     * Write according to synchronized I/O file integrity completion. In
     * addition to synchronizing the data stored in the file, the
     * implementation may also synchronously update the file's metadata.
     */
    const sync: number;
    function syncOn(value: fdflags): boolean;
    function toString(value: fdflags): string;
}
export declare namespace Fdflags {
    const $param: import("./wasiMeta").NumberParam;
}
export type lookupflags = u32;
export declare namespace Lookupflags {
    /**
     * No flags.
     */
    const none = 0;
    /**
     * As long as the resolved path corresponds to a symbolic link, it is
     * expanded.
     */
    const symlink_follow: number;
    function symlink_followOn(value: lookupflags): boolean;
    function toString(value: lookupflags): string;
}
export declare namespace Lookupflags {
    const $param: import("./wasiMeta").NumberParam;
}
export type oflags = u16;
export declare namespace Oflags {
    /**
     * No flags.
     */
    const none = 0;
    /**
     * Create file if it does not exist.
     */
    const creat: number;
    function creatOn(value: oflags): boolean;
    function creatOff(value: oflags): boolean;
    /**
     * Fail if not a directory.
     */
    const directory: number;
    function directoryOn(value: oflags): boolean;
    /**
     * Fail if file already exists.
     */
    const excl: number;
    function exclOn(value: oflags): boolean;
    /**
     * Truncate file to size 0.
     */
    const trunc: number;
    function truncOn(value: oflags): boolean;
    function toString(value: oflags): string;
}
export declare namespace Oflags {
    const $param: import("./wasiMeta").NumberParam;
}
export type clockid = u32;
export declare namespace Clockid {
    /**
     * The clock measuring real time. Time value zero corresponds with
     * 1970-01-01T00:00:00Z.
     */
    const realtime = 0;
    /**
     * The store-wide monotonic clock, which is defined as a clock measuring
     * real time, whose value cannot be adjusted and which cannot have negative
     * clock jumps. The epoch of this clock is undefined. The absolute time
     * value of this clock therefore has no meaning.
     */
    const monotonic = 1;
    /**
     * The CPU-time clock associated with the current process.
     */
    const process_cputime_id = 2;
    /**
     * The CPU-time clock associated with the current thread.
     */
    const thread_cputime_id = 3;
    function toString(value: clockid): string;
}
export declare namespace Clockid {
    const $param: import("./wasiMeta").NumberParam;
    const $transfer: ArgumentTransfer;
}
export type preopentype = u8;
export declare namespace Preopentype {
    /**
     * A pre-opened directory.
     */
    const dir = 0;
}
export type filetype = u8;
export declare namespace Filetype {
    /**
     * The type of the file descriptor or file is unknown or is different from
     * any of the other types specified.
     */
    const unknown = 0;
    /**
     * The file descriptor or file refers to a block device inode.
     */
    const block_device = 1;
    /**
     * The file descriptor or file refers to a character device inode.
     */
    const character_device = 2;
    /**
     * The file descriptor or file refers to a directory inode.
     */
    const directory = 3;
    /**
     * The file descriptor or file refers to a regular file inode.
     */
    const regular_file = 4;
    /**
     * The file descriptor or file refers to a datagram socket.
     */
    const socket_dgram = 5;
    /**
     * The file descriptor or file refers to a byte-stream socket.
     */
    const socket_stream = 6;
    /**
     * The file refers to a symbolic link inode.
     */
    const symbolic_link = 7;
    function toString(value: filetype): string;
}
export type advise = u8;
/**
 * File or memory access pattern advisory information.
 */
export declare namespace Advise {
    /**
     * The application has no advice to give on its behavior with respect to
     * the specified data.
     */
    const normal = 0;
    /**
     * The application expects to access the specified data sequentially from
     * lower offsets to higher offsets.
     */
    const sequential = 1;
    /**
     * The application expects to access the specified data in a random order.
     */
    const random = 2;
    /**
     * The application expects to access the specified data in the near future.
     */
    const willneed = 3;
    /**
     * The application expects that it will not access the specified data in
     * the near future.
     */
    const dontneed = 4;
    /**
     * The application expects to access the specified data once and then not
     * reuse it thereafter.
     */
    const noreuse = 5;
    function toString(value: advise): string;
}
export declare namespace Advise {
    const $ptr: import("./wasiMeta").PtrParam;
    const $param: import("./wasiMeta").NumberParam;
}
export type filesize = u64;
export declare namespace Filesize {
    const $ptr: import("./wasiMeta").PtrParam;
    const $param: import("./wasiMeta").BigintParam;
    const $transfer: ArgumentTransfer;
}
export type device = u64;
export type inode = u64;
export type linkcount = u64;
/** Timestamp in nanoseconds. */
export type timestamp = u64;
export type filestat = {
    /**
     * The memory location of the allocated struct.
     */
    get $ptr(): ptr;
    /**
     * Device ID of device containing the file.
     */
    get dev(): device;
    set dev(value: device);
    /**
     * File serial number.
     */
    get ino(): inode;
    set ino(value: inode);
    /**
     * File type.
     */
    get filetype(): filetype;
    set filetype(value: filetype);
    /**
     * Number of hard links to the file.
     */
    get nlink(): linkcount;
    set nlink(value: linkcount);
    /**
     * For regular files, the file size in bytes. For symbolic links, the
     * length in bytes of the pathname contained in the symbolic link.
     */
    get size(): filesize;
    set size(value: filesize);
    /**
     * Last data access timestamp.
     */
    get atim(): timestamp;
    set atim(value: timestamp);
    /**
     * Last data modification timestamp.
     */
    get mtim(): timestamp;
    set mtim(value: timestamp);
    /**
     * Last file status change timestamp.
     */
    get ctim(): timestamp;
    set ctim(value: timestamp);
};
export declare namespace Filestat {
    /**
     * The size in bytes.
     */
    const size = 64;
    function create(memory: DataView, ptr: ptr): filestat;
    function createHeap(): filestat;
}
export declare namespace Filestat {
    const $ptr: import("./wasiMeta").PtrParam;
    const $transfer: ArgumentTransfer;
}
/**
 * Relative offset within a file.
 */
export type filedelta = s64;
/**
 * The position relative to which to set the offset of the file descriptor.
 */
export type whence = u8;
export declare namespace Whence {
    /**
     * Seek relative to start-of-file.
     */
    const set = 0;
    /**
     * Seek relative to current position.
     */
    const cur = 1;
    /**
     * Seek relative to end-of-file.
     */
    const end = 2;
    function toString(value: whence): string;
}
export declare namespace Whence {
    const $param: import("./wasiMeta").NumberParam;
}
export type fdstat = {
    /**
     * The memory location.
     */
    get $ptr(): ptr<fdstat>;
    /**
     *  File type.
     */
    get fs_filetype(): filetype;
    set fs_filetype(value: filetype);
    /**
     * File descriptor flags.
     */
    get fs_flags(): fdflags;
    set fs_flags(value: fdflags);
    /**
     * Rights that apply to this file descriptor.
     */
    get fs_rights_base(): rights;
    set fs_rights_base(value: rights);
    /**
     * Maximum set of rights that may be installed on new file descriptors
     * that are created through this file descriptor, e.g., through path_open.
     */
    get fs_rights_inheriting(): rights;
    set fs_rights_inheriting(value: rights);
};
export declare namespace Fdstat {
    /**
     * The size in bytes.
     */
    const size = 24;
    const alignment = 8;
    function create(memory: DataView, ptr: ptr): fdstat;
}
export declare namespace Fdstat {
    const $ptr: import("./wasiMeta").PtrParam;
    const $transfer: ArgumentTransfer;
}
export type fstflags = u16;
export declare namespace Fstflags {
    /**
     * Adjust the last data access timestamp to the value stored in
     * filestat::atim.
     */
    const atim: number;
    function atimOn(flags: fstflags): boolean;
    /**
     * Adjust the last data access timestamp to the time of clock
     * clockid::realtime.
     */
    const atim_now: number;
    function atim_nowOn(flags: fstflags): boolean;
    /**
     * Adjust the last data modification timestamp to the value stored in
     * filestat::mtim.
     */
    const mtim: number;
    function mtimOn(flags: fstflags): boolean;
    /**
     * Adjust the last data modification timestamp to the time of clock
     * clockid::realtime.
     */
    const mtim_now: number;
    function mtim_nowOn(flags: fstflags): boolean;
    function toString(value: fstflags): string;
}
export declare namespace Fstflags {
    const $param: import("./wasiMeta").NumberParam;
}
/**
 * The contents of a $prestat when type is `PreOpenType.dir`
 */
export type prestat = {
    /**
     * The memory location.
     */
    get $ptr(): ptr;
    /**
     * Gets the pre-open type.
     */
    get preopentype(): preopentype;
    /**
     * Gets the pre-open type.
     */
    set preopentype(value: preopentype);
    /**
     * Gets the length of the pre opened directory name.
     */
    get len(): size;
    /**
     * Sets the length of the pre opened directory name.
     */
    set len(value: size);
};
export declare namespace Prestat {
    /**
     * The size in bytes.
     */
    const size: 8;
    const alignment: 4;
    function create(memory: DataView, ptr: ptr): prestat;
}
export declare namespace Prestat {
    const $ptr: import("./wasiMeta").PtrParam;
    const $transfer: ArgumentTransfer;
}
/**
 * A region of memory for scatter/gather reads.
 */
export type iovec = {
    /**
     * The memory location of the allocated struct.
     */
    get $ptr(): ptr;
    /**
     * The address of the buffer to be filled.
     */
    get buf(): ptr;
    set buf(value: ptr);
    /**
     * The length of the buffer to be filled.
     */
    get buf_len(): u32;
    set buf_len(value: u32);
};
export declare namespace Iovec {
    /**
     * The size in bytes.
     */
    const size: 8;
    function create(memory: DataView, ptr: ptr): iovec;
}
export declare namespace Iovec {
    const $ptr: import("./wasiMeta").PtrParam;
    function createTransfer(memory: DataView, iovec: ptr<iovec_array>, iovs_len: u32): ArgumentTransfer;
}
export type iovec_array = iovec[];
/**
 * A region of memory for scatter/gather writes.
 */
export type ciovec = {
    /**
     * The memory location of the allocated struct.
     */
    get $ptr(): ptr<ciovec>;
    /**
     * The address of the buffer to be written.
     */
    get buf(): ptr;
    set buf(value: ptr);
    /**
     * The length of the buffer to be written.
     */
    get buf_len(): u32;
    set buf_len(value: u32);
};
export declare namespace Ciovec {
    /**
     * The size in bytes.
     */
    const size: 8;
    function create(memory: DataView, ptr: ptr): ciovec;
}
export declare namespace Ciovec {
    const $ptr: import("./wasiMeta").PtrParam;
    function createTransfer(memory: DataView, ciovec: ptr<ciovec_array>, ciovs_len: u32): ArgumentTransfer;
}
export type ciovec_array = ciovec[];
export type dirnamlen = u32;
export type dirent = {
    /**
     * The memory location of the allocated struct.
     */
    get $ptr(): ptr;
    /**
     * The offset of the next directory entry stored in this directory.
     */
    get d_next(): dircookie;
    set d_next(value: dircookie);
    /**
     * The serial number of the file referred to by this directory entry.
     */
    get d_ino(): inode;
    set d_ino(value: inode);
    /**
     * The length of the name of the directory entry.
     */
    get d_namlen(): dirnamlen;
    set d_namlen(value: dirnamlen);
    /**
     * The type of the file referred to by this directory entry.
     */
    get d_type(): filetype;
    set d_type(value: filetype);
};
export declare namespace Dirent {
    const size: 24;
    function create(memory: DataView, ptr: ptr): dirent;
}
export declare namespace Dirent {
    const $ptr: import("./wasiMeta").PtrParam;
    function createTransfer(byteLength: number): ArgumentTransfer;
}
/**
 * Type of a subscription to an event or its occurrence.
 */
export type eventtype = u8;
export declare namespace Eventtype {
    /**
     * The time value of clock subscription_clock::id has reached timestamp
     * subscription_clock::timeout.
     */
    const clock = 0;
    /**
     * File descriptor subscription_fd_readwrite::file_descriptor has data
     * available for reading. This event always triggers for regular files.
     */
    const fd_read = 1;
    /**
     * File descriptor subscription_fd_readwrite::file_descriptor has capacity
     * available for writing. This event always triggers for regular files.
     */
    const fd_write = 2;
}
/**
 * The state of the file descriptor subscribed to with eventtype::fd_read or
 * eventtype::fd_write.
 */
export type eventrwflags = u16;
export declare namespace Eventrwflags {
    /**
     * The peer of this socket has closed or disconnected.
     */
    const fd_readwrite_hangup: number;
}
/**
 * The contents of an event when type is eventtype::fd_read or
 * eventtype::fd_write.
 */
export type event_fd_readwrite = {
    /**
     * The number of bytes available for reading or writing.
     */
    set nbytes(value: filesize);
    /**
     * The state of the file descriptor.
     */
    set flags(value: eventrwflags);
};
export declare namespace Event_fd_readwrite {
    const size = 16;
    const alignment = 8;
    function create(memory: DataView, ptr: ptr): event_fd_readwrite;
}
/**
 * User-provided value that may be attached to objects that is retained when
 * extracted from the implementation.
 */
export type userdata = u64;
/**
 * An event that occurred.
 */
export type event = {
    /**
     * User-provided value that got attached to subscription::userdata.
     */
    set userdata(value: userdata);
    /**
     *  If non-zero, an error that occurred while processing the subscription
     * request.
     */
    set error(value: errno);
    /**
     * The type of event that occurred.
     */
    set type(value: eventtype);
    /**
     * The contents of the event, if it is an eventtype::fd_read or
     * eventtype::fd_write. eventtype::clock events ignore this field.
     */
    get fd_readwrite(): event_fd_readwrite;
};
export declare namespace Event {
    const size = 32;
    const alignment = 8;
    function create(memory: DataView, ptr: ptr): event;
}
export declare namespace Event {
    const $ptr: import("./wasiMeta").PtrParam;
    function createTransfer(length: number): ArgumentTransfer;
}
export type subclockflags = u16;
export declare namespace Subclockflags {
    /**
     * If set, treat the timestamp provided in subscription_clock::timeout as an
     * absolute timestamp of clock subscription_clock::id. If clear, treat the
     * timestamp provided in subscription_clock::timeout relative to the current
     * time value of clock subscription_clock::id.
     */
    const subscription_clock_abstime: number;
}
/**
 * The contents of a subscription when type is eventtype::clock.
 */
export type subscription_clock = {
    /**
     * The clock against which to compare the timestamp.
     */
    get id(): clockid;
    /**
     * The absolute or relative timestamp in ns.
     */
    get timeout(): timestamp;
    /**
     * The amount of time that the implementation may wait additionally to
     * coalesce with other events.
     */
    get precision(): timestamp;
    /**
     * Flags specifying whether the timeout is absolute or relative.
     */
    get flags(): subclockflags;
};
export declare namespace Subscription_clock {
    const size = 32;
    const alignment = 8;
    function create(memory: DataView, ptr: ptr): subscription_clock;
}
/**
 * The contents of a subscription when type is type is eventtype::fd_read
 * or eventtype::fd_write.
 */
export type subscription_fd_readwrite = {
    /**
     * The file descriptor on which to wait for it to become ready for
     * reading or writing.
     */
    get file_descriptor(): fd;
};
export declare namespace Subscription_fd_readwrite {
    const size = 4;
    const alignment = 4;
    function create(memory: DataView, ptr: ptr): subscription_fd_readwrite;
}
export type subscription_u = {
    get type(): eventtype;
    get clock(): subscription_clock;
    get fd_read(): subscription_fd_readwrite;
    get fd_write(): subscription_fd_readwrite;
};
export declare namespace Subscription_u {
    const size = 40;
    const alignment = 8;
    const tag_size = 1;
    function create(memory: DataView, ptr: ptr): subscription_u;
}
/**
 * Subscription to an event.
 */
export type subscription = {
    /**
     * User-provided value that is attached to the subscription in the
     * implementation and returned through event::userdata.
     */
    get userdata(): userdata;
    /**
     * The type of the event to which to subscribe, and its contents
     */
    get u(): subscription_u;
};
export declare namespace Subscription {
    const size = 48;
    const alignment = 8;
    function create(memory: DataView, ptr: ptr): subscription;
}
export declare namespace Subscription {
    const $ptr: import("./wasiMeta").PtrParam;
    function createTransfer(length: number): ArgumentTransfer;
}
export type Literal<T> = {
    [P in keyof T]: T[P];
};
/**
 * Flags provided to sock_recv.
 */
export type riflags = u16;
/**
 * Flags provided to sock_recv.
 */
export declare namespace Riflags {
    /**
     * Returns the message without removing it from the socket's receive queue.
     */
    const recv_peek: number;
    /**
     * On byte-stream sockets, block until the full amount of data can be returned.
     */
    const recv_waitall: number;
    const $param: import("./wasiMeta").NumberParam;
}
/**
 * Flags returned by sock_recv.
 */
export type roflags = u16;
export declare namespace Roflags {
    /**
     * Returned by sock_recv: Message data has been truncated.
     */
    const recv_data_truncated: number;
    const $ptr: import("./wasiMeta").PtrParam;
    const $transfer: ArgumentTransfer;
}
/**
 * Flags provided to sock_send. As there are currently no flags defined, it
 * must be set to zero.
 */
export type siflags = u16;
export declare namespace Siflags {
    const $param: import("./wasiMeta").NumberParam;
}
/**
 * Which channels on a socket to shut down.
 */
export type sdflags = u8;
export declare namespace Sdflags {
    /**
     * Disables further receive operations.
     */
    const rd: number;
    /**
     * Disables further send operations.
     */
    const wr: number;
    function toString(value: sdflags): string;
}
export declare namespace Sdflags {
    const $param: import("./wasiMeta").NumberParam;
}
export declare namespace WasiPath {
    const $ptr: import("./wasiMeta").PtrParam;
    const $len: import("./wasiMeta").NumberParam;
    function createTransfer(path_len: size, direction: MemoryTransferDirection): ArgumentTransfer;
}
/**
 * Return command-line argument data sizes.
 *
 * @param argvCount_ptr A memory location to store the number of args.
 * @param argvBufSize_ptr A memory location to store the needed buffer size.
 */
export type args_sizes_get = (argvCount_ptr: ptr<u32>, argvBufSize_ptr: ptr<u32>) => errno;
export declare namespace args_sizes_get {
    const name: string;
    const signature: WasiFunctionSignature;
    function transfers(): ArgumentsTransfer;
    type ServiceSignature = (memory: ArrayBuffer, argvCount_ptr: ptr<u32>, argvBufSize_ptr: ptr<u32>) => Promise<errno>;
}
/**
 * Read command-line argument data. The size of the array should match that
 * returned by args_sizes_get. Each argument is expected to be \0 terminated.
 *
 * @params argv_ptr A memory location to store the argv value offsets
 * @params argvBuf_ptr A memory location to store the actual argv value.
 */
export type args_get = (argv_ptr: ptr<ptr<cstring>[]>, argvBuf_ptr: ptr<bytes>) => errno;
export declare namespace args_get {
    const name: string;
    const signature: WasiFunctionSignature;
    function transfers(_memory: DataView, argvCount: u32, argvBufSize: u32): CustomMemoryTransfer;
    type ServiceSignature = (memory: ArrayBuffer, argv_ptr: ptr<ptr<cstring>[]>, argvBuf_ptr: ptr<bytes>) => Promise<errno>;
}
/**
 * Return the resolution of a clock. Implementations are required to provide
 * a non-zero value for supported clocks. For unsupported clocks, return
 * errno::inval. Note: This is similar to clock_getres in POSIX.
 *
 * @param id The clock for which to return the resolution.
 * @param timestamp_ptr A memory location to store the actual result.
 */
export type clock_res_get = (id: clockid, timestamp_ptr: ptr<timestamp>) => errno;
export declare namespace clock_res_get {
    const name: string;
    const signature: WasiFunctionSignature;
    function transfers(): ArgumentsTransfer;
    type ServiceSignature = (memory: ArrayBuffer, id: clockid, timestamp_ptr: ptr<u64>) => Promise<errno>;
}
/**
 * Return the time value of a clock. Note: This is similar to clock_gettime
 * in POSIX.
 *
 * @param id The clock for which to return the time.
 * @param precision The maximum lag (exclusive) that the returned time
 * value may have, compared to its actual value.
 * @param timestamp_ptr: The time value of the clock.
 */
export type clock_time_get = (id: clockid, precision: timestamp, timestamp_ptr: ptr<u64>) => errno;
export declare namespace clock_time_get {
    const name: string;
    const signature: WasiFunctionSignature;
    function transfers(): ArgumentsTransfer;
    type ServiceSignature = (memory: ArrayBuffer, id: clockid, precision: timestamp, timestamp_ptr: ptr<u64>) => Promise<errno>;
}
/**
 * Return environment variable data sizes.
 *
 * @param environCount_ptr A memory location to store the number of vars.
 * @param environBufSize_ptr  A memory location to store the needed buffer size.
 */
export type environ_sizes_get = (environCount_ptr: ptr<u32>, environBufSize_ptr: ptr<u32>) => errno;
export declare namespace environ_sizes_get {
    const name: string;
    const signature: WasiFunctionSignature;
    function transfers(): ArgumentsTransfer;
    type ServiceSignature = (memory: ArrayBuffer, environCount_ptr: ptr<u32>, environBufSize_ptr: ptr<u32>) => Promise<errno>;
}
/**
 * Read environment variable data. The sizes of the buffers should match
 * that returned by environ_sizes_get. Key/value pairs are expected to
 * be joined with =s, and terminated with \0s.
 *
 * @params environ_ptr A memory location to store the env value offsets
 * @params environBuf_ptr A memory location to store the actual env value.
 */
export type environ_get = (environ_ptr: ptr<ptr<cstring>[]>, environBuf_ptr: ptr<bytes>) => errno;
export declare namespace environ_get {
    const name: string;
    const signature: WasiFunctionSignature;
    function transfers(_memory: DataView, argvCount: u32, argvBufSize: u32): CustomMemoryTransfer;
    type ServiceSignature = (memory: ArrayBuffer, environ_ptr: ptr<ptr<cstring>[]>, environBuf_ptr: ptr<bytes>) => Promise<errno>;
}
/**
 * Provide file advisory information on a file descriptor. Note: This is
 * similar to posix_fadvise in POSIX.
 *
 * @param fd The file descriptor.
 * @param offset The offset within the file to which the advisory applies.
 * @param length The length of the region to which the advisory applies.
 * @param advise The advice.
 */
export type fd_advise = (fd: fd, offset: filesize, length: filesize, advise: advise) => errno;
export declare namespace fd_advise {
    const name: string;
    const signature: WasiFunctionSignature;
    type ServiceSignature = (memory: ArrayBuffer, fd: fd, offset: filesize, length: filesize, advise: advise) => Promise<errno>;
}
/**
 * Force the allocation of space in a file. Note: This is similar to
 * posix_fallocate in POSIX.
 *
 * @param fd The file descriptor.
 * @param offset The offset at which to start the allocation.
 * @param len The length of the area that is allocated.
 */
export type fd_allocate = (fd: fd, offset: filesize, len: filesize) => errno;
export declare namespace fd_allocate {
    const name: string;
    const signature: WasiFunctionSignature;
    type ServiceSignature = (memory: ArrayBuffer, fd: fd, offset: filesize, len: filesize) => Promise<errno>;
}
/**
 * Close a file descriptor. Note: This is similar to close in POSIX.
 *
 * @param fd The file descriptor.
 */
export type fd_close = (fd: fd) => errno;
export declare namespace fd_close {
    const name: string;
    const signature: WasiFunctionSignature;
    type ServiceSignature = (memory: ArrayBuffer, fd: fd) => Promise<errno>;
}
/**
 * Synchronize the data of a file to disk. Note: This is similar to
 * fdatasync in POSIX.
 *
 * @param fd The file descriptor.
 */
export type fd_datasync = (fd: fd) => errno;
export declare namespace fd_datasync {
    const name: string;
    const signature: WasiFunctionSignature;
    type ServiceSignature = (memory: ArrayBuffer, fd: fd) => Promise<errno>;
}
/**
 * Get the attributes of a file descriptor. Note: This returns similar
 * flags to fsync(fd, F_GETFL) in POSIX, as well as additional fields.
 *
 * @param fd The file descriptor.
 * @param fdstat_ptr A pointer to store the result.
 */
export type fd_fdstat_get = (fd: fd, fdstat_ptr: ptr<fdstat>) => errno;
export declare namespace fd_fdstat_get {
    const name: string;
    const signature: WasiFunctionSignature;
    function transfers(): ArgumentsTransfer;
    type ServiceSignature = (memory: ArrayBuffer, fd: fd, fdstat_ptr: ptr<fdstat>) => Promise<errno>;
}
/**
 * Adjust the flags associated with a file descriptor. Note: This is similar
 * to fcntl(fd, F_SETFL, flags) in POSIX.
 *
 * @param fd The file descriptor.
 * @param fdflags The desired values of the file descriptor flags.
 */
export type fd_fdstat_set_flags = (fd: fd, fdflags: fdflags) => errno;
export declare namespace fd_fdstat_set_flags {
    const name: string;
    const signature: WasiFunctionSignature;
    type ServiceSignature = (memory: ArrayBuffer, fd: fd, fdflags: fdflags) => Promise<errno>;
}
/**
 * Return the attributes of an open file.
 *
 * @param fd The file descriptor.
 * @param filestat_ptr The buffer where the file's attributes are stored.
 */
export type fd_filestat_get = (fd: fd, filestat_ptr: ptr<filestat>) => errno;
export declare namespace fd_filestat_get {
    const name: string;
    const signature: WasiFunctionSignature;
    function transfers(): ArgumentsTransfer;
    type ServiceSignature = (memory: ArrayBuffer, fd: fd, filestat_ptr: ptr<filestat>) => Promise<errno>;
}
/**
 * Adjust the size of an open file. If this increases the file's size, the
 * extra bytes are filled with zeros. Note: This is similar to ftruncate in
 * POSIX.
 *
 * @param fd The file descriptor.
 * @param size: The desired file size.
 */
export type fd_filestat_set_size = (fd: fd, size: filesize) => errno;
export declare namespace fd_filestat_set_size {
    const name: string;
    const signature: WasiFunctionSignature;
    type ServiceSignature = (memory: ArrayBuffer, fd: fd, size: filesize) => Promise<errno>;
}
/**
 * Adjust the timestamps of an open file or directory. Note: This is similar
 * to futimens in POSIX.
 *
 * @param fd The file descriptor.
 * @param atim The desired values of the data access timestamp.
 * @param mtim The desired values of the data modification timestamp.
 * @param fst_flags A bitmask indicating which timestamps to adjust.
 */
export type fd_filestat_set_times = (fd: fd, atim: timestamp, mtim: timestamp, fst_flags: fstflags) => errno;
export declare namespace fd_filestat_set_times {
    const name: string;
    const signature: WasiFunctionSignature;
    type ServiceSignature = (memory: ArrayBuffer, fd: fd, atim: timestamp, mtim: timestamp, fst_flags: fstflags) => Promise<errno>;
}
/**
 * Read from a file descriptor, without using and updating the file
 * descriptor's offset. Note: This is similar to preadv in POSIX.
 *
 * @param fd The file descriptor.
 * @param iovs_ptr List of scatter/gather vectors in which to store data.
 * @param iovs_len The length of the iovs.
 * @param offset The offset within the file at which to read.
 * @param bytesRead_ptr A memory location to store the bytes read.
 */
export type fd_pread = (fd: fd, iovs_ptr: ptr<iovec[]>, iovs_len: u32, offset: filesize, bytesRead_ptr: ptr<u32>) => errno;
export declare namespace fd_pread {
    const name: string;
    const signature: WasiFunctionSignature;
    function transfers(memory: DataView, iovs_ptr: ptr<iovec[]>, iovs_len: u32): ArgumentsTransfer;
    type ServiceSignature = (memory: ArrayBuffer, fd: fd, iovs_ptr: ptr<iovec[]>, iovs_len: u32, offset: filesize, bytesRead_ptr: ptr<u32>) => Promise<errno>;
}
/**
 * Return a description of the given preopened file descriptor.
 *
 * @param fd The file descriptor.
 * @param bufPtr A pointer to store the pre stat information.
 */
export type fd_prestat_get = (fd: fd, bufPtr: ptr<prestat>) => errno;
export declare namespace fd_prestat_get {
    const name: string;
    const signature: WasiFunctionSignature;
    function transfers(): ArgumentsTransfer;
    type ServiceSignature = (memory: ArrayBuffer, fd: fd, bufPtr: ptr<prestat>) => Promise<errno>;
}
/**
 * Return a description of the given preopened file descriptor.
 *
 * @param fd The file descriptor.
 * @param pathPtr A memory location to store the path name.
 * @param pathLen The length of the path.
 */
export type fd_prestat_dir_name = (fd: fd, pathPtr: ptr<byte[]>, pathLen: size) => errno;
export declare namespace fd_prestat_dir_name {
    const name: string;
    const signature: WasiFunctionSignature;
    function transfers(_memory: DataView, _pathPtr: ptr<byte[]>, pathLen: size): ArgumentsTransfer;
    type ServiceSignature = (memory: ArrayBuffer, fd: fd, pathPtr: ptr<byte[]>, pathLen: size) => Promise<errno>;
}
/**
 * Write to a file descriptor, without using and updating the file
 * descriptor's offset. Note: This is similar to pwritev in POSIX.
 *
 * @param fd
 * @param ciovs_ptr List of scatter/gather vectors from which to retrieve data.
 * @param ciovs_len The length of the iovs.
 * @param offset The offset within the file at which to write.
 * @param bytesWritten_ptr A memory location to store the bytes written.
 */
export type fd_pwrite = (fd: fd, ciovs_ptr: ptr<ciovec>, ciovs_len: u32, offset: filesize, bytesWritten_ptr: ptr<u32>) => errno;
export declare namespace fd_pwrite {
    const name: string;
    const signature: WasiFunctionSignature;
    function transfers(memory: DataView, ciovs_ptr: ptr<ciovec>, ciovs_len: u32): ArgumentsTransfer;
    type ServiceSignature = (memory: ArrayBuffer, fd: fd, ciovs_ptr: ptr<ciovec>, ciovs_len: u32, offset: filesize, bytesWritten_ptr: ptr<u32>) => Promise<errno>;
}
/**
 * Read from a file descriptor. Note: This is similar to readv in POSIX.
 *
 * @param fd The file descriptor.
 * @param iovs_ptr List of scatter/gather vectors in which to store data.
 * @param iovs_len The length of the iovs.
 * @param bytesRead_ptr A memory location to store the bytes read.
 */
export type fd_read = (fd: fd, iovs_ptr: ptr<iovec>, iovs_len: u32, bytesRead_ptr: ptr<u32>) => errno;
export declare namespace fd_read {
    const name: string;
    const signature: WasiFunctionSignature;
    function transfers(memory: DataView, iovs_ptr: ptr<iovec>, iovs_len: u32): ArgumentsTransfer;
    type ServiceSignature = (memory: ArrayBuffer, fd: fd, iovs_ptr: ptr<iovec>, iovs_len: u32, bytesRead_ptr: ptr<u32>) => Promise<errno>;
}
/**
 * Read directory entries from a directory. When successful, the contents of
 * the output buffer consist of a sequence of directory entries. Each
 * directory entry consists of a dirent object, followed by dirent::d_namlen
 * bytes holding the name of the directory entry. This function fills the
 * output buffer as much as possible, potentially truncating the last
 * directory entry. This allows the caller to grow its read buffer size in
 * case it's too small to fit a single large directory entry, or skip the
 * oversized directory entry.
 *
 * @param fd The file descriptor.
 * @param buf_ptr The buffer where directory entries are stored.
 * @param buf_len The length of the buffer.
 * @param cookie The location within the directory to start reading.
 * @param buf_used_ptr The number of bytes stored in the read buffer.
 * If less than the size of the read buffer, the end of the directory has
 * been reached.
 */
export type fd_readdir = (fd: fd, buf_ptr: ptr<dirent>, buf_len: size, cookie: dircookie, buf_used_ptr: ptr<u32>) => errno;
export declare namespace fd_readdir {
    const name: string;
    const signature: WasiFunctionSignature;
    function transfers(_memory: DataView, _buf_ptr: ptr<dirent>, buf_len: size): ArgumentsTransfer;
    type ServiceSignature = (memory: ArrayBuffer, fd: fd, buf_ptr: ptr<dirent>, buf_len: size, cookie: dircookie, buf_used_ptr: ptr<u32>) => Promise<errno>;
}
/**
 * Atomically replace a file descriptor by renumbering another file descriptor.
 * Due to the strong focus on thread safety, this environment does not provide
 * a mechanism to duplicate or renumber a file descriptor to an arbitrary number,
 * like dup2(). This would be prone to race conditions, as an actual file
 * descriptor with the same number could be allocated by a different thread
 * at the same time. This function provides a way to atomically renumber file
 * descriptors, which would disappear if dup2() were to be removed entirely.
 */
export type fd_renumber = (fd: fd, to: fd) => errno;
export declare namespace fd_renumber {
    const name: string;
    const signature: WasiFunctionSignature;
    type ServiceSignature = (memory: ArrayBuffer, fd: fd, to: fd) => Promise<errno>;
}
/**
 * Move the offset of a file descriptor. Note: This is similar to lseek in
 * POSIX.
 *
 * @param fd The file descriptor.
 * @param offset The number of bytes to move.
 * @param whence The base from which the offset is relative.
 * @param new_offset_ptr A memory location to store the new offset.
 */
export type fd_seek = (fd: fd, offset: filedelta, whence: whence, new_offset_ptr: ptr<u64>) => errno;
export declare namespace fd_seek {
    const name: string;
    const signature: WasiFunctionSignature;
    function transfers(): ArgumentsTransfer;
    type ServiceSignature = (memory: ArrayBuffer, fd: fd, offset: filedelta, whence: whence, new_offset_ptr: ptr<u64>) => Promise<errno>;
}
/**
 * Synchronize the data and metadata of a file to disk. Note: This is
 * similar to fsync in POSIX.
 *
 * @param fd The file descriptor.
 */
export type fd_sync = (fd: fd) => errno;
export declare namespace fd_sync {
    const name: string;
    const signature: WasiFunctionSignature;
    type ServiceSignature = (memory: ArrayBuffer, fd: fd) => Promise<errno>;
}
/**
 * Return the current offset of a file descriptor. Note: This is similar
 * to lseek(fd, 0, SEEK_CUR) in POSIX.
 *
 * @param fd The file descriptor.
 * @param offset_ptr A memory location to store the current offset of the
 * file descriptor, relative to the start of the file.
 */
export type fd_tell = (fd: fd, offset_ptr: ptr<u64>) => errno;
export declare namespace fd_tell {
    const name: string;
    const signature: WasiFunctionSignature;
    function transfers(): ArgumentsTransfer;
    type ServiceSignature = (memory: ArrayBuffer, fd: fd, offset_ptr: ptr<u64>) => Promise<errno>;
}
/**
 * Write to a file descriptor. Note: This is similar to writev in POSIX.
 *
 * @param fd The file descriptor.
 * @param ciovs_ptr List of scatter/gather vectors from which to retrieve data.
 * @param ciovs_len The length of the iovs.
 * @param bytesWritten_ptr A memory location to store the bytes written.
 */
export type fd_write = (fd: fd, ciovs_ptr: ptr<ciovec>, ciovs_len: u32, bytesWritten_ptr: ptr<u32>) => errno;
export declare namespace fd_write {
    const name: string;
    const signature: WasiFunctionSignature;
    function transfers(memory: DataView, ciovs_ptr: ptr<ciovec>, ciovs_len: u32): ArgumentsTransfer;
    type ServiceSignature = (memory: ArrayBuffer, fd: fd, ciovs_ptr: ptr<ciovec>, ciovs_len: u32, bytesWritten_ptr: ptr<u32>) => Promise<errno>;
}
/**
 * Create a directory. Note: This is similar to mkdirat in POSIX.
 *
 * @param fd The file descriptor.
 * @param path_ptr A memory location that holds the path name.
 * @param path_len The length of the path
 */
export type path_create_directory = (fd: fd, path_ptr: ptr<byte[]>, path_len: size) => errno;
export declare namespace path_create_directory {
    const name: string;
    const signature: WasiFunctionSignature;
    function transfers(_memory: DataView, _path_ptr: ptr<byte[]>, path_len: size): ArgumentsTransfer;
    type ServiceSignature = (memory: ArrayBuffer, fd: fd, path_ptr: ptr<byte[]>, path_len: size) => Promise<errno>;
}
/**
 * Return the attributes of a file or directory. Note: This is similar to
 * stat in POSIX.
 *
 * @param fd The file descriptor.
 * @param flags Flags determining the method of how the path is resolved.
 * @param path_ptr A memory location that holds the path name.
 * @param path_len The length of the path
 * @param filestat_ptr A memory location to store the file stat.
 */
export type path_filestat_get = (fd: fd, flags: lookupflags, path_ptr: ptr<byte[]>, path_len: size, filestat_ptr: ptr) => errno;
export declare namespace path_filestat_get {
    const name: string;
    const signature: WasiFunctionSignature;
    function transfers(_memory: DataView, _path_ptr: ptr<byte[]>, path_len: size): ArgumentsTransfer;
    type ServiceSignature = (memory: ArrayBuffer, fd: fd, flags: lookupflags, path_ptr: ptr<byte[]>, path_len: size, filestat_ptr: ptr) => Promise<errno>;
}
/**
 * Adjust the timestamps of a file or directory. Note: This is similar to
 * utimensat in POSIX.
 *
 * @param fd The file descriptor.
 * @param flags Flags determining the method of how the path is resolved.
 * @param path_ptr A memory location that holds the path name.
 * @param path_len The length of the path.
 * @param atim The desired values of the data access timestamp.
 * @param mtim The desired values of the data modification timestamp.
 * @param fst_flags A bitmask indicating which timestamps to adjust.
 */
export type path_filestat_set_times = (fd: fd, flags: lookupflags, path_ptr: ptr<byte[]>, path_len: size, atim: timestamp, mtim: timestamp, fst_flags: fstflags) => errno;
export declare namespace path_filestat_set_times {
    const name: string;
    const signature: WasiFunctionSignature;
    function transfers(_memory: DataView, _path_ptr: ptr<byte[]>, path_len: size): ArgumentsTransfer;
    type ServiceSignature = (memory: ArrayBuffer, fd: fd, flags: lookupflags, path_ptr: ptr<byte[]>, path_len: size, atim: timestamp, mtim: timestamp, fst_flags: fstflags) => Promise<errno>;
}
/**
 * Create a hard link. Note: This is similar to linkat in POSIX.
 *
 * @param old_fd The file descriptor.
 * @param old_flags Flags determining the method of how the path is resolved.
 * @param old_path_ptr: A memory location that holds the source path from
 * which to link.
 * @param old_path_len: The length of the old path.
 * @param new_fd The working directory at which the resolution of the new
 * path starts.
 * @param new_path_ptr: A memory location that holds the destination path
 * at which to create the hard link.
 * @param new_path_len: The length of the new path.
 */
export type path_link = (old_fd: fd, old_flags: lookupflags, old_path_ptr: ptr<byte[]>, old_path_len: size, new_fd: fd, new_path_ptr: ptr<byte[]>, new_path_len: size) => errno;
export declare namespace path_link {
    const name: string;
    const signature: WasiFunctionSignature;
    function transfers(_memory: DataView, _old_path_ptr: ptr<byte[]>, old_path_len: size, _new_path_ptr: ptr<byte[]>, new_path_len: size): ArgumentsTransfer;
    type ServiceSignature = (memory: ArrayBuffer, old_fd: fd, old_flags: lookupflags, old_path_ptr: ptr<byte[]>, old_path_len: size, new_fd: fd, new_path_ptr: ptr<byte[]>, new_path_len: size) => Promise<errno>;
}
/**
 * Open a file or directory. The returned file descriptor is not guaranteed
 * to be the lowest-numbered file descriptor not currently open; it is
 * randomized to prevent applications from depending on making assumptions
 * about indexes, since this is error-prone in multi-threaded contexts.
 * The returned file descriptor is guaranteed to be less than 2**31.
 * Note: This is similar to openat in POSIX.
 *
 * @param fd The file descriptor.
 * @param dirflags Flags determining the method of how the path is resolved.
 * @param path A memory location holding the relative path of the file or
 * directory to open, relative to the path_open::fd directory.
 * @param pathLen The path length.
 * @param oflags The method by which to open the file.
 * @param fs_rights_base The initial rights of the newly created file
 * descriptor. The implementation is allowed to return a file descriptor
 * with fewer rights than specified, if and only if those rights do not
 * apply to the type of file being opened. The base rights are rights that
 * will apply to operations using the file descriptor itself, while the
 * inheriting rights are rights that apply to file descriptors derived from
 * it.
 * @param fs_rights_inheriting Inheriting rights.
 * @param fdflags The fd flags.
 * @param fd_ptr A memory location to store the opened file descriptor.
 */
export type path_open = (fd: fd, dirflags: lookupflags, path: ptr<byte[]>, pathLen: size, oflags: oflags, fs_rights_base: rights, fs_rights_inheriting: rights, fdflags: fdflags, fd_ptr: ptr<fd>) => errno;
export declare namespace path_open {
    const name: string;
    const signature: WasiFunctionSignature;
    function transfers(_memory: DataView, _path: ptr<byte[]>, pathLen: size): ArgumentsTransfer;
    type ServiceSignature = (memory: ArrayBuffer, fd: fd, dirflags: lookupflags, path: ptr<byte[]>, pathLen: size, oflags: oflags, fs_rights_base: rights, fs_rights_inheriting: rights, fdflags: fdflags, fd_ptr: ptr<fd>) => Promise<errno>;
}
/**
 * Read the contents of a symbolic link. Note: This is similar to readlinkat
 * in POSIX.
 *
 * @param fd The file descriptor.
 * @param path_ptr A memory location that holds the path name.
 * @param path_len The length of the path.
 * @param buf The buffer to which to write the contents of the symbolic link.
 * @param buf_len The size of the buffer
 * @param result_size_ptr A memory location to store the number of bytes
 * placed in the buffer.
 */
export type path_readlink = (fd: fd, path_ptr: ptr<byte[]>, path_len: size, buf: ptr<byte[]>, buf_len: size, result_size_ptr: ptr<u32>) => errno;
export declare namespace path_readlink {
    const name: string;
    const signature: WasiFunctionSignature;
    function transfers(_memory: DataView, _path_ptr: ptr<byte[]>, path_len: size, _buf: ptr<byte[]>, buf_len: size): ArgumentsTransfer;
    type ServiceSignature = (memory: ArrayBuffer, fd: fd, path_ptr: ptr<byte[]>, path_len: size, buf: ptr<byte[]>, buf_len: size, result_size_ptr: ptr<u32>) => Promise<errno>;
}
/**
 * Remove a directory. Return errno::notempty if the directory is not empty.
 * Note: This is similar to unlinkat(fd, path, AT_REMOVEDIR) in POSIX.
 *
 * @param fd The file descriptor.
 * @param path_ptr  A memory location that holds the path name.
 * @param path_len The length of the path.
 */
export type path_remove_directory = (fd: fd, path_ptr: ptr<byte[]>, path_len: size) => errno;
export declare namespace path_remove_directory {
    const name: string;
    const signature: WasiFunctionSignature;
    function transfers(_memory: DataView, _path_ptr: ptr<byte[]>, path_len: size): ArgumentsTransfer;
    type ServiceSignature = (memory: ArrayBuffer, fd: fd, path_ptr: ptr<byte[]>, path_len: size) => Promise<errno>;
}
/**
 * Rename a file or directory. Note: This is similar to renameat in POSIX.
 *
 * @param fd The file descriptor.
 * @param old_path_ptr: A memory location that holds the source path of the
 * file or directory to rename.
 * @param old_path_len: The length of the old path.
 * @param new_fd The working directory at which the resolution of the new
 * path starts.
 * @param new_path_ptr: A memory location that holds The destination path to
 * which to rename the file or directory.
 * @param new_path_len: The length of the new path.
 */
export type path_rename = (fd: fd, old_path_ptr: ptr<byte[]>, old_path_len: size, new_fd: fd, new_path_ptr: ptr<byte[]>, new_path_len: size) => errno;
export declare namespace path_rename {
    const name: string;
    const signature: WasiFunctionSignature;
    function transfers(_memory: DataView, _old_path_ptr: ptr<byte[]>, old_path_len: size, _new_path_ptr: ptr<byte[]>, new_path_len: size): ArgumentsTransfer;
    type ServiceSignature = (memory: ArrayBuffer, fd: fd, old_path_ptr: ptr<byte[]>, old_path_len: size, new_fd: fd, new_path_ptr: ptr<byte[]>, new_path_len: size) => Promise<errno>;
}
/**
 * Create a symbolic link. Note: This is similar to symlinkat in POSIX.
 *
 * @param old_path_ptr: A memory location that holds the contents of the
 * symbolic link.
 * @param old_path_len: The length of the old path.
 * @param fd The file descriptor.
 * @param new_path_ptr A memory location that holds the destination path
 * at which to create the symbolic link.
 * @param new_path_len The length of the new path.
 */
export type path_symlink = (old_path_ptr: ptr<byte[]>, old_path_len: size, fd: fd, new_path_ptr: ptr<byte[]>, new_path_len: size) => errno;
export declare namespace path_symlink {
    const name: string;
    const signature: WasiFunctionSignature;
    function transfers(_memory: DataView, _old_path_ptr: ptr<byte[]>, old_path_len: size, _new_path_ptr: ptr<byte[]>, new_path_len: size): ArgumentsTransfer;
    type ServiceSignature = (memory: ArrayBuffer, old_path_ptr: ptr<byte[]>, old_path_len: size, fd: fd, new_path_ptr: ptr<byte[]>, new_path_len: size) => Promise<errno>;
}
/**
 * Unlink a file. Return errno::isdir if the path refers to a directory.
 * Note: This is similar to unlinkat(fd, path, 0) in POSIX.
 *
 * @param fd The file descriptor.
 * @param path_ptr  A memory location that holds the path name.
 * @param path_len The length of the path.
 */
export type path_unlink_file = (fd: fd, path_ptr: ptr<byte[]>, path_len: size) => errno;
export declare namespace path_unlink_file {
    const name: string;
    const signature: WasiFunctionSignature;
    function transfers(_memory: DataView, _path_ptr: ptr<byte[]>, path_len: size): ArgumentsTransfer;
    type ServiceSignature = (memory: ArrayBuffer, fd: fd, path_ptr: ptr<byte[]>, path_len: size) => Promise<errno>;
}
/**
 * Concurrently poll for the occurrence of a set of events.
 *
 * @param input A memory location pointing to the events to which to subscribe.
 * @param output A memory location to store the events that have occurred.
 * @param subscriptions Both the number of subscriptions and events.
 * @param result_size_ptr The number of events stored.
 */
export type poll_oneoff = (input: ptr<subscription[]>, output: ptr<event[]>, subscriptions: size, result_size_ptr: ptr<u32>) => errno;
export declare namespace poll_oneoff {
    const name: string;
    const signature: WasiFunctionSignature;
    function transfers(_memory: DataView, _input: ptr<subscription[]>, _output: ptr<event[]>, subscriptions: size): ArgumentsTransfer;
    type ServiceSignature = (memory: ArrayBuffer, input: ptr<subscription[]>, output: ptr<event[]>, subscriptions: size, result_size_ptr: ptr<u32>) => Promise<errno>;
}
/**
 * Terminate the process normally. An exit code of 0 indicates successful
 * termination of the program. The meanings of other values is dependent on
 * the environment.
 *
 * @param rval The exit code returned by the process.
 */
export type proc_exit = (rval: exitcode) => void;
export declare namespace proc_exit {
    const name: string;
    const signature: WasiFunctionSignature;
    type ServiceSignature = (memory: ArrayBuffer, rval: exitcode) => Promise<errno>;
}
/**
 * Temporarily yield execution of the calling thread. Note: This is similar
 * to sched_yield in POSIX.
 */
export type sched_yield = () => errno;
export declare namespace sched_yield {
    const name: string;
    const signature: WasiFunctionSignature;
    type ServiceSignature = (memory: ArrayBuffer) => Promise<errno>;
}
/**
 * Write high-quality random data into a buffer. This function blocks when
 * the implementation is unable to immediately provide sufficient high-quality
 * random data. This function may execute slowly, so when large mounts of
 * random data are required, it's advisable to use this function to seed
 * a pseudo-random number generator, rather than to provide the random data
 * directly.
 *
 * @param buf The buffer to fill with random data.
 * @param buf_len The size of the buffer.
 */
export type random_get = (buf: ptr<byte[]>, buf_len: size) => errno;
export declare namespace random_get {
    const name: string;
    const signature: WasiFunctionSignature;
    function transfers(_memory: DataView, _buf: ptr<byte[]>, buf_len: size): ArgumentsTransfer;
    type ServiceSignature = (memory: ArrayBuffer, buf: ptr<byte[]>, buf_len: size) => Promise<errno>;
}
/**
 * Accept a new incoming connection. Note: This is similar to accept in
 * POSIX.
 *
 * @param fd The listening socket.
 * @param flags The desired values of the file descriptor flags.
 * @param result_fd_ptr A memory location to store the new socket connection.
 */
export type sock_accept = (fd: fd, flags: fdflags, result_fd_ptr: ptr<fd>) => errno;
export declare namespace sock_accept {
    const name: string;
    const signature: WasiFunctionSignature;
    function transfers(): ArgumentsTransfer;
    type ServiceSignature = (memory: ArrayBuffer, fd: fd, flags: fdflags, result_fd_ptr: ptr<fd>) => Promise<errno>;
}
/**
 * Receive a message from a socket. Note: This is similar to recv in POSIX,
 * though it also supports reading the data into multiple buffers in the
 * manner of readv.
 *
 * @param fd The listening socket.
 * @param ri_data_ptr List of scatter/gather vectors in which to store data.
 * @param ri_data_len The length of the iovs.
 * @param ri_flags Message flags.
 * @param ro_datalen_ptr: A memory location to store the size of the returned
 * data
 * @param roflags_ptr: A memory location to store the return flags.
 */
export type sock_recv = (fd: fd, ri_data_ptr: ptr<iovec>, ri_data_len: u32, ri_flags: riflags, ro_datalen_ptr: ptr<u32>, roflags_ptr: ptr<roflags>) => errno;
export declare namespace sock_recv {
    const name: string;
    const signature: WasiFunctionSignature;
    function transfers(memory: DataView, ri_data_ptr: ptr<iovec>, ri_data_len: u32): ArgumentsTransfer;
    type ServiceSignature = (memory: ArrayBuffer, fd: fd, ri_data_ptr: ptr<iovec>, ri_data_len: u32, ri_flags: riflags, ro_datalen_ptr: ptr<u32>, roflags_ptr: ptr<roflags>) => Promise<errno>;
}
/**
 * Send a message on a socket. Note: This is similar to send in POSIX,
 * though it also supports writing the data from multiple buffers in the
 * manner of writev.
 *
 * @param fd The socket to write to.
 * @param si_data_ptr List of scatter/gather vectors to which to retrieve
 * data.
 * @param si_data_len: The length of the ciovs.
 * @param si_flags Message flags.
 * @param si_datalen_ptr
 */
export type sock_send = (fd: fd, si_data_ptr: ptr<ciovec>, si_data_len: u32, si_flags: siflags, si_datalen_ptr: ptr<u32>) => errno;
export declare namespace sock_send {
    const name: string;
    const signature: WasiFunctionSignature;
    function transfers(memory: DataView, si_data_ptr: ptr<ciovec>, si_data_len: u32): ArgumentsTransfer;
    type ServiceSignature = (memory: ArrayBuffer, fd: fd, si_data_ptr: ptr<ciovec>, si_data_len: u32, si_flags: siflags, si_datalen_ptr: ptr<u32>) => Promise<errno>;
}
/**
 * Shut down socket send and receive channels. Note: This is similar to shutdown
 * in POSIX.
 *
 * @param fd The socket to shut down.
 * @param sdflags Which channels on the socket to shut down.
 */
export type sock_shutdown = (fd: fd, sdflags: sdflags) => errno;
export declare namespace sock_shutdown {
    const name: string;
    const signature: WasiFunctionSignature;
    type ServiceSignature = (memory: ArrayBuffer, fd: fd, sdflags: sdflags) => Promise<errno>;
}
export type tid = u32;
/**
 * Spawns a new thread. See https://github.com/WebAssembly/wasi-threads
 * for the current documentation.
 *
 * @param start_args_ptr A memory location that holds the start arguments.
 */
export type thread_spawn = (start_args_ptr: ptr<u32>) => tid;
export declare namespace thread_spawn {
    const name: string;
    const signature: WasiFunctionSignature;
    function transfers(): ArgumentsTransfer;
    type ServiceSignature = (memory: ArrayBuffer, start_args_ptr: ptr<u32>) => Promise<tid>;
}
export type thread_exit = (tid: tid) => errno;
export declare namespace thread_exit {
    const name: string;
    const signature: WasiFunctionSignature;
    type ServiceSignature = (memory: ArrayBuffer, tid: u32) => Promise<errno>;
}
export interface WASI {
    args_sizes_get: args_sizes_get;
    args_get: args_get;
    environ_sizes_get: environ_sizes_get;
    environ_get: environ_get;
    clock_res_get: clock_res_get;
    clock_time_get: clock_time_get;
    fd_advise: fd_advise;
    fd_allocate: fd_allocate;
    fd_close: fd_close;
    fd_datasync: fd_datasync;
    fd_fdstat_get: fd_fdstat_get;
    fd_fdstat_set_flags: fd_fdstat_set_flags;
    fd_filestat_get: fd_filestat_get;
    fd_filestat_set_size: fd_filestat_set_size;
    fd_filestat_set_times: fd_filestat_set_times;
    fd_pread: fd_pread;
    fd_prestat_get: fd_prestat_get;
    fd_prestat_dir_name: fd_prestat_dir_name;
    fd_pwrite: fd_pwrite;
    fd_read: fd_read;
    fd_readdir: fd_readdir;
    fd_seek: fd_seek;
    fd_renumber: fd_renumber;
    fd_sync: fd_sync;
    fd_tell: fd_tell;
    fd_write: fd_write;
    path_create_directory: path_create_directory;
    path_filestat_get: path_filestat_get;
    path_filestat_set_times: path_filestat_set_times;
    path_link: path_link;
    path_open: path_open;
    path_readlink: path_readlink;
    path_remove_directory: path_remove_directory;
    path_rename: path_rename;
    path_symlink: path_symlink;
    path_unlink_file: path_unlink_file;
    poll_oneoff: poll_oneoff;
    proc_exit: proc_exit;
    sched_yield: sched_yield;
    random_get: random_get;
    sock_accept: sock_accept;
    sock_recv: sock_recv;
    sock_send: sock_send;
    sock_shutdown: sock_shutdown;
    'thread-spawn': thread_spawn;
}
