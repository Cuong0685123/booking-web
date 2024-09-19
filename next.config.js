/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    async redirects() {
        return [
            {
                source: '/',                // Redirect from root URL
                destination: '/auth/login', // Redirect to /auth/login
                permanent: false,           // Use temporary redirect
            },
            {
                source: '/apps/mail',
                destination: '/apps/mail/inbox',
                permanent: true
            }
        ];
    }
};

module.exports = nextConfig;
