/** @type {import('next').NextConfig} */
module.exports = () => {
  const rewrites = () => {
    return [
      {
        source: "/api/v0.1/nft",
        destination: `${process.env.BACKEND_URL}/nft`,
      },
      {
        source: "/api/v0.1/orders",
        destination: `${process.env.BACKEND_URL}/orders`,
      },
    ];
  };
  return {
    rewrites,
    output: "standalone",
  };
};
