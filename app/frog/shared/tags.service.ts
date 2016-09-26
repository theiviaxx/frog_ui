import {Injectable} from '@angular/core';
import {Http, Request, RequestMethod, Response, RequestOptions, Jsonp} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Subject } from 'rxjs/Subject';

import { Tag } from './models';

@Injectable()
export class TagsService {
    results: Observable<Tag[]>;
    tags: Subject<Tag[]>;
    private _observer: Observer<Tag[]>;
    private _tags: Tag[];
    private _ids: number[];
    
    constructor(private http:Http, private jsonp: Jsonp) {
        this._tags = [];
        this._ids = [];
        this.tags = new Subject<Tag[]>();
    }
    get() {
        this.http.get('/frog/tag?cache=' + Date.now())
            .map(this.extractData).subscribe(tags => {
                this._tags = tags;
                for (let tag of tags) {
                    this._ids.push(tag.id);
                }
                this.tags.next(this._tags);
            });
    }
    extractData(res: Response) {
        let body = res.json();
        
        return body.values || [];
    }
    getTagById(id: number) {
        let index = this._ids.indexOf(id);
        if (index !== -1) {
            return this._tags[index];
        }

        return null;
    }
    getTagByName(name: string) {
        for(let tag of this._tags) {
            if (tag.name == name) {
                return tag;
            }
        }

        return null;
    }
    create(name: string) {
        let url = '/frog/tag/';
        let options = new RequestOptions();
        options.body = {name: name};
        options.withCredentials = true;
        return this.http.post(url, options).map(this.extractData);
    }
}