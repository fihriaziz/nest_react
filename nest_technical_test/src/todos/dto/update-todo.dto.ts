import { IsEnum } from 'class-validator';

export class UpdateTodoDto {
  @IsEnum(['created', 'completed', 'on_going', 'problem'], {
    message: 'Status harus salah satu dari: created, completed, on_going, problem'
  })
  status: 'created' | 'completed' | 'on_going' | 'problem';
}
