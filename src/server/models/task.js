import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
  title: {type: String, required: true}, // Título da tarefa
  description: {type: String, default: ''}, // Descrição da tarefa
  date: {type: Date, required: false}, // Data limite para a conclusão da tarefa
  completed: {type: Boolean, default: false}, // Tarefa concluída
  taskList: {type: mongoose.Schema.Types.ObjectID, required: true, ref: 'TaskList'}, // Lista à qual a tarefa pertence
});

export const Task = mongoose.model('Task', TaskSchema);