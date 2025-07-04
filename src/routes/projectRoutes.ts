import { Router } from "express";
import { addUserToProject, createProject, findAllProject, findProjectById } from "../controller/projects/project.controller";
import { agileSystemById, CaryOverTickets, CreateAgile, findAllSprint } from '../controller/agile/agile.controller'

const router = Router()

router.get('/', findAllProject)
router.post('/', createProject)
router.get('/:id', findProjectById)
router.post('/:projectId/members', addUserToProject)

// agile routes
router.get('/:projectId/agiles', findAllSprint)
router.post('/:projectId/agiles', CreateAgile)
router.get('/:projectId/agiles/:id', agileSystemById)
router.post('/:projectId/:id/carry', CaryOverTickets)

export default router