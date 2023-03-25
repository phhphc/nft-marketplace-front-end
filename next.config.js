/** @type {import('next').NextConfig} */
module.exports = () => {
  const rewrites = () => {
    return [
      {
        source: "/api/v0.1/nft",
        destination: `${process.env.BACKEND_URL}/nft?limit=100&offset=0`,
      },
      {
        source: "/api/v0.1/order",
        destination: `${process.env.BACKEND_URL}/order`,
      },
      {
        source: "/api/v0.1/order/offer",
        destination: `${process.env.BACKEND_URL}/orders/offer`,
      },
      {
        source: "/api/v0.1/order/hash",
        destination: `${process.env.BACKEND_URL}/order/hash`,
      },
    ];
  };
  return {
    rewrites,
    output: "standalone",
  };
};
