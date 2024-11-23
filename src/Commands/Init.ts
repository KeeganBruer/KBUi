import yargs from "yargs"
import os from "os"
import { hideBin } from 'yargs/helpers'
import path from "path";
import * as fs from "fs";
import { PackageManager, PackageMetaType } from "../PackageManager";
import { ProjectConfigs } from "../ProjectConfigs";

export default async function Command(configs:ProjectConfigs, argv: yargs.ArgumentsCamelCase<{}>) {
    
    let command_loc = process.cwd();
    let _cwd = command_loc.split(path.sep);
    let config_path = [..._cwd, "kbui.jsonc"].join(path.sep);
    let res = await fetch(`https://raw.githubusercontent.com/KeeganBruer/KBUi/refs/heads/main/content/default_kbui.jsonc`);
    if (res.status != 200) {
        return;
    }
    let _configs = await res.text();
    fs.writeFileSync(config_path, _configs, {encoding:"utf-8"});
}
