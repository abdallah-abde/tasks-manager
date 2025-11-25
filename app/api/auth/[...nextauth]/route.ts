// import NextAuth from "next-auth";
// import Github from "next-auth/providers/github";

// export const authOptions = {
//   providers: [Github],
// };

// export const handler = NextAuth(authOptions);

// export { handler as GET, handler as POST };

import { handlers } from "@/auth"; // Referring to the auth.ts we just created
export const { GET, POST } = handlers;
