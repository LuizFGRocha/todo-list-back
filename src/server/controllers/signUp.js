import { StatusCodes } from "http-status-codes";
import { User } from "../models/user.js";
import bcrypt from "bcryptjs";
import { TaskList } from "../models/taskList.js";
import { Task } from "../models/task.js";

const criarTaskListTutorial = async (user) => {
  const tutorialTaskList = new TaskList({
    name: "Bem vindo ao To Do List!",
    description: "Essa é a sua primeira task list. Você pode criar quantas quiser!",
    owner: user._id,
  });
  const task1 = new Task({
    title: "Clique no botão no canto inferior direito da tela inicial para criar uma tarefa!",
    taskList: tutorialTaskList._id,
  });
  const task2 = new Task({
    title: "Clique no indicador de conclusão ao lado para alterar o status da tarefa!",
    taskList: tutorialTaskList._id,
  });
  const task3 = new Task({
    title: "Clique na lixeira para deletar a task list!",
    taskList: tutorialTaskList._id,
  });
  const task4 = new Task({
    title: "Clique no lápis para editar a task list!",
    taskList: tutorialTaskList._id,
  });
  const task5 = new Task({
    title: "Todos os campos são editáveis, e você pode marcar a task como concluída!",
    taskList: tutorialTaskList._id,
  });
  const task6 = new Task({
    title: "No modo de edição, clique na lixeira ao lado para deletar a task!",
    taskList: tutorialTaskList._id,
  });
  const task7 = new Task({
    title: "No modo de edição, clique em 'Salvar' para salvar as alterações!",
    taskList: tutorialTaskList._id,
  });
  const task8 = new Task({
    title: 'Clique no "+" abaixo para criar uma task!',
    taskList: tutorialTaskList._id,
  });
  tutorialTaskList.tasks.push(task1, task2, task3, task4, task5, task6, task7, task8);
  user.taskLists.push(tutorialTaskList);
  await tutorialTaskList.save();
  task1.save(); task2.save(); task3.save(); task4.save(); task5.save(); task6.save(); task7.save(); task8.save();
}

export const signUp = async (req, res) => {
  try {
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password),
    });
    await criarTaskListTutorial(user);
    await user.save();
    return res.status(StatusCodes.CREATED).json({
      message: "Signup successful",
    });
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err });
  }
};
