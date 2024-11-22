//@ts-nocheck

"use client";

import { useState } from "react";
import FileDropArea from "@/Components/Files/Drop/Area"
import { FileManagerType } from "@/Hooks/Files/useFileManager";

export default (props: { fileManager: FileManagerType }) => {
    let fileManager = props.fileManager;
    let content = (
        <div className="w-full h-full flex justify-center items-center">
            <div className="w-[300px] flex flex-row justify-between">
                <input type="file" id="browse_file" className="hidden" multiple={true} accept=".csv,.xlsx" onChange={(e) => {
                    console.log("dropped files", e.target.files)
                    if (e.target.files == undefined) return;
                    let files:File[] = [];
                    for (let i = 0; i < e.target.files?.length; i++) {
                        let item = e.target.files.item(i);
                        if (item != null) files.push(item);
                    }
                    fileManager.addFiles(files);
                }}/>
                <span onClick={async () => {
                    let file_input = document.getElementById("browse_file");
                    if (file_input == undefined) return;
                    let input_file = file_input as HTMLInputElement;
                    input_file.click();
                }} className="text-blue-500 cursor-pointer underline">Browse Files</span>
                <span>OR</span>
                <span>Drop Files Here</span>
            </div>
        </div>
    )
    if (fileManager.files.length != 0) content = (
        <div className="w-full h-full flex flex-col justify-center items-center">
            <div className="w-full flex flex-row justify-center items-center border-b border-[rgba(0,0,0,0.5)] pb-3">
                <div className="w-[300px] flex flex-row justify-between">
                    <input type="file" id="browse_file" className="hidden" multiple={true} accept=".csv,.xlsx" onChange={(e) => {
                        console.log("dropped files", e.target.files)
                        if (e.target.files == undefined) return;
                        let files:File[] = [];
                        for (let i = 0; i < e.target.files?.length; i++) {
                            let item = e.target.files.item(i);
                            if (item != null) files.push(item);
                        }
                        fileManager.addFiles(files);
                    }}/>
                    <span onClick={async () => {
                        let file_input = document.getElementById("browse_file");
                        if (file_input == undefined) return;
                        let input_file = file_input as HTMLInputElement;
                        input_file.click();
                    }} className="text-blue-500 cursor-pointer underline">Browse Files</span>
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
    return (
        <div className="w-full h-[200px] rounded-md overflow-hidden m-3 border border-black">
            <FileDropArea className="w-full h-full p-3" fileManager={props.fileManager}>{content}</FileDropArea>
        </div>
    )
}