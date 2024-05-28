import { StatusCodes } from "http-status-codes";
import { TaskList } from "../models/taskList.js";	
import { Task } from "../models/task.js";
import { User } from "../models/user.js";

// Controllers para o CRUD das task lists e tasks

const createTaskList = async (req, res) => {
  try {
    const taskList = new TaskList({
      name: req.body.name,
      owner: res.locals.user._id,
    });
    if (req.body.description) {
      taskList.description = req.body.description;
    }
    if (req.body.date) {
      taskList.date = req.body.date;
    }
    res.locals.user.taskLists.push(taskList._id);
    await taskList.save();
    await res.locals.user.save();
    return res.status(StatusCodes.CREATED).json({
      message: "Task list created successfully",
    });
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      err,
    });
  }
}

const editTaskList = async (req, res) => {
  try {
    if (req.body.name !== undefined) {
      res.locals.taskList.name = req.body.name;
    }
    if (req.body.description !== undefined) {
      res.locals.taskList.description = req.body.description;
    }
    if (req.body.date !== undefined) {
      res.locals.taskList.date = req.body.date;
    }
    if (req.body.removeDate !== undefined && req.body.removeDate === true) {
      res.locals.taskList.date = undefined;
    }
    await res.locals.taskList.save();
    return res.status(StatusCodes.OK).json({
      message: "Task list edited successfully"
    });
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      err
    });
  }
}

const getTaskList = async (req, res) => {
  const populatedTaskList = await res.locals.taskList.populate({ path: "tasks", select: '-owner' });
  return res.status(StatusCodes.OK).json({
    taskList: populatedTaskList
  });
}

const deleteTaskList = async (req, res) => {
  try {
    await Task.deleteMany({ taskList: res.locals.taskList._id });
    await TaskList.deleteOne({ _id: res.locals.taskList._id });
    res.locals.user.taskLists = res.locals.user.taskLists.filter(taskListId => taskListId !== res.locals.taskList._id);
    return res.status(StatusCodes.OK).json({
      message: "Task list deleted successfully"
    });
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      err
    });
  }
}

const createTask = async (req, res) => {
  try {
    const task = new Task({
      title: req.body.title,
      description: req.body.description,
      date: req.params.date,
      taskList: res.locals.taskList._id
    });
    await task.save();

    res.locals.taskList.tasks.push(task._id);
    await res.locals.taskList.save();

    return res.status(StatusCodes.CREATED).json({
      message: "Task created successfully"
    });
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      err
    });
  }
}

const editTask = async (req, res) => {
  try {
    if (req.body.title !== undefined) {
      res.locals.task.title = req.body.title;
    }
    if (req.body.description !== undefined) {
      res.locals.task.description = req.body.description;
    }
    if (req.body.date !== undefined) {
      res.locals.task.date = req.body.date;
    }
    if (req.body.completed !== undefined) {
      res.locals.task.completed = req.body.completed;
    }
    if (req.body.removeDate !== undefined && req.body.removeDate === true) {
      res.locals.task.date = undefined;
    }
    await res.locals.task.save();
    return res.status(StatusCodes.OK).json({
      message: "Task edited successfully"
    });
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      err
    });
  }
}

const getTask = async (req, res) => {
  return res.status(StatusCodes.OK).json({
    task: res.locals.task
  });
}

const deleteTask = async (req, res) => {
  try {
    await Task.deleteOne({ _id: res.locals.task._id });
    res.locals.taskList.tasks = res.locals.taskList.tasks.filter(taskId => taskId !== res.locals.task._id);
    await res.locals.taskList.save();
    return res.status(StatusCodes.OK).json({
      message: "Task deleted successfully"
    });
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      err
    });
  }
}

const getTaskLists = async (req, res) => {
  const { taskLists } = await res.locals.user.populate({ path: "taskLists", populate: { path: "tasks" }, select: '-owner'});

  return res.status(StatusCodes.OK).json({
    taskLists
  });
}

export {
  createTaskList,
  editTaskList,
  getTaskList,
  createTask,
  deleteTaskList,
  editTask,
  getTask,
  deleteTask,
  getTaskLists
}