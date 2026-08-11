/** @type {import('next').NextConfig} */
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig = {
  images: {
    domains: ['bonaventurechidalu.com.ng', 'via.placeholder.com'],
  },
};

export default withNextIntl(nextConfig);
