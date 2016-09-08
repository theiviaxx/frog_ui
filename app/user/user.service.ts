import { Injectable } from '@angular/core';
import {Http, Request, RequestMethod, Response, RequestOptions, URLSearchParams, Headers } from '@angular/http';

import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';

export class User {
    public id: number;
    public name: string;
    public email: string;
    public username: string;
}


@Injectable()
export class UserService {
    private _observer: Observer<User>;
    public user: User;
    public results: Observable<User>;

    constructor(private http:Http) {
        this.results = Observable.create(observer => {
            this._observer = observer
        });
        this.preAuth();
    }
    preAuth() {
        // let url = 'http://127.0.0.1:8000/frog/login';

        // this.http.get(url, {withCredentials: true})
        //     .subscribe(response => {
        //         console.log(response);
        //     }, error => console.log('error loading items'));
    }
    get() {
        this.user = new User();
        this.user.id = 3;
        this.user.name = 'Brett Dixon';
        this.user.email = 'theiviaxx@gmail.com';
        this.user.username = 'theiviaxx';
        
        this._observer.next(this.user);
        // let url = 'http://127.0.0.1:8000/frog/user/';
        // let options = new RequestOptions();
        // options.search = new URLSearchParams();
        // options.search.set('json', '1');
        // options.search.set('timestamp', new Date().getTime().toString());

        // this.http.get(url, options)
        //     .map(this.extractData).subscribe(items => {
        //         this._observer.next(items);
        //     }, error => console.log('error loading items'));
    }
    extractData(res: Response) {
        let body = res.json();
        return body.values || [];
    }
    login() {
        let url = 'http://127.0.0.1:8000/frog/login';

        this.http.get(url, {withCredentials: true})
            .map(this.extractData).subscribe(response => {
                console.log(response);
            }, error => console.log('error loading items'));
    }
}