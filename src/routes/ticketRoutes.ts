import { Router } from "express";
import { CreateComment, findAllCommentByticket } from '../controller/comments/comment.controller.js'
import { changeStatusAndPrio, createTicket, findAllTicket, findTicketById } from "../controller/tickets/ticket.controller.js";

const router = Router({ mergeParams: true })

router.get('/', findAllTicket)
router.post('/', createTicket)
router.get('/:id', findTicketById)
router.put('/:id', changeStatusAndPrio)

// comment
router.get('/:id/comments', findAllCommentByticket)
router.post('/:id/comments', CreateComment)
// router.post('/:id/comments', CommentTicker)


export default router