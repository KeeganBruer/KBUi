import yargs from "yargs"
import os from "os"
import { hideBin } from 'yargs/helpers'
import path from "path";
import * as fs from "fs";
import { PackageManager, PackageMetaType } from "../PackageManager";
import { ProjectConfigs } from "../ProjectConfigs";
import decompress from "decompress";
import child_process from "child_process"
import { terminal as term } from "terminal-kit"

export default async function Command(configs:ProjectConfigs, argv: yargs.ArgumentsCamelCase<{}>) {
    let command_loc = process.cwd();
    let _cwd = command_loc.split(path.sep);
    let config_path = [..._cwd, "temp.zip"].join(path.sep);
    let project_path = argv.project_name == "."
        ? [..._cwd].join(path.sep)
        : [..._cwd, argv.project_name].join(path.sep);
    let InitConfigs = {
        command_loc,
        _cwd,
        config_path,
        project_path
    }

    term.white("Select Project Type:")

    term.singleColumnMenu(["1. NextJs", "2. React Native"], function (error, response) {
        switch (response.selectedText) {
            case "1. NextJs": InitNextJS(InitConfigs); break;
            case "2. React Native": InitReactNative(InitConfigs); break;
        }
    } ) ;
}

async function InitNextJS(InitConfigs: any) {
    let {
        config_path,
        project_path
    } = InitConfigs;

    let res = await fetch(`https://raw.githubusercontent.com/KeeganBruer/KBUi/refs/heads/main/content/template.zip`);
    if (res.status != 200) {
        console.log("problem fetching file")
        process.exit() ;
        return;
    }
    let blob = await res.blob()
    let buffer = await blob.arrayBuffer()
    fs.writeFileSync(config_path, Buffer.from(buffer));
    await decompress(config_path, project_path)
    fs.rmSync(config_path)

    child_process.exec('npm i', { cwd: project_path }, function (err, stdout, stderr) { });
    
    process.exit() ;
}

async function InitReactNative(InitConfigs: any) {
    let {
        command_loc,
        _cwd,
        config_path,
        project_path
    } = InitConfigs;

    let res = await fetch(`https://raw.githubusercontent.com/KeeganBruer/KBUi/refs/heads/main/native_content/template.zip`);
    if (res.status != 200) {
        console.log("problem fetching file")
        process.exit() ;
        return;
    }
    let blob = await res.blob()
    let buffer = await blob.arrayBuffer()
    fs.writeFileSync(config_path, Buffer.from(buffer));
    await decompress(config_path, project_path)
    fs.rmSync(config_path)

    child_process.exec('npm i', { cwd: project_path }, function (err, stdout, stderr) { });
    
    process.exit() ;
}