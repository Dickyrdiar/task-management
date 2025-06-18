import { Router } from "express";
import { changeStatusAndPrio, CommentTicker, createTicket, findAllCommentByticket, findAllTicket, findTicketById } from "../controller/tickets/ticket.controller";
// import { changeStatusAndPrio, createTicket, findAllTicket } from "../controller/tickets/ticket.controller";

const router = Router({ mergeParams: true })

router.get('/', findAllTicket)
router.post('/', createTicket)
router.get('/:id', findTicketById)
router.put('/:id', changeStatusAndPrio)
router.post('/:id/comments', CommentTicker)
router.get('/:id/comments', findAllCommentByticket)

export default router