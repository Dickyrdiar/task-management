import { Router } from "express";
import { createUsers, findAllUsers, findUsersById } from "../controller/users/users.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { RefreshTokn } from "../controller/users/auth.controller.js";

const router = Router();

router.get('/', authMiddleware, findAllUsers)
router.post('/', createUsers)
router.get('/:id', authMiddleware, findUsersById)
router.post('/refresh-toke', RefreshTokn)

export default router;