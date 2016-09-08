import { IItem, Tag, User, Comment } from '../shared';

export class FVideo implements IItem {
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
    comments: Comment[];
    description: string;
    selected: boolean;
}