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
    let location = [..._cwd, ...configs.install_location]
    
    let manager = new PackageManager(configs)
    
    let packageMeta = manager.getPackageMeta(argv.package_id as string)
    
    packageMeta.install(location)
}
