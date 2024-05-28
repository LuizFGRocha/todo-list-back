import { StatusCodes } from "http-status-codes";
import * as yup from 'yup';

// Essa função recebe um schema do Yup e retorna um middleware que valida o corpo da requisição
export const bodyValidation = (schema) => async (req, res, next) => {
  try {
      await schema.validate(req.body, { abortEarly: false });
      return next();
  } catch (err) {
      const yupError = err;

      const errors = {};
      yupError.inner.forEach(error => {
          if (!error.path) return;
          errors[error.path] = error.message;
      });
      return res.status(StatusCodes.BAD_REQUEST).json({ errors });
  }
};

// Esses são os schemas de validação que serão usados nos middlewares
export const loginSchema = yup.object().shape({
  username: yup.string().required(),
  password: yup.string().required()
});

export const signUpSchema = yup.object().shape({
  username: yup.string().required().max(20),
  email: yup.string().email().required(),
  password: yup.string().required().min(6).max(20),
});

export const taskListSchema = yup.object().shape({
  name: yup.string().required().max(50),
  description: yup.string().max(200),
  date: yup.date()
});

export const taskListEditSchema = yup.object().shape({
  name: yup.string().max(50),
  description: yup.string().max(200),
  date: yup.date(),
  removeDate: yup.boolean()
});

export const taskSchema = yup.object().shape({
  title: yup.string().required().max(50),
  description: yup.string().max(200),
  date: yup.date(),
  completed: yup.boolean()
});

export const taskEditSchema = yup.object().shape({
  title: yup.string().min(1).max(50),
  description: yup.string().max(200),
  date: yup.date(),
  completed: yup.boolean(),
  removeDate: yup.boolean()
});
