/** @type {import('next').NextConfig} */
module.exports = () => {
  const rewrites = () => {
    return [
      {
        source: "/api/v0.1/nft",
        destination: `${process.env.BACKEND_SEPOLIA_URL}/nft`,
      },
      {
        source: "/api/v0.1/collection/:path*",
        destination: `${process.env.BACKEND_SEPOLIA_URL}/collection/:path*`,
      },
      {
        source: "/api/v0.1/order",
        destination: `${process.env.BACKEND_SEPOLIA_URL}/order`,
      },
      {
        source: "/api/v0.1/orderV2",
        destination: `${process.env.BACKEND_SEPOLIA_URL}/orderV2`,
      },
      {
        source: "/api/v0.1/order/offer",
        destination: `${process.env.BACKEND_SEPOLIA_URL}/orders/offer`,
      },
      {
        source: "/api/v0.1/order/hash",
        destination: `${process.env.BACKEND_SEPOLIA_URL}/order/hash`,
      },
      {
        source: "/api/v0.1/profile/:address*",
        destination: `${process.env.BACKEND_SEPOLIA_URL}/profile/:address*`,
      },
      {
        source: "/api/v0.1/profile",
        destination: `${process.env.BACKEND_SEPOLIA_URL}/profile`,
      },
      {
        source: "/api/v0.1/event",
        destination: `${process.env.BACKEND_SEPOLIA_URL}/event`,
      },
      {
        source: "/api/v0.1/nft/:token*/:identifier*",
        destination: `${process.env.BACKEND_SEPOLIA_URL}/nft/:token*/:identifier*`,
      },
      {
        source: "/api/v0.1/notification",
        destination: `${process.env.BACKEND_SEPOLIA_URL}/notification`,
      },
      {
        source: "/api/v0.2/nft",
        destination: `${process.env.BACKEND_MUMBAI_URL}/nft`,
      },
      {
        source: "/api/v0.2/collection/:path*",
        destination: `${process.env.BACKEND_MUMBAI_URL}/collection/:path*`,
      },
      {
        source: "/api/v0.2/order",
        destination: `${process.env.BACKEND_MUMBAI_URL}/order`,
      },
      {
        source: "/api/v0.2/orderV2",
        destination: `${process.env.BACKEND_MUMBAI_URL}/orderV2`,
      },
      {
        source: "/api/v0.2/order/offer",
        destination: `${process.env.BACKEND_MUMBAI_URL}/orders/offer`,
      },
      {
        source: "/api/v0.2/order/hash",
        destination: `${process.env.BACKEND_MUMBAI_URL}/order/hash`,
      },
      {
        source: "/api/v0.2/profile/:address*",
        destination: `${process.env.BACKEND_MUMBAI_URL}/profile/:address*`,
      },
      {
        source: "/api/v0.2/profile",
        destination: `${process.env.BACKEND_MUMBAI_URL}/profile`,
      },
      {
        source: "/api/v0.2/event",
        destination: `${process.env.BACKEND_MUMBAI_URL}/event`,
      },
      {
        source: "/api/v0.2/nft/:token*/:identifier*",
        destination: `${process.env.BACKEND_MUMBAI_URL}/nft/:token*/:identifier*`,
      },
      {
        source: "/api/v0.2/notification",
        destination: `${process.env.BACKEND_MUMBAI_URL}/notification`,
      },
    ];
  };
  return {
    rewrites,
    output: "standalone",
  };
};
