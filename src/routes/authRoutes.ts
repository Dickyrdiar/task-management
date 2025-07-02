import { Router } from "express";
import {  GithubCallback, loginUser, loginWithGithub,  logout } from "../controller/users/auth.controller";

const router = Router();

router.post('/', loginUser)
router.get('/github', loginWithGithub)
router.get("/github/callback", GithubCallback)
router.post('/logout', logout)


export default router;