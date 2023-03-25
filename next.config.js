/** @type {import('next').NextConfig} */
module.exports = () => {
  const rewrites = () => {
    return [
      {
        source: "/api/v0.1/nft",
        destination: `${process.env.BACKEND_URL}/nft?limit=100&offset=0`,
      },
      {
        source: "/api/v0.1/collection",
        destination: `${process.env.BACKEND_URL}/collection`,
      },
      {
        source: "/api/v0.1/orders",
        destination: `${process.env.BACKEND_URL}/orders`,
      },
      {
        source: "/api/v0.1/orders/offer",
        destination: `${process.env.BACKEND_URL}/orders/offer`,
      },
    ];
  };
  return {
    rewrites,
    output: "standalone",
  };
};
