import { Router } from "express";
import  passport  from 'passport'
import { authGithubController } from "../controller/github_auth.controller";

const router = Router()

router.get('/github',
  passport.authenticate('github', { scope: ['user:email'] })
)

router.get(
   '/github/callback',
   passport.authenticate('github', { session: false, failureRedirect: '/login' }),
   authGithubController
)

export default router