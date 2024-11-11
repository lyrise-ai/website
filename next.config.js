module.exports = {
  experimental: {
    images: {
      allowFutureImage: true,
      // domains: ["www.gravatar.com", "www.freepnglogos.com"], 
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'www.gravatar.com',
          port: '',
          pathname: '/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250',
        },
        {
          protocol: 'https',
          hostname: 'www.freepnglogos.com',
          port: '',
          pathname: '/uploads/image-microsoft-logo--5.png',
        },
        {
          protocol: 'https',
          hostname: 'www.freepnglogos.com',
          port: '',
          pathname: '/uploads/google-logo-png/google-logo-png-google-icon-logo-png-transparent-svg-vector-bie-supply-14.png',
        },
      ],
    },
  },
  reactStrictMode: false,
}
