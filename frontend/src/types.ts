// Tipos principales

export interface User {
    name: string;
}

export interface Board {
    id: string;
    name: string;
    notes: Note[];
    users: User[];
}

export interface Note {
    id: string;
    title: string;
    content: string;
    x: number;
    y: number;
    updatedBy: string;
    comments: Comment[];
    timestamp: number;
}

export interface Comment {
    id: string;
    user: string;
    text: string;
    timestamp: number;
}

// Tipos para los payload de eventos

export type UserJoinPayload = User;
export type BoardLoadPayload = { notes: Note[] };

export type NoteCreatePayload = Omit<Note, 'id' | 'timestamp' | 'comments'>;
export type NoteUpdatePayload = Partial<Omit<Note, 'timestamp' | 'comments' | 'updatedBy'>>;
export type NoteDeletePayload = Pick<Note, 'id'>;

export type NoteCreatedPayload = Note;
export type NoteUpdatedPayload = Note;
export type NoteDeletedPayload = Pick<Note, 'id'>;

export interface NoteCommentPayload {
    noteId: string;
    text: string;
}

export interface NoteCommentedPayload {
    noteId: string;
    comment: Comment;
}

export interface ServerErrorPayload {
    message: string;
}
