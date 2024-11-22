//@ts-nocheck
"use client";

import { FileManagerType } from "@/Hooks/Files/useFileManager";
import { useRef, useState } from "react";
export default (props: { children?: any, className?: string, fileManager:FileManagerType, accepts:string[]}) => {
    let coverRef = useRef<HTMLDivElement>(null)
    let fileManager = props.fileManager;
    const getFilesFromEvent = (ev: any) => {
        let files: File[] = [];
        if (ev.dataTransfer.items) {
            files = [...ev.dataTransfer.items].map((item, i) => {
                if (item.kind === "file") {
                    const file = item.getAsFile();
                    return file;
                }
            })
            
        } else {
            files = [...ev.dataTransfer.files]
        }
        return files;
    }
    const handleDrop = async (ev:any) => {
        ev.preventDefault();
        //Hide the Drop Cover
        if (coverRef.current != undefined) {
            coverRef.current.style.display = "none"
        }
        //Get Dropped Items as Files
        let files = getFilesFromEvent(ev);
        let acceptedFiles = files.filter(f => props.accepts.includes(`.${f?.name.split(".").slice(-1)[0]}`))
        //Add Files to File Manager
        fileManager.addFiles(acceptedFiles);
    }
    return (
        <div
            className={props.className}
            style={{ position: "relative" }}
            onDragOver={(e) => {
                e.preventDefault()
                //Show Drag Cover on Drag Over
                if (coverRef.current == undefined) return;
                coverRef.current.style.display = "flex"
            }}
            onDragLeave={() => {
                //Hide Drop Cover
                if (coverRef.current == undefined) return;
                coverRef.current.style.display = "none"
            }}
            onDrop={handleDrop}
        >
            <div
                id="drop_cover"
                ref={coverRef}
                className="flex items-center justify-center"
                style={{ display: "none", position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(20, 20, 20, 0.8)", color: "white" }}
            >
                Drop Files Here
            </div>
            {props.children}
        </div>
    )
}