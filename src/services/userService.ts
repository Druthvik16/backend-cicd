import { v4 as uuidv4 } from 'uuid';
import pool from '../config/database';
import { User, CreateUserDTO, UpdateUserDTO } from '../types';

export class UserService {

  async getAllUsers(): Promise<User[]> {
    const [rows] = await pool.execute(
      'SELECT * FROM users ORDER BY created_at DESC'
    );
    return rows as User[];
  }

  async getUserById(id: string): Promise<User | null> {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE id = ?',
      [id]
    );
    const users = rows as User[];
    return users.length > 0 ? users[0] : null;
  }

  async createUser(dto: CreateUserDTO): Promise<User> {
    const id = uuidv4();
    await pool.execute(
      'INSERT INTO users (id, name, email, phone) VALUES (?, ?, ?, ?)',
      [id, dto.name, dto.email, dto.phone]
    );
    const user = await this.getUserById(id);
    return user!;
  }

  async updateUser(id: string, dto: UpdateUserDTO): Promise<User | null> {
    const existing = await this.getUserById(id);
    if (!existing) return null;

    const fields: string[] = [];
    const values: any[] = [];

    if (dto.name !== undefined) { fields.push('name = ?'); values.push(dto.name); }
    if (dto.email !== undefined) { fields.push('email = ?'); values.push(dto.email); }
    if (dto.phone !== undefined) { fields.push('phone = ?'); values.push(dto.phone); }

    if (fields.length === 0) return existing;

    values.push(id);
    await pool.execute(
      `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
      values
    );

    return await this.getUserById(id);
  }

  async deleteUser(id: string): Promise<boolean> {
    const existing = await this.getUserById(id);
    if (!existing) return false;

    await pool.execute('DELETE FROM users WHERE id = ?', [id]);
    return true;
  }
}

export default new UserService();