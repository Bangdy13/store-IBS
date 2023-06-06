// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
// }

module.exports = {
  env: {
    MONGODB_URL:
      "mongodb://ferdy:ferdy123@ac-iytqyl6-shard-00-00.feur5oz.mongodb.net:27017,ac-iytqyl6-shard-00-01.feur5oz.mongodb.net:27017,ac-iytqyl6-shard-00-02.feur5oz.mongodb.net:27017/app-storage?ssl=true&replicaSet=atlas-t4dcvd-shard-0&authSource=admin&retryWrites=true&w=majority",
    BASE_URL: "http://localhost:3000",
    ACCESS_TOKEN_SECRET: "C6!IxAp1Cl4350*zegti7ccfPIJi6ApzDB$k*LokBfB%j4990i",
    REFRESH_TOKEN_SECRET: "q&7ZnDt7@hFT2X7G^erd85ydHwAi10HDFc^1j$Gs*T#fj06wX0",
    PAYPAL_CLIENT_ID:
      "AbTURWewSOAqyCSuQJA7vp3MwbCjuWNpqEdIOQfeJeh4zd0cTz2LEJuDoqG-U82Vpgjk__dB9Udcls-v",
    CLOUD_UPLOAD_PRESET: "media_ibs",
    CLOUD_NAME: "bangdy",
    CLOUD_API_URL: "https://api.cloudinary.com/v1_1/bangdy/image/upload",
  },
};
