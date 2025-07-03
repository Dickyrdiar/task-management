import { Router } from "express";
import { addUserToProject, createProject, findAllProject, findProjectById } from "../controller/projects/project.controller.js";
import { findAllSprint, CreateAgile, agileSystemById } from "../controller/agile/agile.controller.js"

const router = Router()

router.get('/', findAllProject)
router.post('/', createProject)
router.get('/:id', findProjectById)
router.post('/:projectId/members', addUserToProject)

// agile routes
router.get('/:projectId/agiles', findAllSprint)
router.post('/:projectId/agiles', CreateAgile)
router.get('/:projectId/agiles/:id', agileSystemById)

export default router