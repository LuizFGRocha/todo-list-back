import { Router } from 'express';
import { login } from '../controllers/login.js';
import { 
  bodyValidation, 
  loginSchema, 
  signUpSchema,
  taskSchema,
  taskListSchema,
  taskEditSchema,
  taskListEditSchema
} from '../middleware/bodyValidation.js';
import { signUp } from '../controllers/signUp.js';
import { checks } from '../middleware/checks.js';
import { checkJwtToken } from '../middleware/checkJWT.js';
import { 
  createTask,
  createTaskList,
  deleteTask,
  deleteTaskList,
  editTask,
  editTaskList,
  getTask,
  getTaskList,
  getTaskLists
} from '../controllers/tasks.js';

const router = Router();

router.get('/', (req, res) => {
    res.send('It works!');
});

router.post('/login', [ bodyValidation(loginSchema) ], login);

router.post('/signup', 
    [ 
      bodyValidation(signUpSchema), 
      checks.checkDuplicateEmail, 
      checks.checkDuplicateUsername 
    ], 
    signUp);

router.get('/taskLists/:userId', [ checks.checkParamUserId, checkJwtToken ], getTaskLists);

router.post('/taskList/:userId', 
    [ 
      bodyValidation(taskListSchema), 
      checks.checkParamUserId, 
      checkJwtToken 
    ], 
    createTaskList);

router.post('/task/:taskListId', 
    [ 
      bodyValidation(taskSchema), 
      checks.checkParamTaskListId, 
      checkJwtToken 
    ], 
    createTask);

router.get('/taskList/:taskListId', [ checks.checkParamTaskListId, checkJwtToken ], getTaskList);

router.get('/task/:taskId', [ checks.checkParamTaskId, checkJwtToken ], getTask);

router.put('/task/:taskId', 
    [ 
      bodyValidation(taskEditSchema), 
      checks.checkParamTaskId,
      checkJwtToken 
    ], 
    editTask);

router.put('/taskList/:taskListId',
    [ 
      bodyValidation(taskListEditSchema), 
      checks.checkParamTaskListId,
      checkJwtToken 
    ], 
    editTaskList);

router.delete('/task/:taskId', [ checks.checkParamTaskId, checkJwtToken ], deleteTask);

router.delete('/taskList/:taskListId', [ checks.checkParamTaskListId, checkJwtToken ], deleteTaskList);

router.get('/checkToken/:userId', [ checks.checkParamUserId, checkJwtToken ], (req, res) => {
    res.status(200).send('Token is valid');
});

export { router };
