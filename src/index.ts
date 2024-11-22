#!/usr/bin/env node
import yargs from "yargs"
import os from "os"
import { hideBin } from 'yargs/helpers'
import path from "path";
import Lookup from "./lookup";
import { copyFile, copyFileSync, mkdir, mkdirSync, readFileSync, writeFileSync } from "fs";

yargs(hideBin(process.argv))
    .command('install <id>', 'Install content specified by the ID', (yargs) => {
        yargs.positional('id', {
            describe: 'content ID',
            type: 'string',
          })
    }, InstallCommand)
    .demandCommand(1)
    .help()
    .parse();


function InstallCommand(argv: yargs.ArgumentsCamelCase<{}>) {
    console.log(argv)    
    let local_content = `C:\\Windows-Workspace\\KBUi`;
    let local_content_array = local_content.split(path.sep)
    let command_loc = process.cwd();
    let loc_array = command_loc.split(path.sep)
    let content = Lookup[argv.id as string];
    for (let item of content) {
        let src_loc = [...local_content_array, "content", ...item.src].join(path.sep)
        let install_loc = [...loc_array, "src", ...item.dst].join(path.sep)
        let install_loc_folder = [...loc_array, "src", ...item.dst.slice(0, -1)].join(path.sep)
        
        console.log("installing", src_loc, "to", install_loc_folder)
        mkdirSync(install_loc_folder, { recursive: true })
        let fetch_url = `https://raw.githubusercontent.com/KeeganBruer/javadoc-generator/refs/heads/Version_3/tsconfig.json`
        let file_content = readFileSync(src_loc, { encoding: "utf-8" })
        let lines = file_content.trim().split("\n")
        for (let i = 0; i < 3; i++) {
            if (lines[i].includes("//@ts-nocheck")) {
                lines = lines.slice(i + 1);
                break;
            }
        }
        writeFileSync(install_loc, lines.join("\n").trim(), {encoding:"utf-8"})
    }
}