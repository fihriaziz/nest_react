import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo)
    private readonly todoRepository: Repository<Todo>,
  ) {}

  async create(createTodoDto: CreateTodoDto): Promise<Todo> {
    const todo = this.todoRepository.create({
      title: createTodoDto.title,
      status: 'created',
      createdAt: new Date(),
    });
    return this.todoRepository.save(todo);
  }

  async findAll(search?: string): Promise<Todo[]> {
    if (search) {
      return this.todoRepository.find({
        where: {
          title: Like(`%${search}%`),
        },
      });
    }
    return this.todoRepository.find();
  }

  async update(id: number, updateTodoDto: UpdateTodoDto): Promise<Todo> {
    const todo = await this.todoRepository.findOne({ where: { id } });
    if (!todo) {
      throw new Error(`Todo with id ${id} not found`);
    }
    todo.status = updateTodoDto.status;
    return this.todoRepository.save(todo);
  }
}
