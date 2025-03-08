import { Router } from "express";
import { createUsers, findAllUsers, findUsersById } from "../controller/users.controller";
import { findProjectById } from "../controller/project.controller";

const router = Router();

router.get('/', findAllUsers);
router.post('/', createUsers);
router.get('/:id', findUsersById);

export default router;