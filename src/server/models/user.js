import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: {type: String, required: true, unique: true}, // Nome de usuário
  email: {type: String, required: true, unique: true}, // Email
  password: {type: String, required: true}, // Senha
  profilePicturePath: {type: String, default: 'default.jpg', required: true}, // Caminho da foto de perfil
});

export const User = mongoose.model('User', UserSchema);