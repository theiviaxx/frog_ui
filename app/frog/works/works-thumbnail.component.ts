import {Component, Input, OnInit, OnDestroy, ElementRef, AfterViewInit, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { WorksService } from './works.service';
import { SelectionService, TagsService, CapitalizePipe, IItem } from '../shared';

@Component({
    selector: 'thumbnail',
    template: `
    <a href="/frog/image/{{item.guid}}" (click)="clickHandler($event)">
        <img src='{{item.thumbnail}}'  style='width: 100%;' />
    </a>
    <div class='thumbnail-details' (window:keyup)="clearSelection($event)">
        <p>{{item.title}}</p>
        <a class='frog-like'>
            <i (click)="like()" class="tiny material-icons">thumb_up</i><small>{{item.like_count}}</small>
        </a>
        <i (click)="setFocus($event)" data-activates="works_detail" class="tiny material-icons">info</i>
        <small (click)="setAuthor(item.author.name)">{{item.author.name | capitalize:1}}</small>
    </div>`,
    styles: [
        '.thumbnail-details { color: #8bc34a; }',
        'p { position: absolute; bottom: 12px; font-size: 18px; color: #fff; line-height: 16px; font-weight: normal; overflow: hidden; cursor: pointer; }',
        'div > i { position: absolute; right: 4px; bottom: 4px; cursor: pointer; }',
        '.frog-like { position: absolute; right: 28px; bottom: 4px; cursor: pointer; color: #8bc34a; }',
        'div > small { position: absolute; bottom: 4px; }'
    ]
})
export class WorksThumbnailComponent implements OnInit, AfterViewInit {
    @Input() item;
    private initialized: boolean;
    private selecteditems: IItem[];
    private ctrlKey: boolean;

    constructor(private element: ElementRef, private router: Router, private service: SelectionService, private works: WorksService, private tags: TagsService) {
        this.initialized = false;
        this.service.selection.subscribe(items => this.selecteditems = items);
        this.service.selectionRect.subscribe(rect => {
            if (!this.item) {
                return;
            }
            let r = this.element.nativeElement.getBoundingClientRect();
            if (rect.intersects(r)) {
                this.service.selectItem(this.item);
            }
            else {
                //if (!this.ctrlKey) {
                    this.service.deselectItem(this.item);
                //}
            }
        });
    }
    ngOnInit() {
        
    }
    ngAfterViewInit() {
        
    }
    clickHandler(event: MouseEvent) {
        event.preventDefault();
        if (event.shiftKey) {
            this.service.selectItem(this.item, true);
        }
        else {
            let guids = [this.item.guid];
            let index = 0;
            if (this.selecteditems) {
                guids = this.selecteditems.map(function(x) { return x.guid; });
                index = guids.indexOf(this.item.guid);
            }
            this.router.navigate(['/v', index, guids.join(',')]);
        }
    }
    like() {
        this.works.likeItem(this.item);
    }
    setFocus(event) {
        this.service.setDetailItem(this.item);
        if (!this.initialized) {
            this.initialized = true;
            $(event.target).sideNav({
                edge: 'right',
                menuWidth: 365
            });
            $(event.target).sideNav('show');
            $('.collapsible').collapsible();
        }
    }
    setAuthor(name: string) {
        let tag = this.tags.getTagByName(name);
        if (tag != null) {
            this.router.navigate(['/w/' + this.works.id + '/' + tag.id]);
        }
    }
    clearSelection(event) {
        if (event.keyCode == 100 && event.ctrl) {
            this.service.clear();
        }
    }
    @HostListener('window:mousemove', ['$event'])
    isCtrlDown(event: MouseEvent) {
        this.ctrlKey = event.ctrlKey;
    }
}