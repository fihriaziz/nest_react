import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
export declare class TodosController {
    private readonly todosService;
    constructor(todosService: TodosService);
    create(createTodoDto: CreateTodoDto): Promise<import("./entities/todo.entity").Todo>;
    findAll(search?: string): Promise<import("./entities/todo.entity").Todo[]>;
    update(id: string, updateTodoDto: UpdateTodoDto): Promise<import("./entities/todo.entity").Todo>;
}
