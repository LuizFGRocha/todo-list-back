import { StatusCodes } from "http-status-codes";
import { TaskList } from "../models/taskList.js";	
import { Task } from "../models/task.js";

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
    await taskList.save();
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
    if (req.body.name) {
      res.locals.taskList.name = req.body.name;
    }
    if (req.body.description) {
      res.locals.taskList.description = req.body.description;
    }
    if (req.body.date) {
      res.locals.taskList.date = req.body.date;
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
  // @todo fazer o negócio não retornar o owner
  const populatedTaskList = await res.locals.taskList.populate({ path: "tasks", select: '-owner' });
  return res.status(StatusCodes.OK).json({
    taskList: populatedTaskList
  });
}

const deleteTaskList = async (req, res) => {
  try {
    await Task.deleteMany({ taskList: res.locals.taskList._id });
    await TaskList.deleteOne({ _id: res.locals.taskList._id });
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
    if (req.body.title) {
      res.locals.task.title = req.body.title;
    }
    if (req.body.description) {
      res.locals.task.description = req.body.description;
    }
    if (req.body.date) {
      res.locals.task.date = req.body.date;
    }
    if (req.body.completed) {
      res.locals.task.completed = req.body.completed;
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
  const taskLists = await TaskList.aggregate([
    { $match: { owner: res.locals.user._id } },
    { $lookup: { from: "tasks", localField: "tasks", foreignField: "_id", as: "tasks" } },
    { $project: { owner: 0 } },
    { $sort: { date: 1 } }
  ]);
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