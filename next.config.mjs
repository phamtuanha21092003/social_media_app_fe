/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "http",
                hostname: "localhost",
                port: "9000",
                pathname: "/wey-bucket/**",
            },
        ],
    },
}

export default nextConfig
