/** @type {import('next').NextConfig} */
module.exports = () => {
  const rewrites = () => {
    return [
      {
        source: "/api/v0.1/nft",
        destination: `${process.env.BACKEND_URL}/nft`,
      },
      {
        source: "/api/v0.1/collection/:path*",
        destination: `${process.env.BACKEND_URL}/collection/:path*`,
      },
      {
        source: "/api/v0.1/order",
        destination: `${process.env.BACKEND_URL}/order`,
      },
      {
        source: "/api/v0.1/orderV2",
        destination: `${process.env.BACKEND_URL}/orderV2`,
      },
      {
        source: "/api/v0.1/order/offer",
        destination: `${process.env.BACKEND_URL}/orders/offer`,
      },
      {
        source: "/api/v0.1/order/hash",
        destination: `${process.env.BACKEND_URL}/order/hash`,
      },
      {
        source: "/api/v0.1/profile",
        destination: `${process.env.BACKEND_URL}/profile`,
      },
      {
        source: "/api/v0.1/profile/:address*",
        destination: `${process.env.BACKEND_URL}/profile/:address*`,
      },
    ];
  };
  return {
    rewrites,
    output: "standalone",
  };
};
