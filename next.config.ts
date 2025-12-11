/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http', // Use 'http' for local development
        hostname: '127.0.0.1', // Or 'localhost'
        port: '3000', // Specify the port your backend runs on
        pathname: '/public/assets/img/**', // Optional: restrict to a specific path
      },
    ],
  },
  // async redirects() {
  //   return [
  //     {
  //       source: "/",
  //       destination: "/signin",
  //       permanent: false, // temporary redirect
  //     },
  //   ];
  // },
  webpack(config: { ignoreWarnings: ({ module: RegExp; message?: undefined; } | { message: RegExp; module?: undefined; })[]; }) {
    config.ignoreWarnings = [
      // Ignore warnings from your customStyle.scss
      {
        module: /customStyle\.scss/,
      },
      // Ignore Webpack cache serialization warnings
      {
        message: /No serializer registered for Warning/,
      },
    ];
    return config;
  },
};

export default nextConfig;
