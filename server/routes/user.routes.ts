import express, { Request, Response } from 'express';
import User, { IUser } from '../models/user.model';

const router = express.Router();

// Define routes for user operations
router.post('/', async (req: Request, res: Response) => {
  try {
    const newUser: IUser = new User(req.body);
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Add more routes for other CRUD operations as needed
// const newUser = new User({
//   email: {
//       address: 'user@example.com',
//       verified: true
//   },
//   password: 'password123',
//   name: 'John Doe',
//   // ... other fields ...
// });

export default router;
