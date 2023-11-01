import * as code from 'vscode';
import * as wasi from './wasi';
export declare namespace code2Wasi {
    function asFileType(fileType: code.FileType): wasi.filetype;
    function asErrno(code: string): wasi.errno;
}
export declare namespace BigInts {
    function asNumber(value: bigint): number;
    function max(...args: bigint[]): bigint;
    function min(...args: bigint[]): bigint;
}
