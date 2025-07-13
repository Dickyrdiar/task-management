import { Router } from "express";
import { CreateComment, findAllCommentByticket } from '../controller/comments/comment.controller.js'
import { changeStatusAndPrio, createTicket, findAllTicket, findTicketById } from "../controller/tickets/ticket.controller.js";

const router = Router({ mergeParams: true })

router.get('/agiles/:agileId/tickets', findAllTicket)
router.post('/agiles/:agileId/tickets', createTicket)
router.get('/:projectId/agiles/:agileId/:id', findTicketById)
router.put('/:projectId/agiles/:agileId/:id', changeStatusAndPrio)

// comment
router.get('/:id/comments', findAllCommentByticket)
router.post('/:id/comments', CreateComment)
// router.post('/:id/comments', CommentTicker)


export default router