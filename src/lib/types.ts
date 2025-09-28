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

export interface Access {
  id: string;
  link: string;
  username: string;
  password: string;
  createdAt: string;
}

export type AccessInput = Omit<Access, 'id' | 'createdAt'>;

    