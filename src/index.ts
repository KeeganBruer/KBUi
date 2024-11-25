#!/usr/bin/env node
import yargs from "yargs"
import os from "os"
import { hideBin } from 'yargs/helpers'
import path from "path";
import * as fs from "fs";
import InstallCommand from "./Commands/Install";
import InitCommand from "./Commands/Init";
import ProjectInitCommand from "./Commands/ProjectInit";
import { ProjectConfigs } from "./ProjectConfigs";

let configs = new ProjectConfigs();

yargs(hideBin(process.argv))
    .command('init', 'Create a default kbui.jsonc file in the current directory', (yargs) => {
            
    }, (args)=>InitCommand(configs, args))
    .command('project init <project_name>', 'Create a Nextjs Template with KBUi configured', (yargs) => {
        yargs.positional('project_name', {
            describe: 'name of project',
            type: 'string',
        })   
    }, (args)=>ProjectInitCommand(configs, args))
    .command('install <package_id>', 'Install content specified by the ID', (yargs) => {
        yargs.positional('package_id', {
            describe: 'content ID',
            type: 'string',
          })
    }, (args)=>InstallCommand(configs, args))
    .demandCommand(1)
    .help()
    .parse();

