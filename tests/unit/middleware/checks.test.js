import { checks } from "../../../src/server/middleware/checks.js";
import httpMocks from "node-mocks-http";
import { initializeDatabase } from '../../dbHandler.js'
import { StatusCodes } from "http-status-codes";
import { User } from "../../../src/server/models/user.js";
import { Task } from "../../../src/server/models/task.js";
import { TaskList } from "../../../src/server/models/taskList.js";

let dbHandler;
let next;
let res;
let user;
let taskList;
let task;

const validUser = {
  username: 'johndoe',
  email: 'johndoe@gmail.com',
  password: 'password'
};

const validTaskList = {
  name: 'New Task List',
  description: 'This is a new task list',
  date: new Date()
};

const validTask = {
  title: 'New Task',
  description: 'This is a new task',
  date: new Date(),
  completed: false
};

beforeAll(async () => {
  dbHandler = await initializeDatabase();
  dbHandler.connect();

  res = httpMocks.createResponse();
  next = jest.fn();
});

beforeEach(async () => {
  user = new User(validUser);
  await user.save();
  res.locals.user = user;

  taskList = new TaskList(validTaskList);
  taskList.owner = user._id;
  await taskList.save();
  res.locals.taskList = taskList;

  task = new Task(validTask);
  task.owner = user._id;
  task.taskList = taskList._id;
  await task.save();
  res.locals.task = task;
});

afterEach(async () => {
  await dbHandler.clearDatabase();
  res = httpMocks.createResponse();
});

afterAll(async () => await dbHandler.closeDatabase());

describe('checkParamUserId', () => {
  test('should return 400 if user not found', async () => {
      const req = httpMocks.createRequest({
          params: { userId: '65ff690c34e350de1d4acf02' }
      });

      await checks.checkParamUserId(req, res, next);

      expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
      expect(res._getJSONData()).toEqual({ message: 'User not found' });
  });

  test('should set res.locals.user if user is found', async () => {
      const req = httpMocks.createRequest({
          params: { userId: user._id }
      });

      res = httpMocks.createResponse();

      await checks.checkParamUserId(req, res, next);

      expect(res.locals.user == user);
  });
});

describe('checkParamTaskListId', () => {
  test('should return 400 if task list not found', async () => {
      const req = httpMocks.createRequest({
          params: { taskListId: '65ff690c34e350de1d4acf02' }
      });

      await checks.checkParamTaskListId(req, res, next);

      expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
      expect(res._getJSONData()).toEqual({ message: 'Task list not found' });
  });

  test('should set res.locals.taskList and res.locals.user if task list is found', async () => {
      const req = httpMocks.createRequest({
          params: { taskListId: taskList._id }
      });

      res = httpMocks.createResponse();

      await checks.checkParamTaskListId(req, res, next);

      expect(res.locals.taskList == taskList);
      expect(res.locals.user == user);
  });
});

describe('checkParamTaskId', () => {
  test('should return 400 if task not found', async () => {
      const req = httpMocks.createRequest({
          params: { taskId: '65ff690c34e350de1d4acf02' }
      });

      await checks.checkParamTaskId(req, res, next);

      expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
      expect(res._getJSONData()).toEqual({ message: 'Task not found' });
  });

  test('should set res.locals.task, res.locals.taskList, and res.locals.user if task is found', async () => {
      const req = httpMocks.createRequest({
          params: { taskId: task._id }
      });

      res = httpMocks.createResponse();

      await checks.checkParamTaskId(req, res, next);

      expect(res.locals.task == task);
      expect(res.locals.taskList == taskList);
      expect(res.locals.user == user);
  });
});

describe('checkDuplicateEmail', () => {
  test('should return 400 if email is already in use', async () => {
      const req = httpMocks.createRequest({
          body: { email: 'johndoe@gmail.com' }
      });

      await checks.checkDuplicateEmail(req, res, next);

      expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
      expect(res._getJSONData()).toEqual({ message: 'Email already in use' });
  });
});

describe('checkDuplicateUsername', () => {
  test('should return 400 if username is already in use', async () => {
      const req = httpMocks.createRequest({
          body: { username: 'johndoe' }
      });

      await checks.checkDuplicateUsername(req, res, next);

      expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
      expect(res._getJSONData()).toEqual({ message: 'Username already in use' });
  });
});