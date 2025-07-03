import express from "express";
import { addUser, loginUser, checkUserToken, getUsers, getUserById } from "./userController";

const router = express.Router();

router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.post('/users', addUser);
router.post('/login', loginUser);
router.post('/check-token', checkUserToken);
// router.put('/users',);
// router.delete('/users',);

export default router;