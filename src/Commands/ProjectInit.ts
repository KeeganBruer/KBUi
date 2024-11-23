import yargs from "yargs"
import os from "os"
import { hideBin } from 'yargs/helpers'
import path from "path";
import * as fs from "fs";
import { PackageManager, PackageMetaType } from "../PackageManager";
import { ProjectConfigs } from "../ProjectConfigs";
import decompress from "decompress";

export default async function Command(configs:ProjectConfigs, argv: yargs.ArgumentsCamelCase<{}>) {
    
    let command_loc = process.cwd();
    let _cwd = command_loc.split(path.sep);
    let config_path = [..._cwd, "temp.zip"].join(path.sep);
    let project_path = [..._cwd, "dist"].join(path.sep);
    let res = await fetch(`https://raw.githubusercontent.com/KeeganBruer/KBUi/refs/heads/main/content/nextjs_w_kbui.zip`);
    if (res.status != 200) {
        console.log("problem fetching file")
        return;
    }
    let blob = await res.blob()
    let buffer = await blob.arrayBuffer()
    fs.writeFileSync(config_path, Buffer.from(buffer));
    await decompress(config_path, project_path)
    fs.rmSync(config_path)
}
