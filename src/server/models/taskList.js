import mongoose from 'mongoose';

const TaskListSchema = new mongoose.Schema({
  name: {type: String, required: true}, // Nome da lista de tarefas
  description: {type: String, default: ''}, // Descrição da lista de tarefas
  tasks: {type: [mongoose.Schema.Types.ObjectID], default: [], required: true, ref: 'Task'}, // Tarefas da lista
  date: {type: Date, required: false}, // Data limite para a conclusão da lista
  owner: {type: mongoose.Schema.Types.ObjectID, required: true, ref: 'User'}, // Dono da lista
});

export const TaskList = mongoose.model('TaskList', TaskListSchema);