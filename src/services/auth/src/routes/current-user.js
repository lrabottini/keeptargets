import express from 'express';
import { curretUser } from '../middleware/current-user.js';

const router = express.Router();

router.get('/api/v1/auth/currentuser', curretUser, (req, res) => {
  res.send({currentUser: req.currentUser || null})
});

export { router as currentUserRouter };
