'use strict'
const router = require('express').Router()
const projectController = require('../controllers/projectController.js')
const { authenticate, projectAuth , projectTodoAuth} = require('../middlewares/auth')

router.use(authenticate)
router.post('/', projectController.create)
router.get('/all', projectController.findAll)
router.get('/:id', projectController.findOne)
router.delete('/:id', projectAuth, projectController.destroy)
router.put('/:id', projectAuth, projectController.update)
router.put('/:id/member', projectAuth, projectController.addMember)
router.put('/:id/todo', projectTodoAuth, projectController.addTodo)
router.patch('/:id/update/status/:todoId', projectTodoAuth, projectController.updateTodoStatus)
router.put('/:id/update/todo/:todoId', projectTodoAuth, projectController.updateTodo)
router.put('/:id/delete/todo/:todoId', projectTodoAuth, projectController.deleteTodo)
router.put('/:id/remove/member/:memberId', projectAuth, projectController.removeMember)

module.exports = router