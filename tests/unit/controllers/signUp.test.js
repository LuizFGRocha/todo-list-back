import bcrypt from "bcryptjs";
import { initializeDatabase } from "../../dbHandler";
import { User } from "../../../src/server/models/user";
import httpMocks from "node-mocks-http";
import { StatusCodes } from "http-status-codes";
import { signUp } from "../../../src/server/controllers/signUp";

let dbHandler;

beforeAll(async () => {
  dbHandler = await initializeDatabase();
  dbHandler.connect();
});

afterEach(async () => await dbHandler.clearDatabase());

afterAll(async () => await dbHandler.closeDatabase());

describe("Credentials validation", () => {
  const userInfo = {
    username: "abcd1234",
    email: "johndoe@gmail.com",
    password: "567890",
  };

  test("Trying to signUp with correct fields", async () => {
    const request = httpMocks.createRequest({
      body: {
        username: "abcd1234",
        email: "johndoe@gmail.com",
        password: "567890",
      },
    });

    const response = httpMocks.createResponse();

    await signUp(request, response);

    const data = response._getJSONData();

    expect(await User.findOne({ username: "abcd1234" })).not.toBeNull();
    const password = (await User.findOne({ username: "abcd1234" })).password;
    expect(bcrypt.compareSync("567890", password)).toBe(true);
    expect(data.message).toEqual("Signup successful");
    expect(response.statusCode).toBe(StatusCodes.CREATED);
  });
});
