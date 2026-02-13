const { User } = require("../models");

// Получить всех пользователей (только для ADMIN)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password"] },
    });
    res.json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching users", error: error.message });
  }
};

// Получить свой профиль
exports.getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
    });
    res.json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching profile", error: error.message });
  }
};

// Обновить свой профиль
exports.updateMe = async (req, res) => {
  try {
    const { username, email } = req.body;

    const user = await User.findByPk(req.user.id);

    if (username) user.username = username;
    if (email) user.email = email;

    await user.save();

    const updatedUser = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
    });

    res.json(updatedUser);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating profile", error: error.message });
  }
};

// Удалить свой профиль
exports.deleteMe = async (req, res) => {
  try {
    await User.destroy({ where: { id: req.user.id } });
    res.status(200).json({ message: "Profile deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting profile", error: error.message });
  }
};

// Подключиться к менеджеру по коду
exports.assignManagerCode = async (req, res) => {
  try {
    const { id } = req.params;
    const { assigned_manager_code } = req.body;

    // Проверка что пользователь обновляет себя
    if (parseInt(id) !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You can only update your own profile" });
    }

    // Проверка что пользователь имеет роль USER
    if (req.user.role !== "USER") {
      return res
        .status(400)
        .json({ message: "Only USER role can assign manager code" });
    }

    // Поиск менеджера по коду
    const manager = await User.findOne({
      where: {
        managerCode: assigned_manager_code,
        role: "MANAGER",
      },
    });

    if (!manager) {
      return res
        .status(404)
        .json({ message: "Manager with this code not found" });
    }

    // Обновление пользователя
    const user = await User.findByPk(id);
    user.assignedManagerCode = assigned_manager_code;
    await user.save();

    const updatedUser = await User.findByPk(id, {
      attributes: { exclude: ["password"] },
    });

    res.json({
      message: "Successfully connected to manager",
      user: updatedUser,
      manager: {
        id: manager.id,
        username: manager.username,
        managerCode: manager.managerCode,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error assigning manager code", error: error.message });
  }
};

// Получить своих пользователей (для MANAGER)
exports.getMyUsers = async (req, res) => {
  try {
    // Проверка что пользователь является менеджером
    if (req.user.role !== "MANAGER") {
      return res
        .status(403)
        .json({ message: "Only MANAGER can view assigned users" });
    }

    const users = await User.findAll({
      where: {
        assignedManagerCode: req.user.managerCode,
        role: "USER",
      },
      attributes: { exclude: ["password"] },
      order: [["createdAt", "DESC"]],
    });

    res.json({
      managerCode: req.user.managerCode,
      totalUsers: users.length,
      users: users,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching users", error: error.message });
  }
};
