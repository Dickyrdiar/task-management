import { Router } from "express";
import { addUserToProject, createProject, findAllProject, findProjectById } from "../controller/projects/project.controller";

const router = Router()

router.get('/', findAllProject)
router.post('/', createProject)
router.get('/:id', findProjectById)
router.post('/:projectId/members', addUserToProject)

export default router