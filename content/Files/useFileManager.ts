//@ts-nocheck

import { Dispatch, SetStateAction, useEffect, useMemo, useRef, useState } from "react"
import { hash } from "@/Utils/hash_func";

export type FileStatus = {
    id: string,
    name: string,
    file_id?: string,
    status: "added" | "uploading" | "uploaded"
};

export class FileManager {
    files: FileStatus[];
    setFiles: Dispatch<SetStateAction<FileStatus[]>>
    constructor(files: FileStatus[], setFiles: Dispatch<SetStateAction<FileStatus[]>>) {
        this.files = files;
        this.setFiles = setFiles;
    }
    addFiles(_files: File[]) {
        let file_statuses:FileStatus[] = _files.map(f => ({
            id: `file[${hash(f.name)}]`,
            name: f.name,
            status:"added"
        }))
        let newFileIDs = file_statuses.map(f=>f.id)
        let oldFiles = this.files.filter(f=>newFileIDs.includes(f.id) != true)
        this.setFiles([...oldFiles, ...file_statuses])
    }
}

export type FileManagerType = ReturnType<typeof Hook>
const Hook = () => {
    let [files, setFiles] = useState<FileStatus[]>([]);
    let manager = useMemo(()=>new FileManager(files, setFiles), [files])
    
    return manager
}
export default Hook;