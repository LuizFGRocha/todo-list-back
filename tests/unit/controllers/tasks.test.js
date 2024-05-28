import { checks } from "../../../src/server/middleware/checks.js";
import httpMocks from "node-mocks-http";
import { initializeDatabase } from '../../dbHandler.js'
import { StatusCodes } from "http-status-codes";
import { User } from "../../../src/server/models/user.js";
import { Task } from "../../../src/server/models/task.js";
import { TaskList } from "../../../src/server/models/taskList.js";
import { 
  createTaskList,
  editTaskList,
  getTaskList,
  deleteTaskList,
  createTask,
  editTask,
  getTask,
  deleteTask,
  getTaskLists
} from "../../../src/server/controllers/tasks.js";

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

describe('editTask', () => {
  test("editTask should update the task successfully", async () => {
    const req = {
      body: {
        title: "Updated Task",
        description: "This is an updated task",
        date: new Date(),
        completed: true,
        removeDate: false,
      },
    };

    const res = httpMocks.createResponse();
    res.locals.task = task;

    await editTask(req, res);

    expect(res.statusCode).toBe(StatusCodes.OK);
    expect(res._getJSONData()).toEqual({
      message: "Task edited successfully",
    });

    const updatedTask = await Task.findById(task._id);
    expect(updatedTask.title).toBe("Updated Task");
    expect(updatedTask.description).toBe("This is an updated task");
    expect(updatedTask.date).toEqual(expect.any(Date));
    expect(updatedTask.completed).toBe(true);
  });

  test("editTask should update only the title", async () => {
    const req = {
      body: {
        title: "Updated Task",
      },
    };

    const res = httpMocks.createResponse();
    res.locals.task = task;

    await editTask(req, res);

    expect(res.statusCode).toBe(StatusCodes.OK);
    expect(res._getJSONData()).toEqual({
      message: "Task edited successfully",
    });

    const updatedTask = await Task.findById(task._id);
    expect(updatedTask.title).toBe("Updated Task");
    expect(updatedTask.description).toBe("This is a new task");
    expect(updatedTask.date).toEqual(expect.any(Date));
    expect(updatedTask.completed).toBe(false);
  });
});

describe('getTask', () => {
  test('getTask should return the task successfully', async () => {
    const req = httpMocks.createRequest({
      params: { taskId: task._id }
    });

    await getTask(req, res);

    expect(res.statusCode).toBe(StatusCodes.OK);
    expect(res._getJSONData()).toEqual({
      task: {
        __v: 0,
        _id: task._id.toString(),
        title: 'New Task',
        description: 'This is a new task',
        date: expect.any(String),
        taskList: taskList._id.toString(),
        completed: false
      }
    });
  });
});

describe('deleteTask', () => {
  test('deleteTask should delete the task successfully', async () => {
    const req = httpMocks.createRequest({
      params: { taskId: task._id }
    });

    await deleteTask(req, res);

    expect(res.statusCode).toBe(StatusCodes.OK);
    expect(res._getJSONData()).toEqual({
      message: 'Task deleted successfully'
    });

    const deletedTask = await Task.findById(task._id);
    expect(deletedTask).toBeNull();
  });
});

describe('createTask', () => {
  test('createTask should create a new task successfully', async () => {
    const req = httpMocks.createRequest({
      body: {
        title: 'New Task',
        description: 'This is a new task',
        date: new Date()
      }
    });

    await createTask(req, res);

    expect(res.statusCode).toBe(StatusCodes.CREATED);
    expect(res._getJSONData()).toEqual({
      message: 'Task created successfully'
    });

    const task = await Task.findOne({ title: 'New Task' });
    expect(task).toBeTruthy();
  });
});

describe('createTaskList', () => {
  test('createTaskList should create a new task list successfully', async () => {
    const req = httpMocks.createRequest({
      body: {
        name: 'New Task List',
        description: 'This is a new task list',
        date: new Date()
      }
    });

    await createTaskList(req, res);

    expect(res.statusCode).toBe(StatusCodes.CREATED);
    expect(res._getJSONData()).toEqual({
      message: 'Task list created successfully'
    });

    const taskList = await TaskList.findOne({ name: 'New Task List' });
    expect(taskList).toBeTruthy();
  });
});

describe('editTaskList', () => {
  test('editTaskList should update the task list successfully', async () => {
    const req = httpMocks.createRequest({
      body: {
        name: 'Updated Task List',
        description: 'This is an updated task list',
        date: new Date(),
        removeDate: false
      }
    });

    await editTaskList(req, res);

    expect(res.statusCode).toBe(StatusCodes.OK);
    expect(res._getJSONData()).toEqual({
      message: 'Task list edited successfully'
    });

    const updatedTaskList = await TaskList.findById(taskList._id);
    expect(updatedTaskList.name).toBe('Updated Task List');
    expect(updatedTaskList.description).toBe('This is an updated task list');
    expect(updatedTaskList.date).toEqual(expect.any(Date));
  });

  test('editTaskList should update only the name', async () => {
    const req = httpMocks.createRequest({
      body: {
        name: 'Updated Task List',
      },
    });

    await editTaskList(req, res);

    expect(res.statusCode).toBe(StatusCodes.OK);
    expect(res._getJSONData()).toEqual({
      message: 'Task list edited successfully',
    });

    const updatedTaskList = await TaskList.findById(taskList._id);
    expect(updatedTaskList.name).toBe('Updated Task List');
    expect(updatedTaskList.description).toBe('This is a new task list');
    expect(updatedTaskList.date).toEqual(expect.any(Date));
  });
});

describe('getTaskList', () => {
  test('getTaskList should return the task list successfully', async () => {
    const req = httpMocks.createRequest({
      params: { taskListId: taskList._id }
    });

    await getTaskList(req, res);

    expect(res.statusCode).toBe(StatusCodes.OK);
    expect(res._getJSONData()).toEqual({
      taskList: {
        __v: 0,
        _id: taskList._id.toString(),
        name: 'New Task List',
        description: 'This is a new task list',
        date: expect.any(String),
        owner: user._id.toString(),
        tasks: []
      }
    });
  });
});

describe('deleteTaskList', () => {
  test('deleteTaskList should delete the task list successfully', async () => {
    const req = httpMocks.createRequest({
      params: { taskListId: taskList._id }
    });

    await deleteTaskList(req, res);

    expect(res.statusCode).toBe(StatusCodes.OK);
    expect(res._getJSONData()).toEqual({
      message: 'Task list deleted successfully'
    });

    const deletedTaskList = await TaskList.findById(taskList._id);
    expect(deletedTaskList).toBeNull();
  });
});

describe('getTaskLists', () => {
  test('getTaskLists should return all the users task lists', async () => {
    const req = httpMocks.createRequest({
      params: { userId: user._id }
    });

    await getTaskLists(req, res);

    const taskLists = await TaskList.find({ owner: user._id });

    expect(res.statusCode).toBe(StatusCodes.OK);
    expect(res._getJSONData() == {taskLists});
  });
});
