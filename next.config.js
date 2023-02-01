/** @type {import('next').NextConfig} */
module.exports = () => {
  const rewrites = () => {
    return [
      {
        source: "/nfts",
        destination: "http://localhost:9090/nfts",
      },
    ];
  };
  return {
    rewrites,
  };
};
