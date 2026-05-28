import { Request, Response, NextFunction } from 'express';
import userService from '../services/userService';
import { ApiResponse, User } from '../types';

export class UserController {

  async getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const users = await userService.getAllUsers();
      const response: ApiResponse<User[]> = {
        success: true,
        message: 'Users fetched successfully',
        data: users
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id  = req.params.id as string;
      const user = await userService.getUserById(id);
      if (!user) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
      }
      res.status(200).json({ success: true, message: 'User fetched', data: user });
    } catch (error) {
      next(error);
    }
  }

  async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, email, phone } = req.body;
      if (!name || !email || !phone) {
        res.status(400).json({ success: false, message: 'name, email and phone are required' });
        return;
      }
      const user = await userService.createUser({ name, email, phone });
      res.status(201).json({ success: true, message: 'User created', data: user });
    } catch (error: unknown) {
      const err = error as { code?: string };
      if (err.code === 'ER_DUP_ENTRY') {
        res.status(409).json({ success: false, message: 'Email already exists' });
        return;
      }
      next(error);
    }
  }

  async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id  = req.params.id as string;
      const user = await userService.updateUser(id, req.body);
      if (!user) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
      }
      res.status(200).json({ success: true, message: 'User updated', data: user });
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id  = req.params.id as string;
      const deleted = await userService.deleteUser(id);
      if (!deleted) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
      }
      res.status(200).json({ success: true, message: 'User deleted' });
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();