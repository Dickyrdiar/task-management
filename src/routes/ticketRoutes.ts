import { Router } from "express";
import { changeStatusAndPrio, createTicket, findAllTicket } from "../controller/tickets/ticket.controller";
// import { changeStatusAndPrio, createTicket, findAllTicket } from "../controller/tickets/ticket.controller";

const router = Router({ mergeParams: true })

router.get('/', findAllTicket)
router.post('/', createTicket)
router.put('/:id', changeStatusAndPrio)

export default router