import { BookRepository } from './book';
import type { BookRepositoryInterface } from './book';

export const BOOK = Symbol('book');

export interface Repositories {
  [BOOK]: BookRepositoryInterface;
}

export default {
  [BOOK]: new BookRepository()
} as Repositories;
