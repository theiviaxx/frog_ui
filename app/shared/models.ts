
export class User {
    public id: number;
    public name: string;
    public email: string;
    public username: string;
}

export class Comment {
    public id: number;
    public date: Date;
    public comment: string;
    public user: User;
}

export class Tag {
    public id: number;
    public name: string;
    public artist: boolean;
    public type: string;

    constructor(id: number, name: string, artist: boolean) {
        this.id = id;
        this.name = name;
        this.artist = artist;
        this.type = (this.id === 0) ? 'search' : 'tag';
    }
}

export interface IItem {
    hash: string;
    tags: Tag[];
    deleted: boolean;
    image: string;
    height: number;
    guid: string;
    id: number;
    title: string;
    author: User;
    modified: Date;
    created: Date;
    width: number;
    comment_count: number;
    source: string;
    small: string;
    thumbnail: string;
    comments?: Comment[];
    description: string;
    selected: boolean;
}
