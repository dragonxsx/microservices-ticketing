import express from 'express';
import jwt from 'jsonwebtoken';

import { currentUser } from '../middlewares/current-user';

const router = express.Router();

router.get('/api/users/currentUser', currentUser, async (req, res) => {
    res.send({currentUser: req.currentUser} || null);
});

export {router as currentUserRouter};