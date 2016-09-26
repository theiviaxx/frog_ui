import  {Injectable } from '@angular/core';
import { Http, Request, RequestMethod, Response, RequestOptions, URLSearchParams } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';

import { IItem } from './models';
import { Rect } from './euclid';

export class Gallery {
    items: IItem[]
}


@Injectable()
export class SelectionService {
    public detail: ReplaySubject<IItem>;
    public selection: ReplaySubject<IItem[]>;
    public selectionRect: ReplaySubject<Rect>;
    public length: number;
    private items: IItem[];
    private selected: IItem;
    private rect: Rect;
    
    constructor() {
        this.items = [];
        this.rect = new Rect(0, 0, 0, 0);
        this.length = this.items.length;
        this.selected = null;
        this.selection = new ReplaySubject<IItem[]>();
        this.detail = new ReplaySubject<IItem>();
        this.selectionRect = new ReplaySubject<Rect>();
    }
    setDetailItem(item:IItem) {
        this.detail.next(item);
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
        let index = this.items.indexOf(item);
        if (index !== -1) {
            this.items.splice(index, 1);
        }
        item.selected = false;
        this.length = this.items.length;
        this.selection.next(this.items);
    }
    selectItems(items: IItem[], toggle: boolean = false) {
        let currentlength = this.length;
        for (let item of items) {
            let index = this.items.indexOf(item);
            if (index == -1) {
                this.items.push(item);
                item.selected = true;
            }
            else {
                if (toggle) {
                    this.items.splice(index, 1);
                    item.selected = false;
                }
            }
        }
        
        this.length = this.items.length;
        if (currentlength != this.length) {
            this.selection.next(this.items);
        }
    }
    clear() {
        this.selection.next([]);
        this.length = this.items.length;
    }
    setRect(rect: Rect) {
        this.rect.x = rect.x;
        this.rect.y = rect.y;
        this.rect.width = rect.width;
        this.rect.height = rect.height;
        this.selectionRect.next(this.rect);
    }
}