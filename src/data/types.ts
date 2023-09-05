export type SiteConfig = {
	author: string;
	title: string;
	description: string;
	lang: string;
	ogLocale: string;
	date: {
		locale: string;
		options: Intl.DateTimeFormatOptions;
	};
	social: string;
	siteUrl: string;
	image: string;
	squad: string;
};
