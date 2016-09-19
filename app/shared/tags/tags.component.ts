import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, AfterViewInit, ChangeDetectorRef } from '@angular/core';

import { TagsService } from './tags.service';
import { Tag } from '../models';


@Component({
    selector: 'tag',
    template: `
    <div class="chip" [class.grey]="dark" [class.darken-3]="dark" [class.grey-text]="dark">
        <i class="material-icons left">{{(id == 0) ? "search" : "label"}}</i>
        {{tag.name}}
        <i *ngIf="editable" class="close material-icons" (click)="close()">close</i>
    </div>`,
    styles: [
        '.chip, .chip > i.material-icons { height: 24px; line-height: 24px; border-radius: 2px; }',
        '.chip > i.material-icons:first-child { margin-right: 8px; font-size: 16px; height: 24px; line-height: 24px; }'
    ]
})
export class TagsComponent implements OnInit, OnDestroy, AfterViewInit {
    @Input() item: any;
    @Input() editable: boolean = true;
    @Input() dark: boolean = false;
    @Output() onClose = new EventEmitter<Tag>();
    private tag: Tag;

    constructor(private service: TagsService, private _changeDetectionRef : ChangeDetectorRef) {
        this.tag = new Tag(0, '', false);
    }
    ngAfterViewInit() {
        if (parseInt(this.item)) {
            this.tag.id = this.item;
        }
        else {
            this.tag.name = this.item;
        }
        this.service.tags.subscribe({
            next: (tags) => {
                if (this.tag.id) {
                    this.resolveTag();
                }
            }
        });
        this.resolveTag();
    }
    ngOnInit() {}
    ngOnDestroy() {}
    private resolveTag() {
        let tag = this.service.getTagById(this.tag.id);
        if (tag !== null) {
            this.tag.name = tag.name;
            this.tag.artist = tag.artist;
            this._changeDetectionRef.detectChanges();
        }
    }
    close() {
        this.onClose.emit(this.tag);
    }
}
