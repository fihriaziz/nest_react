import { IsString, MinLength, MaxLength } from 'class-validator';

export class CreateTodoDto {
  @IsString({ message: 'Title harus berupa string' })
  @MinLength(3, { message: 'Title minimal 3 karakter' })
  @MaxLength(50, { message: 'Title maksimal 50 karakter' })
  title: string;
}
