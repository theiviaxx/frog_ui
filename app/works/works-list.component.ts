import { Component, OnInit } from '@angular/core';

import {WorksService, Gallery} from './works.service';
import {WorksThumbnailComponent} from './works-thumbnail.component';

@Component({
    selector: 'works-list',
    template: `
    <div *ngIf="service.loading" class='spinner'>
        loading...
        <div class="preloader-wrapper small active">
            <div class="spinner-layer spinner-green-only">
                <div class="circle-clipper left">
                    <div class="circle"></div>
                </div>
                <div class="gap-patch">
                    <div class="circle"></div>
                </div>
                <div class="circle-clipper right">
                    <div class="circle"></div>
                </div>
            </div>
        </div>
    </div>
    <div class='row'>
        <thumbnail class='col s2 loaded' *ngFor="let item of gallery.items" [item]="item" [class.selected]="item.selected"></thumbnail>
    </div>`,
    styles: [
        '.spinner { position: fixed; background: rgba(0, 0, 0, 0.5); width: 100%; height: 100%; color: #fff; font-size: 36px; text-align: center; padding-top: 50%; z-index: 3001; }',
        '.col {padding: 0;}'
    ]
})
export class WorksListComponent implements OnInit {
    gallery: Gallery

    constructor(private service:WorksService) {
        this.gallery = new Gallery();
        this.service.results.subscribe(
                       items => this.gallery.items = items
                   );
    }
    ngOnInit() {
        
    }
}