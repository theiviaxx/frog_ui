import { Component, Input, OnInit, OnDestroy, AfterContentInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { SelectionService } from './selection.service';
import { UserService } from '../user/user.service';
import { WorksService } from './works.service';
import { TagsComponent } from './tags.component';
import { TagsService } from './tags.service';
import { AutocompleteComponent } from './autocomplete.component';
import { TagArtistFilterPipe } from './tag-artist-filter.pipe';
import { IItem, Tag, User } from '../shared';

@Component({
    selector: 'works-detail',
    template: `
    <div *ngIf="item">
        <li>
            <div class="userView">
                <span *ngIf="!isOwner">{{item.title}}</span>
                <div *ngIf="isOwner" class="row">
                    <div class="input-field col s6">
                        <input id="title" type="text" [(ngModel)]="item.title" (blur)="submit()" (keyup.enter)="submit()" />
                        <label class="active" for="title">Title</label>
                    </div>
                </div>
                <span class="name">{{item.author.username}}({{item.author.id}})</span>
                <span class="email">{{item.author.email}}</span>
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
        <li><div class="divider"></div></li>
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
        <li><div class="divider"></div></li>
        <li><a class="subheader">Comments<i class='material-icons'>comment</i></a></li>
        <li>
            <input type="text" placeholder="Add a comment..." *ngIf="!prompted" (focus)="prompted = true" />
            <div *ngIf="prompted">
                <textarea [(ngModel)]=comment></textarea>
                <a class="waves-effect waves-light btn" (click)="postComment()">Post comment</a>
                <a class="waves-effect waves-light btn" (click)="prompted = false">Cancel</a>
            </div>
        </li>
        <li>
            <ul class='collection'>
                <li *ngFor="let comment of comments">{{comment.comment}}</li>
            </ul>
        </li>
        <li><a class="subheader">Tags<i class='material-icons'>label</i></a></li>
        <li>
            <tag *ngFor="let tag of item.tags | tagArtistFilter" [item]="tag.id" (onClose)="removeTag($event)"></tag>
            <autocomplete (onSelect)="addTag($event)"></autocomplete>
        </li>
    </div>
    `,
    styles: ['td {font-size: 12px; padding: 6px 5px;}'],
    properties: ['data'],
    directives: [TagsComponent, AutocompleteComponent],
    pipes: [TagArtistFilterPipe]
})
export class WorksDetailComponent implements OnInit {
    private item: IItem;
    private comments: any[];
    private comment: string = '';
    private prompted: boolean;
    private user: User;
    private isOwner: boolean;
    private active: boolean;

    constructor(private service: SelectionService, private works: WorksService, private userservice: UserService, private tagssservice: TagsService) {
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
            $('.collapsible').collapsible();
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
    addTag(tag: Tag) {
        let found = false;
        for (let t of this.item.tags) {
            if (tag.id == t.id) {
                found = true;
                break;
            }
        }
        if (!found) {
            let name = tag.id.toString();
            this.tagssservice.create(name).subscribe(tag => {
                this.works.editTags([this.item], [tag], []);
                this.item.tags.push(tag);
            });
        }
    }
    private submit() {
        this.active = false;
        this.works.update(this.item).subscribe(item => this.active = true);
    }
}