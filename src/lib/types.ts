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
    kg: number | null;
    date: string;
    updatedAt: string;
}

export interface Price {
    id: number;
    plu: string;
    price: number | null;
    updatedAt: string;
}
