import { Injectable } from '@angular/core';
import { Http, Request, RequestMethod, Response, RequestOptions, URLSearchParams } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { IItem, Tag, User } from '../shared';


@Injectable()
export class WorksService {
    // public results: Observable<IItem[]>;
    private _observer: Observer<IItem[]>;
    private items: IItem[];
    private guids: string[];
    private requested: number;
    public results: BehaviorSubject<IItem[]>;
    public resolved: BehaviorSubject<IItem[]>;
    public id: number;
    public selection: IItem[];
    public focusItem: IItem;
    public terms: Array<Array<any>>;
    public loading: boolean;
    
    constructor(public http:Http) {
        this.items = [];
        this.guids = [];
        this.terms = [[], []];
        this.id = 0;
        this.loading = false;
        this.results = new BehaviorSubject<IItem[]>(this.items);
        this.resolved = new BehaviorSubject<IItem[]>(this.items);
    }
    get(id:number=0, append:boolean=false) {
        if (id > 0) {
            this.id = id;
        }

        let url = '/frog/gallery/' + this.id + '/filter';
        let options = new RequestOptions();
        options.search = new URLSearchParams();
        options.search.set('filters', JSON.stringify(this.terms));
        options.search.set('more', append.toString());
        options.search.set('timestamp', new Date().getTime().toString());

        this.loading = true;

        this.http.get(url, options)
            .map(this.extractData).subscribe(items => {
                this.items.length = 0;
                for (var item of items) {
                    let obj = <IItem>item;
                    let author = <User>obj.author;
                    obj.author = author;

                    this.items.push(obj);
                    this.guids.push(obj.guid);
                }
                // this._observer.next(this._items);
                this.results.next(this.items);
                this.resolved.next(this.items);
                this.loading = false;
            }, error => console.log(error));
    }
    getFromGuid(guid: string) {
        let index = this.guids.indexOf(guid);
        if (index > -1) {
            return this.items[index];
        }
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
        this.terms.forEach(element => {
            element.length = 0;
        });
    }
    addTerm(term:any, bucket:number=0, append:boolean=false) {
        if (!append) {
            this.terms[bucket].length = 0;
        }
        if (this.terms[bucket].indexOf(term)) {
            this.terms[bucket].push(term);
        }
    }
    likeItem(item:IItem) {
        let url = '/frog/like/' + item.guid;
        this.http.put(url, null).subscribe(item => {
                Materialize.toast('Liked!');
            }, error => console.log('error loading items'));
    }
    getComments(item:IItem) {
        let url = '/frog/comment/?json=1&guid=' + item.guid;
        return this.http.put(url, null).map(this.extractData);
    }
    addComment(item:IItem, comment:string) {
        let url = '/frog/comment/';
        let options = new RequestOptions();
        options.body = {comment: comment, guid: item.guid};
        options.withCredentials = true;
        return this.http.post(url, options).map(this.extractData);
    }
    update(item: IItem) {
        let url = '/frog/piece/' + item.guid;
        let options = new RequestOptions();
        options.body = {title: item.title, description: item.description};
        options.withCredentials = true;
        return this.http.put(url, options).map(this.extractData);
    }
    editTags(items: IItem[], add: Tag[], remove: Tag[]) {
        let url = '/frog/tag/manage';
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
        let url = '/frog/download';
        let options = new RequestOptions();
        options.search = new URLSearchParams();
        options.search.set('guids', items.map(function(_) { return _.guid; }).join(','));
        return this.http.get(url, options).map(this.extractData);
    }
    remove(items: IItem[]) {
        let url = '/frog/gallery/' + this.id + '/';
        let options = new RequestOptions();
        options.body = {
            guids: items.map(function(_) { return _.guid; }).join(',')
        };
        options.withCredentials = true;
        return this.http.delete(url, options).map(this.extractData);
    }
    resolveGuids(guids: string[]) {
        let url = '/frog/p';
        let options = new RequestOptions();
        options.search = new URLSearchParams();
        options.search.set('guids', guids.join(','));
        this.http.get(url, options).map(this.extractData).subscribe(items => {
            this.resolved.next(items);
        });
    }
}