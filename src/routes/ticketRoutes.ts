import { Router } from "express";
import { changeStatusAndPrio, createTicket, findAllTicket } from "../controller/ticket.controller";

const router = Router()

router.get('/', findAllTicket)
router.post('/', createTicket)
router.put('/:id', changeStatusAndPrio)

export default router