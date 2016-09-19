import { Component, Input, OnInit, OnDestroy, AfterContentInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { UserService } from '../user/user.service';
import { WorksService } from './works.service';
import { IItem, Tag, User, SelectionService, AutocompleteComponent, TagsComponent, TagsService, TagArtistFilterPipe, CommentComponent, CapitalizePipe } from '../shared';

@Component({
    selector: 'works-detail',
    template: `
    <div *ngIf="item" class="works-detail grey-text text-lighten-1">
        <div class="artwork-info ps-container">
            <div class="separator-sm"></div>
            <div class="artist">
                <div class="artist-name-and-headline">
                    <div class="name">
                        <a href="/w/1/1">{{item.author.name | capitalize:1}}</a>
                    </div>
                    <div class="headline">{{item.author.email}}</div>
                </div>
            </div>
            <div class="button-blocks">
                <div class="separator"></div>
                <div class="row">
                    <div class="col s6">
                        <a class="waves-effect waves-light btn green"><i class="material-icons left">thumb_up</i> Like</a>
                    </div>
                    <div class="col s6">
                        <a class="waves-effect waves-light btn blue"><i class="material-icons left">collections</i> Add to Collection</a>
                    </div>
                </div>
            </div>
        </div>
        <h3 class="white-text">{{item.title}}</h3>
        <div class="description" id="project-description" style="max-height: none;">
            <p>{{item.description}}</p>
        </div>
        <small><i>{{item.created | date}}</i></small>
        <div class="separator-sm"></div>
        <ul class="list-inline">
            <li>
                <i class="material-icons tiny">thumb_up</i> {{item.like_count}} Likes
            </li>
            <li>
                <i class="material-icons tiny">comment</i> {{item.comment_count}} Comments
            </li>
        </ul>
        <div class="separator"></div>
        <div class="tags">
            <h4 class="title">
                <i class="material-icons green-text">label</i> Tags
            </h4>
            <tag *ngFor="let tag of item.tags | tagArtistFilter" [item]="tag.id" [dark]="true" (onClose)="removeTag($event)" (click)="navigateToTag(tag)"></tag>
            <autocomplete (onSelect)="addTag($event)"></autocomplete>
        </div>
        <div class="separator"></div>
        <h4>
            <i class="material-icons green-text">comment</i> {{item.comment_count}} Comments
        </h4>
        <ul>
            <li *ngFor="let comment of comments"><comment-item [comment]="comment"></comment-item></li>
        </ul>
        <input type="text" placeholder="Add a comment..." *ngIf="!prompted" (focus)="prompted = true" />
        <div *ngIf="prompted">
            <textarea [(ngModel)]=comment></textarea>
            <div class="row">
                <div class="col s6"><a class="waves-effect waves-light light-green btn" (click)="postComment()">Post comment</a></div>
                <div class="col s6"><a class="waves-effect waves-light red btn" (click)="prompted = false">Cancel</a></div>
            </div>
        </div>
        <div class="keyboard-shortcuts hidden-xs hidden-sm">
            <hr>
            <h5>Keyboard Shortcuts</h5>
            <ul class="shortcuts">
                <li><span class="label label-default">L</span>Like</li>
                <li><span class="label label-default">F</span>Follow</li>
                <li><span class="label label-default"><i class="material-icons tiny">keyboard_arrow_left</i></span>Previous</li>
                <li><span class="label label-default"><i class="material-icons tiny">keyboard_arrow_right</i></span>Next</li>
                <li><span class="label label-default">A</span>Add to collection</li>
                <li><span class="label label-default">esc</span>Close</li>
            </ul>
        </div>


        <!--
        <li>    
            <h3 *ngIf="!isOwner">{{item.title}}</h3>
            <div *ngIf="isOwner" class="row">
                <div class="input-field col s6">
                    <input id="title" type="text" [(ngModel)]="item.title" (blur)="submit()" (keyup.enter)="submit()" />
                    <label class="active" for="title">Title</label>
                </div>
            </div>
        </li>
        <li *ngIf="!isOwner">{{item.description}}</li>
        <li *ngIf="isOwner">
            <div class="row">
                <div class="input-field col s6">
                    <textarea id="description" class="materialize-textarea" [(ngModel)]="item.description" (blur)="submit()"></textarea>
                    <label class="active" for="description">Description</label>
                </div>
            </div>
        </li>
        <li class="no-padding">
            <ul class="collapsible collapsible-accordion">
                <li>
                    <a class="collapsible-header">Details<i class="material-icons">arrow_drop_down</i></a>
                    <div class="collapsible-body">
                        <ul>
                            <li>
                                <table>
                                    <tbody>
                                        <tr><td>Created</td><td>{{item.created | date:'short'}}</td></tr>
                                        <tr><td>Modified</td><td>{{item.modified | date:'short'}}</td></tr>
                                        <tr><td>Dimensions</td><td>{{item.width}} x {{item.height}}</td></tr>
                                        <tr><td>GUID</td><td>{{item.guid}}</td></tr>
                                    </tbody>
                                </table>
                            </li>
                        </ul>
                    </div>
                </li>
            </ul>
        </li>
        -->
    </div>
    `,
    styles: [
        'td {font-size: 12px; padding: 6px 5px;}',
        'div.name { display: block; min-height: 30px; }',
        'div.name a { line-height: 28px; font-size: 28px; padding: 0; height: inherit; }',
        'a { color: #13aff0; transition: all 0.2s cubic-bezier(0.55, 0.085, 0.68, 0.53); font-weight: 300; }',
        '.artist-name-and-headline { margin-left: 0; }',
        '.headline { line-height: 20px; font-size: 14px; min-height: 20px; }',
        '.works-detail { padding: 20px 25px 20px 20px; }',
        'h3 { font-size: 22px; margin-bottom: 10px; margin-top: 0; font-weight: 200; line-height: 1.2em; }',
        'h4 { margin-top: 0px; font-weight: 300; font-size: 18px; margin-bottom: 12.5px; line-height: 1.2em; }',
        'h5 { text-transform: uppercase; letter-spacing: 1px; margin-top: 0px; font-weight: 300; font-size: 14px; }',
        '.list-inline { padding-left: 0px; margin-left: -5px; list-style: none; }',
        '.list-inline > li { display: inline-block; padding-left: 5px; padding-right: 5px; line-height: inherit; }',
        'hr { margin-top: 25px; margin-bottom: 25px; border-right-style: initial; border-bottom-style: initial; border-left-style: initial; border-right-color: initial; border-bottom-color: initial; border-left-color: initial; border-image-source: initial; border-image-slice: initia l; border-image-width: initial; border-image-outset: initial; border-image-repeat: initial; border-width: 1px 0px 0px; border-top: 1px solid rgb(93, 93, 93); }',
        '.separator { height: 1.8em; }',
        '.separator-sm { height: 0.9em; }',
        '.shortcuts { margin: 0; padding: 0; list-style: none; }',
        '.shortcuts > li { display: inline-block; margin-right: 10px; padding-bottom: 15px; font-size: 12px; }',
        '.label {display: inline; font-size: 75%; font-weight: bold; line-height: 1; color: rgb(255, 255, 255); text-align: center; white-space: nowrap; vertical-align: baseline; padding: 0.2em 0.6em 0.3em; border-radius: 0.25em; font-size: 13px; margin-right: 5px; }',
        '.label-default { background-color: transparent; color: rgb(116, 116, 116); border-image-source: initial; border-image-slice: initial; border-image-width: initial; border-image-outset: initial; border-image-repeat: initial; font-weight: normal; border-width: 1px; border-style: solid; border-color: rgb(116, 116, 116); }',
        '.tags > a { display: inline-block; line-height: inherit; position: relative; }',
        '.btn { line-height: 28px !important; height: 28px !important; padding: inherit; font-size: 12px; }',
        'i { vertical-align: middle; }',
        'comment-item { display: inline-flex; width: 100%; }'
    ]
})
export class WorksDetailComponent implements OnInit {
    private item: IItem;
    private comments: any[];
    private comment: string = '';
    private prompted: boolean;
    private user: User;
    private isOwner: boolean;
    private active: boolean;

    constructor(private service: SelectionService, private works: WorksService, private userservice: UserService, private tagssservice: TagsService, private router: Router) {
        this.comments = [];
        this.prompted = false;
        this.active = true;

        userservice.results.subscribe(user => {
            this.user = user;
        });
        userservice.get();
        service.detail.subscribe(item => {
            this.item = item;
            this.isOwner = item.author.id == this.user.id;
            this.works.getComments(item).subscribe(comments => this.comments = comments);
        });
        
    }
    ngOnInit() {
        // console.log(JSON.stringify(this.item));
    }
    postComment() {
        this.works.addComment(this.item, this.comment).subscribe(comment => {
            this.comments.push(comment);
        });
        this.comment = '';
        this.prompted = false;
    }
    removeTag(tag: Tag) {
        this.works.editTags([this.item], [], [tag]).subscribe();
    }
    addTag(event: any) {
        let found = false;
        for (let t of this.item.tags) {
            if (event.tag.id == t.id) {
                found = true;
                break;
            }
        }
        if (!found) {
            let name = event.tag.id.toString();
            this.tagssservice.create(name).subscribe(tag => {
                this.works.editTags([this.item], [tag], []);
                this.item.tags.push(tag);
            });
        }
    }
    submit() {
        this.active = false;
        this.works.update(this.item).subscribe(item => this.active = true);
    }
    navigateToTag(tag: Tag) {
        $('#selection_sidenav').sideNav('hide');
        this.router.navigate(['/w/' + this.works.id + '/' + tag.id]);
    }
}