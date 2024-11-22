#!/usr/bin/env node
import yargs from "yargs"
import os from "os"
import { hideBin } from 'yargs/helpers'
import path from "path";
import * as fs from "fs";

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


async function InstallCommand(argv: yargs.ArgumentsCamelCase<{}>) {
    
    let command_loc = process.cwd();
    let loc_array = command_loc.split(path.sep)
    
    //Get ID Lookup Dict
    let fetch_url = `https://raw.githubusercontent.com/KeeganBruer/KBUi/refs/heads/main/content/lookup.json`
    let res = await fetch(fetch_url);
    if (res.status != 200) {
        return;
    }
    let Lookup = await res.json();
    
    //Get the Content List for the given ID
    let content = Lookup[argv.id as string];

    for (let item of content) {
        await InstallFile(loc_array, item)
    }
}

async function InstallFile(loc_array:string[], item:any) {
    //Install Details
    let install_loc = [...loc_array, "src", ...item.dst].join(path.sep)
    let install_loc_folder = install_loc.split(path.sep).slice(-1).join(path.sep)
    if (fs.existsSync(install_loc) == true) {
        return;
    }
    //build github raw content endpoint
    let fetch_url = `https://raw.githubusercontent.com/KeeganBruer/KBUi/refs/heads/main/content/${item.src.join("/")}`
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