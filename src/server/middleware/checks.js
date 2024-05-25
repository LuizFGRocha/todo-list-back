import { User } from '../models/user.js';
import { Task } from '../models/task.js';
import { TaskList } from '../models/taskList.js';
import { StatusCodes } from "http-status-codes";

// Funções de checagem de disponibilidade de email e username

const checkDuplicateEmail = async (req, res, next) => {
  try {
    const user = await User.findOne({email: req.body.email});
    if (user) {
      return res.status(StatusCodes.BAD_REQUEST).json({message: 'Email already in use'});
    }
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({err});
  }
  next();
}

const checkDuplicateUsername = async (req, res, next) => {
  try {
    const user = await User.findOne({username: req.body.username});
    if (user) {
      return res.status(StatusCodes.BAD_REQUEST).json({message: 'Username already in use'});
    }
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({err});
  }
  next();
}

// Funções de checagem de parâmetros

const checkParamUserId = async (req, res, next) => {
  try {
    const user = await User.findOne({_id: req.params.userId});
    if (!user) {
      return res.status(StatusCodes.BAD_REQUEST).json({message: 'User not found'});
    }
    res.locals.user = user;
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({err});
  }
  next();
}

const checkParamTaskListId = async (req, res, next) => {
  try {
    const taskList = await TaskList.findOne({ _id: req.params.taskListId });
    if (!taskList) {
      return res.status(StatusCodes.BAD_REQUEST).json({message: 'Task list not found'});
    }
    res.locals.taskList = taskList;
    res.locals.user = await User.findOne({ _id: taskList.owner });
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({err});
  }
  next();
}

const checkParamTaskId = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.taskId });
    if (!task) {
      return res.status(StatusCodes.BAD_REQUEST).json({message: 'Task not found'});
    }
    res.locals.task = task;
    res.locals.taskList = await TaskList.findOne({ _id: task.taskList });
    res.locals.user = await User.findOne({ _id: res.locals.taskList.owner });
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({err});
  }
  next();
}

export const checks = { 
  checkDuplicateEmail, 
  checkDuplicateUsername,
  checkParamUserId,
  checkParamTaskListId,
  checkParamTaskId
};