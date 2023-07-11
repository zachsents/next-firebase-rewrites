import fs from "fs/promises"
import path from "path"


export async function configureRoutes({
    firebaseConfigLocation = ".",
    dotNextLocation = ".",
    jsonSpaces = 4,
} = {}) {
    const firebaseConfigPath = path.join(firebaseConfigLocation, "firebase.json")

    // read in dynamic routes from manifest
    const { dynamicRoutes } = JSON.parse(
        await fs.readFile(path.join(dotNextLocation, ".next/routes-manifest.json"), "utf-8")
    )

    console.log("Adding", dynamicRoutes.length, "dynamic routes...")

    // read in firebase config
    const firebaseConfig = JSON.parse(
        await fs.readFile(firebaseConfigPath, "utf-8")
    )

    // take note of existing routes
    const existingRoutes = firebaseConfig.hosting?.rewrites?.map(route => route.regex) ?? []

    // add dynamic routes to hosting rewrites
    firebaseConfig.hosting ??= {}
    firebaseConfig.hosting.rewrites ??= []
    firebaseConfig.hosting.rewrites.push(
        ...dynamicRoutes
            // filter out existing ones
            .filter(route => !existingRoutes.includes(route.regex))
            // map to firebase format
            .map(route => ({
                regex: route.regex,
                destination: `${route.page}.html`,
            }))
    )

    // write out modified config
    await fs.writeFile(firebaseConfigPath, JSON.stringify(firebaseConfig, null, jsonSpaces))

    console.log("Done.\nReady for deployment ✅")
}
