/** @type {import('next').NextConfig} */
module.exports = () => {
  const rewrites = () => {
    return [
      {
        source: "/nfts",
        destination: process.env.BACKEND_URL,
      },
    ];
  };
  return {
    rewrites,
    output: "standalone",
  };
};
