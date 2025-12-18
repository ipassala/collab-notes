import { v4 as uuid } from "uuid";

export function createNote({ title = "", content = "", x = 100, y = 100, user }) {
    return {
        id: uuid(),
        title,
        content,
        x,
        y,
        zIndex: 1,
        updatedBy: user,
        editing: null,
        comments: [],
        timestamp: Date.now()
    };
}

export function createComment({ user, text }) {
    return {
        id: uuid(),
        user,
        text,
        timestamp: Date.now()
    };
}