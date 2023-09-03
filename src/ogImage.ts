import {join, resolve} from "node:path";
import {readFileSync} from "node:fs";
import {SatoriOptions} from "satori";

const AssetDir = resolve("src", "assets");
const RobotoMonoPath = join(AssetDir, "roboto-mono-regular.ttf");
const RobotoMonoBoldPath = join(AssetDir, "roboto-mono-700.ttf");

const RobotoMonoReg = readFileSync(RobotoMonoPath);
const RobotoMonoBold = readFileSync(RobotoMonoBoldPath);

export const ogOptions: SatoriOptions = {
    width: 1200,
    height: 630,
    // debug: true,
    fonts: [
        {
            name: "Roboto Mono",
            data: RobotoMonoReg,
            weight: 400,
            style: "normal",
        },
        {
            name: "Roboto Mono",
            data: RobotoMonoBold,
            weight: 700,
            style: "normal",
        },
    ],
};
