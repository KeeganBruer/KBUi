//@ts-nocheck

"use client";

import { useRef, useState } from "react";
import FileDropArea from "@/Components/Files/Drop/Area"
import { FileManagerType } from "@/Hooks/Files/useFileManager";

export default (props: { fileManager: FileManagerType, accepts:string[] }) => {
    let content = <DropBoxNoFiles {...props} />
    if (props.fileManager.hasFiles()) content = <DropBoxFiles {...props}/>
    return (
        <div className="w-full h-[200px] rounded-md overflow-hidden m-3 border border-black">
            <FileDropArea className="w-full h-full p-3" {...props}>
                {content}
            </FileDropArea>
        </div>
    )
}

/**
 * Content of Box when there are no files
 */
function DropBoxNoFiles(props:{ fileManager: FileManagerType, accepts:string[] }) {
    return (
        <div className="w-full h-full flex justify-center items-center">
            <div className="w-[300px] flex flex-row justify-between">
                <BrowserFilesButton {...props}/>
                <span>OR</span>
                <span>Drop Files Here</span>
            </div>
        </div>
    )
}
/**
 * Content of Box when there are files selected
 */
function DropBoxFiles(props:{ fileManager: FileManagerType, accepts:string[] }) {
    let fileManager = props.fileManager;
    return (
        <div className="w-full h-full flex flex-col justify-center items-center">
            <div className="w-full flex flex-row justify-center items-center border-b border-[rgba(0,0,0,0.5)] pb-3">
                <div className="w-[300px] flex flex-row justify-between">
                    <BrowserFilesButton {...props}/>
                    <span>OR</span>
                    <span>Drop Files Here</span>
                </div>
            </div>
            <div className="w-full flex flex-col overflow-y-scroll h-full">
            {fileManager.files.map((file) => (
                <div key={file.id} className="flex flex-row justify-between px-3">
                    <span>{file.name}</span>
                    <span>{file.file_id}</span>
                    <span>{file.status}</span>
                </div>
            ))}
            </div>
        </div>
    )
}

function BrowserFilesButton(props: { fileManager: FileManagerType, accepts:string[] }) {
    let ref = useRef<HTMLInputElement>(null)
    return (
        <>
            <input
                ref={ref}
                type="file"
                className="hidden"
                multiple={true}
                accept={props.accepts.join(",")}
                onChange={(e) => {
                    if (e.target.files == undefined) return;

                    //Convert to array of files from input
                    let files:File[] = [];
                    for (let i = 0; i < e.target.files?.length; i++) {
                        let item = e.target.files.item(i);
                        if (item != null) files.push(item);
                    }

                    //add files to manager
                    props.fileManager.addFiles(files);
                }}
            />
            <span
                onClick={async () => {
                    let input_file = ref.current;
                    if (input_file == undefined) return;

                    input_file.click();
                }}
                className="text-blue-500 cursor-pointer underline"
            >
                Browse Files
            </span>
        </>
    )
}