import { Injectable } from '@angular/core';
import {Http, Request, RequestMethod, Response, RequestOptions, URLSearchParams } from '@angular/http';

import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';

import { User } from '../shared';

export class Gallery {
    id: number;
    title: string;
    security: number;
    image_count: number;
    video_count: number;
    owner: User;
    description: string;
    uploads: boolean;
    parent: Gallery;
}


@Injectable()
export class GalleryService {
    public results: Observable<Gallery[]>;
    private _observer: Observer<Gallery[]>;
    
    constructor(private http:Http) {
        this.results = Observable.create(observer => {
            this._observer = observer
        });
    }
    get() {
        let url = 'http://127.0.0.1:8000/frog/gallery';
        let options = new RequestOptions();
        options.search = new URLSearchParams();
        options.search.set('json', '1');
        options.search.set('timestamp', new Date().getTime().toString());

        this.http.get(url, options)
            .map(this.extractData).subscribe(items => {
                this._observer.next(items);
            }, error => console.log('error loading items'));
    }
    extractData(res: Response) {
        let body = res.json();
        return body.values || [];
    }
}