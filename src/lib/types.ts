export interface Note {
  id: string;
  title: string;
  content: string;
  description: string;
  category: string;
  tags: string[];
  createdAt: string;
}

export type NoteInput = Omit<Note, 'id' | 'createdAt'>;

export interface Balance {
    id: number;
    plu: string;
    kg: number;
    date: string;
    updatedAt: string;
}
