import { Component, OnInit, Input } from '@angular/core';

import { Comment } from './models';
import { CapitalizePipe } from './capitalize.pipe';
import { CommentURLPipe } from './comment-url.pipe';

@Component({
    selector: 'comment-item',
    template: `
    <div class="btn-toolbar" *ngIf="false">
        <div class="btn-group">
            <button class="dropdown-toggle btn btn-default btn-xs" data-toggle="dropdown" href="#" type="button"><i class="fa fa-chevron-down"></i></button>
            <ul class="dropdown-menu dropdown-menu-right dropdown-menu-sm">
                <li><a href="#">Edit</a></li>
            </ul>
        </div>
    </div>
    <div class="comment-body">
        <div class="commenter">
            <a href="/artist/saintgenesis">{{comment.user?.name | capitalize:1}}</a>
        </div>
        <div class="commenter-headline grey-text text-darken-1">{{comment.user?.email}}</div>
        <div class="comment-text">
            <p [outerHTML]="comment.comment | commentUrl"></p>
        </div>
        <ul class="social-actions">
            <li class="right-align"><i class="posted">{{comment.date | date}}</i></li>
        </ul>
    </div>`,
    styles: [
        '.comment-body { position: relative; width: 100%; overflow: visible; display: table-cell; vertical-align: top; line-height: initial; }',
        '.comment-body .commenter a { font-size: 18px; font-weight: 300; }',
        '.comment-body .commenter-headline { font-size: 12px; opacity: 0.6; margin-bottom: 5px; line-height: 1.25em; }',
        '.comment-text { word-break: break-word; }',
        '.social-actions { margin: 5px 0; padding: 0; list-style: none; }',
        '.social-actions li { display: inline-block; margin-right: 15px; font-size: 12px; float: right; }',
        'div.commenter a { line-height: inherit; font-size: 20px; padding: 0; height: inherit; }',
        'a { color: #13aff0; transition: all 0.2s cubic-bezier(0.55, 0.085, 0.68, 0.53); }',
        'p { margin: 0; }'
    ]
})
export class CommentComponent implements OnInit {
    @Input() comment: Comment;

    constructor() { }

    ngOnInit() { }
}