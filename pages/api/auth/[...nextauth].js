import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import LinkedInProvider from 'next-auth/providers/linkedin'
import TwitterProvider from 'next-auth/providers/twitter'

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
    }),
    // TwitterProvider({
    //   clientId: process.env.TWITTER_CLIENT_ID,
    //   clientSecret: process.env.TWITTER_CLIENT_SECRET,
    //   version: '2.0', // opt-in to Twitter OAuth 2.0
    // }),
  ],
}

export default NextAuth(authOptions)
