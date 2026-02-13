const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authMiddleware, roleMiddleware } = require("../middleware/auth");

// Получить всех пользователей (только ADMIN)
router.get(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN"),
  userController.getAllUsers,
);

// Получить свой профиль
router.get("/me", authMiddleware, userController.getMe);

// Получить своих пользователей (только MANAGER)
router.get(
  "/my-users",
  authMiddleware,
  roleMiddleware("MANAGER"),
  userController.getMyUsers,
);

// Обновить свой профиль
router.put("/me", authMiddleware, userController.updateMe);

// Назначить код менеджера (для USER)
router.put(
  "/:id/assigned_manager_code",
  authMiddleware,
  userController.assignManagerCode,
);

// Удалить свой профиль
router.delete("/me", authMiddleware, userController.deleteMe);

module.exports = router;
