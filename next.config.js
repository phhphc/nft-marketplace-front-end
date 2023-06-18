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
        source: "/api/v0.1/auth/login",
        destination: `${process.env.BACKEND_SEPOLIA_URL}/auth/login`,
      },
      {
        source: "/api/v0.1/marketplace-settings",
        destination: `${process.env.BACKEND_SEPOLIA_URL}/marketplace-settings`,
      },
      {
        source: "/api/v0.1/auth/:address*/nonce",
        destination: `${process.env.BACKEND_SEPOLIA_URL}/auth/:address*/nonce`,
      },
      {
        source: "/api/v0.1/user/:address*/block",
        destination: `${process.env.BACKEND_SEPOLIA_URL}/user/:address*/block`,
      },
      {
        source: "/api/v0.1/user/role",
        destination: `${process.env.BACKEND_SEPOLIA_URL}/user/role`,
      },
      {
        source: "/api/v0.1/user/:address*",
        destination: `${process.env.BACKEND_SEPOLIA_URL}/user/:address*`,
      },
      {
        source: "/api/v0.1/user",
        destination: `${process.env.BACKEND_SEPOLIA_URL}/user`,
      },
      {
        source: "/api/v0.1/settings",
        destination: `${process.env.BACKEND_SEPOLIA_URL}/settings`,
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
      {
        source: "/api/v0.2/auth/login",
        destination: `${process.env.BACKEND_MUMBAI_URL}/auth/login`,
      },
      {
        source: "/api/v0.2/marketplace-settings",
        destination: `${process.env.BACKEND_MUMBAI_URL}/marketplace-settings`,
      },
      {
        source: "/api/v0.2/auth/:address*/nonce",
        destination: `${process.env.BACKEND_MUMBAI_URL}/auth/:address*/nonce`,
      },
      {
        source: "/api/v0.2/user/:address*/block",
        destination: `${process.env.BACKEND_MUMBAI_URL}/user/:address*/block`,
      },
      {
        source: "/api/v0.2/user/role",
        destination: `${process.env.BACKEND_MUMBAI_URL}/user/role`,
      },
      {
        source: "/api/v0.2/user/:address*",
        destination: `${process.env.BACKEND_MUMBAI_URL}/user/:address*`,
      },
      {
        source: "/api/v0.2/user",
        destination: `${process.env.BACKEND_MUMBAI_URL}/user`,
      },
      {
        source: "/api/v0.2/settings",
        destination: `${process.env.BACKEND_MUMBAI_URL}/settings`,
      },
    ];
  };
  return {
    rewrites,
    output: "standalone",
  };
};
