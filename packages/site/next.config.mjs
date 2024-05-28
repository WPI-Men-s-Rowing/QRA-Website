import MillionLint from "@million/lint";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.regattatiming.com",
        port: "",
        pathname: "/images/org/*.svg",
      },
    ],
  },
};

export default MillionLint.next({ rsc: true })(nextConfig);
