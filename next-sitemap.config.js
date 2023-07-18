/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || "https://whiteboard-puce.vercel.app/",
  generateRobotsTxt: true,
};
