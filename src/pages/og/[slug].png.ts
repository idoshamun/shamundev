import type { APIContext, GetStaticPaths } from "astro";
import satori from "satori";
import { html } from "satori-html";
import { Resvg } from "@resvg/resvg-js";
import {readAll, readOne} from "../../lib/markdoc/read";
import { blog } from "../../lib/markdoc/frontmatter.schema";
import { siteConfig } from "../../site.config";
import { getFormattedDate } from "../../date";
import {ogOptions} from "../../ogImage";

const markup = (title: string, pubDate: string) => html`
    <div
            tw="flex flex-col w-full h-full bg-[#0E1217] text-[#ffffff]"
    >
        <div tw="flex flex-col flex-1 w-full p-10 justify-center">
            <p tw="text-2xl mb-6">${pubDate}</p>
            <h1 tw="text-6xl font-bold leading-snug text-white">${title}</h1>
        </div>
        <div tw="flex items-center justify-between w-full p-10 border-t border-[#C029F0] text-xl">
            <div tw="flex items-center">
                <img src="${siteConfig.image}" width="256" height="256" tw="w-16 h-16 rounded-full" alt="Me" />
                <p tw="ml-3 text-2xl font-semibold">${siteConfig.author}</p>
            </div>
        </div>
    </div>`;

export async function GET({params: {slug}}: APIContext) {
    const post = await readOne({
        directory: "blog",
        slug,
        frontmatterSchema: blog,
    });
    const title = post?.frontmatter.title;
    const postDate = getFormattedDate(post.frontmatter.date ?? new Date());
    const svg = await satori(markup(title, postDate), ogOptions);
    const png = new Resvg(svg).render().asPng();
    return {
        body: png,
        encoding: "binary",
    };
}

export const getStaticPaths: GetStaticPaths = (async () => {
    const posts = await readAll({
        directory: "blog",
        frontmatterSchema: blog,
    });

    return posts.filter(({frontmatter = {}}) => !frontmatter.ogImagePath).map(({slug}) => ({params: {slug}}));
});
