import path from "path"
import * as fs from "fs";
import { withAsyncErrorCatch, withSyncErrorCatch } from "./withErrorCatch";

export class ProjectConfigs {
    cwd: string[]
    install_location:string[]
    package_library:string
    constructor() {
        let _cwd = process.cwd();
        this.cwd = _cwd.split(path.sep)
        let configLoc = [...this.cwd, "kbui.jsonc"].join(path.sep)
        
        let res = withSyncErrorCatch(() => {
            return fs.readFileSync(configLoc, { encoding: "utf-8" })
        })
        //Read text from config location
        if (res.error) {
            this.install_location = []
            this.package_library = ""
            return;
        }
        let text = res.getData();
        //clean comments from json file
        var comments = new RegExp("\\s+//.*", 'mg');
        var multi_line = new RegExp("\\s+/\\*[^*]*\\*+(?:[^/*][^*]*\\*+)*/", 'mg');
        text = text.replace(comments, '');
        text = text.replace(multi_line, '');

        //parse text to json
        let json = JSON.parse(text);
        
        //Set attributes based on file json
        if (json.install_location != undefined) {
            this.install_location = json.install_location.split("/");
        } else {
            this.install_location = ["src"]
        }

        this.package_library = json.package_library;

    }
}