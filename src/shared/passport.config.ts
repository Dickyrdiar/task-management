// import passport from "passport"
// import { Strategy as GitHubStrategy } from "passport-github2"
// import { githubConfig } from "../config/github.config"
// import { PrismaClient } from "@prisma/client"

// const prisma = new PrismaClient()

// export const configurePassport = () => {
//   passport.use(
//     new GitHubStrategy(
//         githubConfig,

//       async (accessToken: string, refreshToken: string, profile: any, done: any) => {
//         try {
//           const primaryEmail = profile.emails?.[0]?.value
          
//           if (!primaryEmail) {
//             return done(new Error('email is not found'))
//           }

//           let user = await prisma.user.findFirst({
//             where: {
//               OR: [
//                 { githubId: profile.id },
//                 { email: primaryEmail }
//               ]
//             }
//           })
//         } catch (error) {
//           return done(error as Error)
//         }
//       }
//     )
//   )
// }