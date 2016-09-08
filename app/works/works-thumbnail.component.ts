import {Component, Input, OnInit, OnDestroy, ElementRef, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { WorksService } from './works.service';
import { SelectionService } from './selection.service';

@Component({
    selector: 'thumbnail',
    template: `
    <a href="http://127.0.0.1:8000/frog/image/{{item.guid}}" (click)="clickHandler($event)">
        <img src='http://127.0.0.1:8000{{item.thumbnail}}'  style='width: 100%;' />
    </a>
    <div class='thumbnail-details' (window:keyup)="clearSelection($event)">
        <p>{{item.title}}</p>
        <i (click)="like()" class="tiny material-icons">thumb_up</i>
        <i (click)="setFocus($event)" data-activates="works_detail" class="tiny material-icons">info</i>
        <small>{{item.author.username}}</small>
        <small>{{item.selected}}</small>
    </div>`,
    styles: ['.thumbnail-details {position: absolute;bottom: 0;width: 100%;background: rgba(0, 0, 0, 0.25);}'],
    properties: ['data']
})
export class WorksThumbnailComponent implements OnInit, AfterViewInit {
    @Input() item;
    private initialized: boolean;

    constructor(private element: ElementRef, private router: Router, private service: SelectionService, private works: WorksService) {
        this.initialized = false;
        this.service.selectionRect.subscribe({
            next: (rect) => {
                let r = this.element.nativeElement.getBoundingClientRect();
                if (rect.intersects(r)) {
                    this.service.selectItem(this.item);
                }
                else {
                    this.service.deselectItem(this.item);
                }
            }
        });
    }
    ngOnInit() {
        // console.log(JSON.stringify(this.item));
    }
    ngAfterViewInit() {
        
    }
    clickHandler(event: MouseEvent) {
        event.preventDefault();
        if (event.shiftKey) {
            this.service.selectItem(this.item, true);
        }
        else {
            this.router.navigate(['/viewer', 0, this.item.guid]);
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
                edge: 'right'
            });
            $(event.target).sideNav('show');
        }
    }
    clearSelection(event) {
        if (event.keyCode == 100 && event.ctrl) {
            this.service.clear();
        }
    }
}