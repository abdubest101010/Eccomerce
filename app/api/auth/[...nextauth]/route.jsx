// app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import crypto from "crypto"; // For generating random passwords

// Customize the PrismaAdapter to generate passwords for OAuth users
const customPrismaAdapter = PrismaAdapter(prisma);
customPrismaAdapter.createUser = async (data) => {
  // Generate a random password for OAuth users
  const randomPassword = crypto.randomBytes(16).toString("hex");
  const hashedPassword = await bcrypt.hash(randomPassword, 10); // Hash the password

  return prisma.user.create({
    data: {
      ...data,
      password: hashedPassword, // Add the hashed password
    },
  });
};

export const authOptions = {
  adapter: customPrismaAdapter, // Use the customized adapter
  providers: [
    // Google Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    // Credentials Provider (email/password)
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) throw new Error("User not found");

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValid) throw new Error("Invalid password");

        // Return the user object with the id as a string
        return {
          ...user,
          id: user.id.toString(), // Convert id to string
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, token, user }) {
      // Add the user ID to the session
      session.user.id = token.sub || user.id;
      return session;
    },
    async jwt({ token, user }) {
      // Add the user ID to the token
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };