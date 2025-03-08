import { Router } from "express";
import { addUserToProject, createProject, findAllProject, findProjectById } from "../controller/project.controller";

const router = Router()

router.get('/', findAllProject)
router.post('/', createProject)
router.get('/:id', findProjectById)
router.post('/:id/addUserToProject', addUserToProject)

export default router