import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { UserService } from './user.service';

@Component({
    template: `
    <section class='light-green-text'>
        <h1>Frog Login</h1>
    </section>
    <form method='post' action='/frog/login'>
        {{ csrf_token }}
        <div class='row'>
            <div class='input-field col s12'>
                <input type="email" name='email' [(ngModel)]="email">
                <label>Email</label>
            </div>
        </div>
        <div class='row'>
            <div class='input-field col s12'>
                <input type="text" name='first' [(ngModel)]="first">
                <label>First Name</label>
            </div>
        </div>
        <div class='row'>
            <div class='input-field col s12'>
                <input type="text" name='last' [(ngModel)]="last">
                <label>Last Name</label>
            </div>
        </div>
        <a class="waves-effect waves-light btn light-green" (click)="clickHandler()">Login</a>
    </form>
    <div *ngIf="message.length">
        <div class='msg alert-danger'>{{message}}</div>
    </div>
    <footer>
        <a href="http://frog.readthedocs.io/en/latest/" target="_blank"><img src="/static/frog/i/frog.png"></a>
    </footer>
    `,
    styles: [
        'body { font-family: Helvetica;background: #333;-webkit-font-smoothing: antialiased; }',
        'form { width: 380px;margin: 4em auto;padding: 3em 2em 2em 2em;background: #666;border: 1px solid #777;box-shadow: rgba(0,0,0,0.14902) 0px 1px 1px 0px,rgba(0,0,0,0.09804) 0px 1px 2px 0px; }',
        'footer { text-align: center; }',
        'section { text-align:center; margin-top: 4em; }',

    ]
})
export class LoginComponent implements OnInit {
    private email: string = '';
    private first: string = '';
    private last: string = '';
    private message: string = '';
    private csrf_token: string = '';

    constructor(private service: UserService, private router: Router) {
        
    }
    ngOnInit() { }
    clickHandler() {
        this.service.login(this.email, this.first, this.last).subscribe(response => {
            this.router.navigate(['/w/' + response]);
        }, error => console.log(`Could not log you in: ${error}`));
    }
}