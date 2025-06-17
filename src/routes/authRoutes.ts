import { Router } from "express";
import { loginUser, logout } from "../controller/users/auth.controller";
// import { loginUser, logout } from "../controller/users/auth.controller";

const router = Router();

router.post('/', loginUser)
router.post('/logout', logout)


export default router;