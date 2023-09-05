import type { SiteConfig } from "./data/types";

const BASE_URL = new URL(import.meta.env.SITE);

export const siteConfig: SiteConfig = {
	author: "Ido Shamun",
	title: "Ido Shamun",
	description: "My tales as a technical founder, manager, and software engineer.",
	lang: "en-US",
	ogLocale: "en_US",
	// Date.prototype.toLocaleDateString() parameters, found in src/utils/date.ts.
	date: {
		locale: "en-US",
		options: {
			day: "numeric",
			month: "short",
			year: "numeric",
		},
	},
	social: "idoshamun",
	siteUrl: BASE_URL.origin,
	image: "https://shamun.dev/me.jpeg",
	squad: "https://dly.to/3TqPE3JAB4Y",
};

