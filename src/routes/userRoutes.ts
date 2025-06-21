import { Router } from "express";
import { createUsers, findAllUsers, findUsersById } from "../controller/users/users.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { RefreshTokn } from "../controller/users/auth.controller";

const router = Router();

router.get('/', authMiddleware, findAllUsers)
router.post('/', createUsers)
router.get('/:id', authMiddleware, findUsersById)
router.post('/refresh-toke', RefreshTokn)

export default router;