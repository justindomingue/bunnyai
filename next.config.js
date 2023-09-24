/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false
}

const withPWA = require('next-pwa')({
    dest: 'public'
  })
  
  module.exports = withPWA(nextConfig)