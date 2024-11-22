//@ts-nocheck
import { useEffect, useMemo, useRef, useState } from "react"
import { FileManager, FileManagerType, FileStatus } from "./useFileManager";
export class FileUploadManager extends FileManager {
    constructor(files: FileStatus[], setFiles: React.Dispatch<React.SetStateAction<FileStatus[]>>) {
        super(files, setFiles);
    }
    async uploadFiles() {
        return {
            ids:[]
        }
    }
}
export type FileUploadManagerType = FileManagerType & ReturnType<typeof Hook>
const Hook = ():FileUploadManager => {
    let [files, setFiles] = useState<FileStatus[]>([]);
    let manager = useMemo(()=>new FileUploadManager(files, setFiles), [files])
    return manager
}
export default Hook;