import NextAuth from "next-auth"
import OktaProvider from "next-auth/providers/okta";

const handler = NextAuth({
    providers: [
        OktaProvider({
            clientId: process.env.NEXT_PUBLIC_OKTA_CLIENT_ID as string,
            clientSecret: process.env.NEXT_PUBLIC_OKTA_CLIENT_SECRET as string,
            issuer: process.env.NEXT_PUBLIC_OKTA_ISSUER as string
        }),
        // ...add more providers here
    ],
    session: {
        strategy: 'jwt',
    },
    secret: process.env.NEXT_PUBLIC_SECRET as string
})



export { handler as GET, handler as POST }