import { Injectable } from '@angular/core';
import { Reference, StoreObject } from '@apollo/client';
import { Board, Task } from '@bison/shared/schema';
import { Apollo, gql } from 'apollo-angular';
import { IDeleteTaskUsecase } from './delete-task.usecase.interface';

@Injectable()
export class DeleteTaskUsecase implements IDeleteTaskUsecase {
  constructor(private apollo: Apollo) {}

  execute(
    ...args: Parameters<IDeleteTaskUsecase['execute']>
  ): ReturnType<IDeleteTaskUsecase['execute']> {
    const [input] = args;
    return this.apollo.mutate<{ deleteTask: Task }>({
      mutation: gql`
        mutation DeleteTask($input: DeleteTaskInput!) {
          deleteTask(input: $input) {
            id
          }
        }
      `,
      variables: {
        input,
      },
      update(cache) {
        const task = cache.readFragment<Task & StoreObject>({
          id: `Task:${input.id}`,
          fragment: gql`
            fragment Task on Task {
              id
              board {
                id
              }
            }
          `,
        });
        if (task == null) {
          return;
        }
        const board = cache.readFragment<Board & StoreObject>({
          id: `Board:${task.board.id}`,
          fragment: gql`
            fragment Board on Board {
              id
              tasks {
                id
              }
            }
          `,
        });
        if (board == null) {
          return;
        }
        cache.modify({
          id: cache.identify(board),
          fields: {
            tasks(taskRefs: Reference[], { readField }) {
              return taskRefs.filter(
                (ref) => readField('id', ref) !== input.id
              );
            },
          },
        });
      },
    });
  }
}