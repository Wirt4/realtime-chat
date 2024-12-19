/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        /** user images are assumed to be sourced from google **/
        domains: ["lh3.googleusercontent.com"],
    },
    swcMinify: true
};

module.exports = nextConfig;
