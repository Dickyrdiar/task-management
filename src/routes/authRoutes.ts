import { Router } from "express";
import {  loginUser, logout } from "../controller/users/auth.controller";

const router = Router();

router.post('/', loginUser)
// router.get('/github', loginWithGithub)
// router.get("/github/callback", GithubCallback)
router.post('/logout', logout)


export default router;