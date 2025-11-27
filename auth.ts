// export const runtime = "nodejs";

import NextAuth from "next-auth";

// import { PrismaAdapter } from "@auth/prisma-adapter";
// import prisma from "./lib/prisma";
import GitHub from "next-auth/providers/github";

// const adapter = PrismaAdapter(prisma);

export const { handlers, signIn, signOut, auth } = NextAuth({
  // adapter,
  session: {
    strategy: "jwt",
  },
  providers: [
    GitHub,
    // ({
    //   clientId: process.env.AUTH_GITHUB_ID,
    //   clientSecret: process.env.AUTH_GITHUB_SECRET,
    //   // profile: async (val) => {
    //   //   await prisma.user.findMany();
    //   //   return {};
    //   // },
    // }),
  ],
  pages: { signIn: "/sign-in" },
});
