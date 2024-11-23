import yargs from "yargs"
import os from "os"
import { hideBin } from 'yargs/helpers'
import path from "path";
import * as fs from "fs";
import { ProjectConfigs } from "./ProjectConfigs";

export type PackageMetaType = {
    dependencies: string[],
    files: {dst:string[], src:string[]}[]
}
/**
 * The Package Manager
 */
export class PackageManager {
    isReady: boolean = false;
    LOOKUP: {
        [key: string]: PackageMetaType
    } = {}
    constructor(configs: ProjectConfigs) {
        this.isReady = false;
        (async () => {
            //Get Package Lookup Dict
            let fetch_url = configs.package_library;
            let res = await fetch(fetch_url);
            if (res.status != 200) {
                return;
            }
            this.LOOKUP = await res.json();
            this.isReady = true;
        })()
    }

    async getPackageMeta(id: string) {
        await new Promise<void>((res) => {
            const loop = () => {
                if (this.isReady) return res();
                setTimeout(() => {
                    loop();
                }, 100)
            }
            loop();
        })
        let meta = this.LOOKUP[id];
        if (meta == undefined) return undefined;
        return new ContentPackage(meta)
    }
}

class ContentPackage {
    files:{
        dst: string[];
        src: string[];
    }[]
    dependencies?:string[]
    constructor(data:PackageMetaType) {
        this.files = data.files;
        this.dependencies = data.dependencies;
    }
    async install(location:string[]) {
        for (let file of this.files) {
            await InstallFile(file, location)
        }
    }
}

async function InstallFile(file:{dst:string[], src:string[]}, location:string[]) {
    //Install Details
    let install_loc = [...location, ...file.dst].join(path.sep)
    let install_loc_folder = install_loc.split(path.sep).slice(-1).join(path.sep)
    if (fs.existsSync(install_loc) == true) {
        return;
    }
    //build github raw content endpoint
    let fetch_url = `https://raw.githubusercontent.com/KeeganBruer/KBUi/refs/heads/main/content/${file.src.join("/")}`
    console.log(fetch_url)
    
    //Get file content from github
    let res = await fetch(fetch_url);
    if (res.status != 200) {
        return;
    }
    let file_content = await res.text();
    
    //Remove Typescript No Check
    let lines = file_content.trim().split("\n")
    for (let i = 0; i < 3; i++) {
        if (lines[i].includes("//@ts-nocheck")) {
            lines = lines.slice(i + 1);
            break;
        }
    }

    //Ensure Dst folder exists
    fs.mkdirSync(install_loc_folder, { recursive: true })
    fs.writeFileSync(install_loc, lines.join("\n").trim(), {encoding:"utf-8"})
}