const request = require('supertest');
const mongoose = require('mongoose');
const userModel = require('../models/user');
const app = require('../app');
const config = require('config');
const configDb = config.get("database");

beforeAll(() => {
  const dbURI = `mongodb+srv://${configDb.username}:${configDb.password}@cluster0.qe3tq.mongodb.net/${configDb.database}`;
  mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
});

afterEach(async () => {
  return await userModel.deleteMany();

});

describe('User Registeration', () => {

  const validUser = {

    email: 'user1@mail.com',
    password: 'password4P',
  };
  const postUser = (user = validUser) => {
    return request(app).post('/signup').send(user);
  };

  const loginUser = (user = validUser) => {
    return request(app).post('/login').send(user);
  };

  it('return 200 satatus code when user successfuly registerd', async () => {
    const response = await postUser();

    expect(response.status).toBe(200);
  });

  it('Save User to DataBase', async () => {
    await postUser();
    const user = await userModel.findOne({
      email: validUser.email
    });

    expect(user.email).toBe(validUser.email);
  });

  it('return 400 status if email is null', async () => {
    const response = await postUser({

      email: null,
      password: 'password4P',
    });

    expect((await response).status).toBe(400);
  });

  it('return validation error object for invalid user', async () => {
    const response = await postUser({

      email: null,
      password: 'password4P',
    });
    const body = response.body;
    expect(body.validationErrors).not.toBeUndefined();
  });

  //     it('return email cannot be null if email is null',async()=>{

  //   const response = await postUser(
  //     {

  //       email: null,
  //       password: 'p4ssowrd',
  //     }
  //   )

  //   const body = response.body;
  //   expect(body.validationErrors.email).toBe("email cannot be null");

  // });


  //     it('return password cannot be null if passowrd is null',async()=>{

  //   const response = await postUser(
  //     {

  //       email: 'user1@mail.com',
  //       password: null,
  //     }
  //   )

  //   const body = response.body;
  //   expect(body.validationErrors.password).toBe("password cannot be null");

  // });

  it('Check if User Password is hashed in database', async () => {
    await postUser();
    const user = await userModel.findOne();

    expect(user.password).not.toBe('password');
  });

  it.each `
    field         | value              | expectedMessage
    ${'email'}    | ${null}            | ${'email cannot be null'}
    ${'email'}    | ${'email.com'}     | ${'email is not valid'}
    ${'email'}    | ${'@.com'}         | ${'email is not valid'}
    ${'email'}    | ${'user.mail.com'} | ${'email is not valid'}
    ${'email'}    | ${'user@mail'}     | ${'email is not valid'}
    ${'password'} | ${null}            | ${'password cannot be null'}
    ${'password'} | ${'pas'}           | ${'password must be atleast 6 character'}
  `('return $expectedMessage if $field is $value', async ({
    field,
    expectedMessage,
    value
  }) => {
    const user = {
      email: 'user1@mail.com',
      password: 'password',

    };

    user[field] = value;

    const response = await postUser(user);

    const body = response.body;
    expect(body.validationErrors[field]).toBe(expectedMessage);
  });

  it('return e-mail in use if email is used', async () => {


    await postUser();

    const response = await postUser();

    const body = response.body;
    expect(body.validationErrors.email).toBe('e-mail in use');
  });

});

describe('User login', () => {

  const validUser = {

    email: 'user1@mail.com',
    password: 'password4P',

  };
  const postUser = (user = validUser) => {
    return request(app).post('/signup').send(user);
  };

  const loginUser = (user = validUser) => {
    return request(app).post('/login').send(user);
  };

  it('return incorrect email if email is not registerd', async () => {

    //signup first
    await postUser();

    //login
    const response = await loginUser({

      email: null,
      password: 'password4P',

    })
    const body = response.body;
    expect(body.validationErrors.email).toBe("incorrect email");
  });

  // it('return incorrect password if email is not registerd',async()=>{

  //   //signup first
  //   await postUser();

  //   //login
  //   const response = await loginUser(
  //     {

  //       email: 'user1@mail.com',
  //       password: 'password4',

  //     }
  //   )
  //   const body = response.body;
  //   expect(body.validationErrors.password).toBe("incorrect password");
  // });


  // it('return 200 satatus code when user successfuly logged in', async () => {
  //    await postUser();
  //    const response = await loginUser(
  //     {

  //       email: 'user1@mail.com',
  //       password: 'password4P',

  //     }
  //   )
  //   expect(response.status).toBe(200);
  // });
});