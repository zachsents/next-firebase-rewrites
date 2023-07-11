#!/usr/bin/env node
import yargs from "yargs"
import { configureRoutes } from "./configure-routes.js"


yargs(process.argv.slice(2))
    .command("build", "Modifies the firebase.json file to include dynamic routes from Next.js's route-manifest.json.", {
        firebaseConfigLocation: {
            type: "string",
            description: "The path to the firebase.json file. Do not include the file name.",
            alias: "f",
            default: ".",
        },
        dotNextLocation: {
            type: "string",
            description: "The path to the .next folder. Do not include the folder name.",
            alias: "n",
            default: ".",
        },
        jsonSpaces: {
            type: "number",
            description: "The number of spaces to use when formatting the firebase.json file.",
            alias: "s",
            default: 4,
        },
    }, configureRoutes)
    .demandCommand()
    .help()
    .argv