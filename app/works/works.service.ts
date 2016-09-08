import { Injectable } from '@angular/core';
import { Http, Request, RequestMethod, Response, RequestOptions, URLSearchParams } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import { IItem, Tag, User } from '../shared';

export class Gallery {
    items: IItem[]
}


@Injectable()
export class WorksService {
    public results: Observable<IItem[]>;
    private _observer: Observer<IItem[]>;
    private _items: IItem[];
    private _guids: string[];
    private _id: number;
    private _requested: number;
    public selection: IItem[];
    public focusItem: IItem;
    public _terms: any[][];
    public loading: boolean;
    
    constructor(public http:Http) {
        this._items = [];
        this._guids = [];
        this._terms = [[]];
        this._id = 0;
        this.loading = false;
        this.results = Observable.create(observer => {
            this._observer = observer
        });
    }
    get(id:number=0, append:boolean=false) {
        if (id > 0) {
            this._id = id;
        }

        let url = 'http://127.0.0.1:8000/frog/gallery/' + this._id + '/filter';
        let options = new RequestOptions();
        options.search = new URLSearchParams();
        options.search.set('filters', JSON.stringify(this._terms));
        options.search.set('more', append.toString());
        options.search.set('timestamp', new Date().getTime().toString());

        this.loading = true;

        this.http.get(url, options)
            .map(this.extractData).subscribe(items => {
                this._items.length = 0;
                for (var item of items) {
                    let obj = <IItem>item;
                    let author = <User>obj.author;
                    obj.author = author;

                    this._items.push(obj);
                    this._guids.push(obj.guid);
                }
                this._observer.next(this._items);
                this.loading = false;
            }, error => console.log(error));
    }
    extractData(res: Response) {
        let body = res.json();
        return body.values || [];
    }
    handleError(error: any) {
        console.error(error);
        return Observable.throw(error);
    }
    reset() {
        this._terms.forEach(element => {
            element.length = 0;
        });
    }
    addTerm(term:any, bucket:number=0, append:boolean=false) {
        if (!append) {
            this._terms[bucket].length = 0;
        }
        if (this._terms[bucket].indexOf(term)) {
            this._terms[bucket].push(term);
        }
    }
    likeItem(item:IItem) {
        let url = 'http://127.0.0.1:8000/frog/like/' + item.guid;
        this.http.put(url, null).subscribe(item => {
                // Materialize.toast('Liked!');
            }, error => console.log('error loading items'));
    }
    getComments(item:IItem) {
        let url = 'http://127.0.0.1:8000/frog/comment/?json=1&guid=' + item.guid;
        return this.http.put(url, null).map(this.extractData);
    }
    addComment(item:IItem, comment:string) {
        let url = 'http://127.0.0.1:8000/frog/comment/';
        let options = new RequestOptions();
        options.body = {comment: comment, guid: item.guid};
        options.withCredentials = true;
        return this.http.post(url, options).map(this.extractData);
    }
    update(item: IItem) {
        let url = 'http://127.0.0.1:8000/frog/piece/' + item.guid;
        let options = new RequestOptions();
        options.body = {title: item.title, description: item.description};
        options.withCredentials = true;
        return this.http.put(url, options).map(this.extractData);
    }
    editTags(items: IItem[], add: Tag[], remove: Tag[]) {
        let url = 'http://127.0.0.1:8000/frog/tag/manage';
        let options = new RequestOptions();
        
        options.body = {
            guids: items.map(function(_) { return _.guid; }).join(','),
            add: add.map(function(_) { return _.id; }).join(','),
            rem: remove.map(function(_) { return _.id; }).join(',')
        };
        options.withCredentials = true;
        return this.http.post(url, options).map(this.extractData);
    }
    download(items: IItem[]) {
        let url = 'http://127.0.0.1:8000/frog/download';
        let options = new RequestOptions();
        options.search.set('guids', items.map(function(_) { return _.guid; }).join(','));
        return this.http.get(url, options).map(this.extractData);
    }
    remove(items: IItem[]) {
        let url = 'http://127.0.0.1:8000/frog/gallery/' + this._id + '/';
        let options = new RequestOptions();
        options.body = {
            guids: items.map(function(_) { return _.guid; }).join(',')
        };
        options.withCredentials = true;
        return this.http.delete(url, options).map(this.extractData);
    }
}