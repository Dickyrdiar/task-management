import { Router } from "express";
// Update the import path below if the actual folder is 'controllers' or the filename is different (e.g., 'authController.ts')
import { loginUser, logout } from "../controller/users/auth.controller.js";

const router = Router();

router.post('/', loginUser)
// router.get('/github', loginWithGithub)
// router.get("/github/callback", GithubCallback)
router.post('/logout', logout)


export default router;