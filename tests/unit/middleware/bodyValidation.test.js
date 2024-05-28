import { 
  bodyValidation, 
  loginSchema, 
  signUpSchema, 
  taskListSchema, 
  taskListEditSchema, 
  taskSchema, 
  taskEditSchema 
} from '../../../src/server/middleware/bodyValidation';
import { StatusCodes } from 'http-status-codes';

describe('bodyValidation middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
  });

  test('should call next if validation passes', async () => {
    req.body = { username: 'test', password: 'password' };
    await bodyValidation(loginSchema)(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  test('should return 400 status code and validation errors if validation fails', async () => {
    req.body = { username: 'test' };
    await bodyValidation(loginSchema)(req, res, next);
    expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
    expect(res.json).toHaveBeenCalledWith({ errors: { password: 'password is a required field' } });
  });
});

describe('loginSchema', () => {
  test('should validate the username and password fields', async () => {
    const validData = { username: 'test', password: 'password' };
    const invalidData = { username: '', password: '' };

    await expect(loginSchema.validate(validData)).resolves.toBeTruthy();
    await expect(loginSchema.validate(invalidData)).rejects.toThrow();
  });
});

describe('signUpSchema', () => {
  test('should validate the username, email, and password fields', async () => {
    const validData = { username: 'test', email: 'test@example.com', password: 'password' };
    const invalidData = { username: '', email: 'invalid', password: '' };

    await expect(signUpSchema.validate(validData)).resolves.toBeTruthy();
    await expect(signUpSchema.validate(invalidData)).rejects.toThrow();
  });
});

describe('taskListSchema', () => {
  test('should validate the name, description, and date fields', async () => {
    const validData = { name: 'Test Task List', description: 'This is a test task list', date: '2022-01-01' };
    const invalidData = { name: '', description: 'This is a test task list', date: '2022-01-01' };
    await expect(taskListSchema.validate(validData)).resolves.toBeTruthy();
    await expect(taskListSchema.validate(invalidData)).rejects.toThrow();
  });
});

describe('taskListEditSchema', () => {
  test('should validate the name, description, date, and removeDate fields', async () => {
    const validData = { name: 'Updated Task List', description: 'This is an updated task list', date: '2022-02-01', removeDate: true };
    const invalidData = { name: '', description: 'This is an updated task list', date: '2022-02-01', removeDate: true };
    await expect(taskListEditSchema.validate(validData)).resolves.toBeTruthy();
    await expect(taskListEditSchema.validate(invalidData)).rejects.toThrow();
  });
});

describe('taskSchema', () => {
  test('should validate the title, description, date, and completed fields', async () => {
    const validData = { title: 'Test Task', description: 'This is a test task', date: '2022-01-01', completed: false };
    const invalidData = { title: '', description: 'This is a test task', date: '2022-01-01', completed: false };
    await expect(taskSchema.validate(validData)).resolves.toBeTruthy();
    await expect(taskSchema.validate(invalidData)).rejects.toThrow();
  });
});

describe('taskEditSchema', () => {
  test('should validate the title, description, date, completed, and removeDate fields', async () => {
    const validData = { title: 'Updated Task', description: 'This is an updated task', date: '2022-02-01', completed: true, removeDate: false };
    const invalidData = { title: '', description: 'This is an updated task', date: '2022-02-01', completed: true, removeDate: false };
    await expect(taskEditSchema.validate(validData)).resolves.toBeTruthy();
    await expect(taskEditSchema.validate(invalidData)).rejects.toThrow();
  });
});