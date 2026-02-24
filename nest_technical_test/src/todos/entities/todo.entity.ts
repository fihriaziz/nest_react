import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Todo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  status: 'created' | 'completed' | 'on_going' | 'problem';

  @Column()
  createdAt: Date;
}
