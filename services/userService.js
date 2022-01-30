const userEntity = require("../models/user");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const saveUser = async (user) => {
  const hashedPassword = await bcrypt.hash(user.password, 10);

  user = {
    ...user,
    password: hashedPassword,
    emailToken: crypto.randomBytes(64).toString("hex"),
    isVerified: false,
  };

  return await userEntity.create(user);
};
const updateUser = async (user) => {
  return await userEntity.updateOne({
    _id: user._id,
  }, {
    emailToken: user.emailToken,
    isVerified: user.isVerified,
  });
};
const findByEmail = async (email) => {
  if (!email) {
    throw Error("incorrect email");
  }
  const user = await userEntity.findOne({
    email: email,
  });
  return user;
};

const findById = async (id) => {
  if (!id) {
    throw Error("incorrect id");
  }
  const user = await userEntity.findOne({
    _id: id
  });
  return user;
};

const findByToken = async (token) => {
  const user = await userEntity.findOne({
    emailToken: token,
  });
  return user;
};
const login = async (user) => {
  if (!user) {
    throw Error("incorrect email");
  } else if (!user.email) {
    throw Error("incorrect email");
  }
  const savedUser = await userEntity.findOne({
    email: user.email,
  });

  if (savedUser) {
    const auth = await bcrypt.compare(user.password, savedUser.password);

    if (auth) {
      return savedUser;
    }
    throw Error("incorrect password");
  } else {
    throw Error("incorrect email");
  }
};

module.exports = {
  saveUser,
  login,
  findByEmail,
  findByToken,
  updateUser,
  findById
};