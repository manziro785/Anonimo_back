const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const bcrypt = require("bcryptjs");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("USER", "MANAGER", "ADMIN"),
      defaultValue: "USER",
      allowNull: false,
    },
    managerCode: {
      type: DataTypes.STRING(6),
      allowNull: true,
      unique: true,
    },
    assignedManagerCode: {
      type: DataTypes.STRING(6),
      allowNull: true,
    },
  },
  {
    timestamps: true,
    tableName: "users",
    hooks: {
      beforeCreate: async (user) => {
        // Хэширование пароля
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }

        // Генерация username для USER
        if (user.role === "USER" && !user.username) {
          user.username = `anonimus_${Math.floor(10000000 + Math.random() * 90000000)}`;
        }

        // Генерация managerCode для MANAGER
        if (user.role === "MANAGER" && !user.managerCode) {
          user.managerCode = generateManagerCode();
        }
      },
    },
  },
);

// Метод для проверки пароля
User.prototype.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Генерация 6-значного кода менеджера
function generateManagerCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

module.exports = User;
