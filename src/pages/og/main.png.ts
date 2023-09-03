import satori from "satori";
import { html } from "satori-html";
import { Resvg } from "@resvg/resvg-js";
import { siteConfig } from "../../site.config";
import {ogOptions} from "../../ogImage";

const markup = () => html`
    <div
            tw="flex flex-col w-full h-full bg-[#0E1217] text-[#ffffff]"
    >
        <div tw="flex flex-col flex-1 w-full p-10 justify-center">
            <div tw="flex items-center">
                <img src="${siteConfig.image}" width="256" height="256" tw="w-32 h-32 rounded-full mr-8" alt="Me" />
                <h1 tw="text-6xl font-bold leading-snug text-white">${siteConfig.author}</h1>
            </div>
        </div>
        <div tw="flex items-center justify-between w-full p-10 border-t border-[#C029F0] text-xl"></div>
    </div>`;

export async function GET() {
    const svg = await satori(markup(), ogOptions);
    const png = new Resvg(svg).render().asPng();
    return {
        body: png,
        encoding: "binary",
    };
}
