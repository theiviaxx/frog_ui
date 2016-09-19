import {Injectable} from '@angular/core';
import {Http, Request, RequestMethod, Response, RequestOptions, URLSearchParams } from '@angular/http';

import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import { Subject } from 'rxjs/Subject';

import { IItem } from '../models';
import { Rect } from '../euclid';

export class Gallery {
    items: IItem[]
}


@Injectable()
export class SelectionService {
    public detail: Observable<IItem>;
    public selection: Observable<IItem[]>;
    selectionRect: Subject<Rect>;
    public length: number;
    private _observer: Observer<any>;
    private detailObserver: Observer<IItem>;
    private _items: IItem[];
    private selected: IItem;
    private rect: Rect;
    
    constructor() {
        this._items = [];
        this.rect = new Rect(0, 0, 0, 0);
        this.length = this._items.length;
        this.selected = null;
        this.selection = Observable.create(observer => {
            this._observer = observer
        });
        this.detail = Observable.create(observer => {
            this.detailObserver = observer
        });
        this.selectionRect = new Subject<Rect>();
    }
    setDetailItem(item:IItem) {
        this.detailObserver.next(item);
        // this.service.getComments(item).subscribe(comments => {
        //     var obj = {
        //         'item': item,
        //         'comments': comments
        //     }
        //     this._observer.next(obj);
        // });
    }
    selectItem(item:IItem, toggle: boolean = false) {
        this.selectItems([item], toggle);
    }
    deselectItem(item: IItem) {
        let index = this._items.indexOf(item);
        if (index !== -1) {
            this._items.splice(index, 1);
        }
        item.selected = false;
        this.length = this._items.length;
        this._observer.next(this._items);
    }
    selectItems(items: IItem[], toggle: boolean = false) {
        for (let item of items) {
            let index = this._items.indexOf(item);
            if (index == -1) {
                this._items.push(item);
                item.selected = true;
            }
            else {
                if (toggle) {
                    this._items.splice(index, 1);
                    item.selected = false;
                }
            }
        }
        
        this.length = this._items.length;
        this._observer.next(this._items);
    }
    clear() {
        this._observer.next([]);
        this.length = this._items.length;
    }
    setRect(rect: Rect) {
        this.rect.x = rect.x;
        this.rect.y = rect.y;
        this.rect.width = rect.width;
        this.rect.height = rect.height;
        this.selectionRect.next(this.rect);
    }
}