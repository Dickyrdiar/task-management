import { Router } from "express";
import { githubOauthCallback, redirectToGitHub } from '../controller/github_auth.controller'

const router = Router()

router.get('/', githubOauthCallback)
router.get('/login', redirectToGitHub)

export default router