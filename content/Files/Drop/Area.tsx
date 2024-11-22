//@ts-nocheck

"use client";

import { FileManagerType } from "@/Hooks/Files/useFileManager";
import { useRef, useState } from "react";
export default (props: { children?: any, className?: string, fileManager:FileManagerType}) => {
    let coverRef = useRef<HTMLDivElement>(null)
    let fileManager = props.fileManager;
    const handleDrop = async (ev:any) => {
        ev.preventDefault();
        if (coverRef.current != undefined) {
            coverRef.current.style.display = "none"
        }
        let files: any[] = [];
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
        fileManager.addFiles(files);
    }
    return (
        <div className={props.className} style={{position:"relative"}} onDragOver={(e) => {
            e.preventDefault()
            if (coverRef.current == undefined) return;
            coverRef.current.style.display = "flex"
            console.log("drag over")
        }} onDragLeave={() => {
            if (coverRef.current == undefined) return;
            coverRef.current.style.display = "none"
        }} onDrop={handleDrop}>
            <div ref={coverRef}
                className="flex items-center justify-center"
                style={{ display: "none", position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(20, 20, 20, 0.8)", color: "white" }}
            >
                Drop File
            </div>
            {props.children}
        </div>
    )
}