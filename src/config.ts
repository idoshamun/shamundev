// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const SITE_TITLE = "Ido Shamun";
export const SITE_DESCRIPTION =
  "My tales as a technical founder, manager, and software engineer.";
export const TWITTER_HANDLE = "@idoshamun";
export const MY_NAME = "Ido Shamun";

// setup in astro.config.mjs
const BASE_URL = new URL(import.meta.env.SITE);
export const SITE_URL = BASE_URL.origin;
