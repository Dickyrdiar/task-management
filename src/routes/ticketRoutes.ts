import { Router } from "express";
import { changeStatusAndPrio, CommentTicker, createTicket, findAllTicket } from "../controller/tickets/ticket.controller";
// import { changeStatusAndPrio, createTicket, findAllTicket } from "../controller/tickets/ticket.controller";

const router = Router({ mergeParams: true })

router.get('/', findAllTicket)
router.post('/', createTicket)
router.put('/:id', changeStatusAndPrio)
router.post('/:id/comments', CommentTicker)

export default router