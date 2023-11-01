import { DeviceDriver } from './deviceDriver';
import { fd, fdflags, filetype, oflags, rights } from './wasi';
type DeviceId = bigint;
export interface FileDescriptor {
    readonly deviceId: DeviceId;
    /**
     * The WASI file descriptor id
     */
    readonly fd: fd;
    /**
     * The file type
     */
    readonly fileType: filetype;
    /**
     * The base rights.
     */
    readonly rights_base: rights;
    /**
     * The inheriting rights
     */
    readonly rights_inheriting: rights;
    /**
     * The file descriptor flags.
     */
    fdflags: fdflags;
    /**
     * The inode the file descriptor is pointing to.
     */
    readonly inode: bigint;
    /**
     * Dispose resource associated with this file descriptor.
     */
    dispose?(): Promise<void>;
    /**
     * Create a new file descriptor with the given changes.
     *
     * @param change The changes to apply to the file descriptor.
     */
    with(change: {
        fd: fd;
    }): FileDescriptor;
    /**
     * Check if the base rights contain the given rights.
     *
     * @param rights The rights to check.
     */
    containsBaseRights(rights: rights): boolean;
    /**
     * Asserts the given rights.
     *
     * @param right the rights to assert.
     */
    assertRights(rights: rights): void;
    /**
     * Asserts the given base rights.
     *
     * @param right the rights to assert.
     */
    assertBaseRights(rights: rights): void;
    /**
     * Asserts the given base rights.
     *
     * @param right the rights to assert.
     */
    assertInheritingRights(rights: rights): void;
    /**
     * Asserts the given fdflags.
     *
     * @param fdflags The fdflags to assert.
     */
    assertFdflags(fdflags: fdflags): void;
    /**
     * Asserts the given oflags.
     *
     * @param oflags The oflags to assert.
     */
    assertOflags(oflags: oflags): void;
    /**
     * Asserts that the file descriptor points to a directory.
     */
    assertIsDirectory(): void;
}
export declare abstract class BaseFileDescriptor implements FileDescriptor {
    readonly deviceId: bigint;
    readonly fd: fd;
    readonly fileType: filetype;
    readonly rights_base: rights;
    readonly rights_inheriting: rights;
    fdflags: fdflags;
    readonly inode: bigint;
    constructor(deviceId: bigint, fd: fd, fileType: filetype, rights_base: rights, rights_inheriting: rights, fdflags: fdflags, inode: bigint);
    dispose?(): Promise<void>;
    abstract with(change: {
        fd: fd;
    }): FileDescriptor;
    containsBaseRights(rights: rights): boolean;
    assertRights(rights: rights): void;
    assertBaseRights(rights: rights): void;
    assertInheritingRights(rights: rights): void;
    assertFdflags(fdflags: fdflags): void;
    assertOflags(oflags: oflags): void;
    assertIsDirectory(): void;
}
export interface FdProvider {
    next(): fd;
}
export declare class FileDescriptors implements FdProvider {
    private readonly descriptors;
    private readonly rootDescriptors;
    private mode;
    private counter;
    private firstReal;
    constructor();
    get firstRealFileDescriptor(): fd;
    next(): fd;
    switchToRunning(start: fd): void;
    add(descriptor: FileDescriptor): void;
    get(fd: fd): FileDescriptor;
    has(fd: fd): boolean;
    delete(descriptor: FileDescriptor): boolean;
    setRoot(driver: DeviceDriver, descriptor: FileDescriptor): void;
    getRoot(driver: DeviceDriver): FileDescriptor | undefined;
    entries(): IterableIterator<[number, FileDescriptor]>;
    keys(): IterableIterator<number>;
    values(): IterableIterator<FileDescriptor>;
    [Symbol.iterator](): IterableIterator<[number, FileDescriptor]>;
}
export {};
