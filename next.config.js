/** @type {import('next').NextConfig} */
const nextConfig = {
    callbacks: {
        async signIn({ user, account, profile, email, credentials }) {
            return true
        },
    },
}

module.exports = nextConfig
