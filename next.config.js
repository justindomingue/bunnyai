/** @type {import('next').NextConfig} */
const nextConfig = {}

const withPWA = require('next-pwa')({
    dest: 'public'
  })
  
  module.exports = withPWA(nextConfig)