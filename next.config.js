/** @type {import('next').NextConfig} */
module.exports = () => {
  const rewrites = () => {
    return [
      {
        source: "/api/v0.1/nft",
        destination: process.env.BACKEND_URL,
      },
    ];
  };
  return {
    rewrites,
    output: "standalone",
  };
};
