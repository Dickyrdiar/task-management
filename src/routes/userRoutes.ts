import { Router } from "express";
import { createUsers, findAllUsers, findUsersById } from "../controller/users/users.controller";

const router = Router();

router.get('/', findAllUsers)
router.post('/', createUsers)
router.get('/:id', findUsersById)

export default router;