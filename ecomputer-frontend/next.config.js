
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  
  images: {
    domains: ['localhost', 'api.example.com', 'ecomputerservice.blob.core.windows.net'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.example.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ecomputerservice.blob.core.windows.net',
        pathname: '/images/**',
      },
    ],
  },
 
  async headers() {
    return [
      {
      
        source: '/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization' },
        ],
      },
    ];
  },
 
  async rewrites() {
    return {
      beforeFiles: [
        // Exclude image-proxy from being rewritten
        {
          source: '/api/image-proxy',
          destination: '/api/image-proxy',
        },
        // Rewrite all other API routes to the backend
        {
          source: '/api/:path*',
          destination: 'http://localhost:5000/api/:path*',
        }
      ]
    };
  },
};

export default nextConfig;
