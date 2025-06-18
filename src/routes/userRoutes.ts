import { Router } from "express";
import { createUsers, findAllUsers, findUsersById } from "../controller/users/users.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.get('/', authMiddleware, findAllUsers)
router.post('/', createUsers)
router.get('/:id', authMiddleware, findUsersById)

export default router;