import {Component, OnInit} from '@angular/core';

import { WorksListComponent } from './works-list.component';
import { WorksDetailComponent } from './works-detail.component';
import { FilterComponent } from './filter.component';
import { SelectionComponent } from './selection.component';
import { NavigationComponent } from './navigation.component';
import { WorksService } from './works.service';
import { SelectionDetailComponent } from '../shared';

@Component({
    template: `
    <works-nav></works-nav>
    <ul id="works_detail" class="side-nav grey darken-4 grey lighten-4-text">
        <works-detail></works-detail>
    </ul>
    <works-filter></works-filter>
    <works-list id="works_list"></works-list>
    <selection-detail></selection-detail>
    <selection-marquee></selection-marquee>
    `,
    styles: [
        '#works_detail { z-index: 4000; }',
        'works-filter { position: fixed; top: 0; z-index: 900; width: 100%; }',
        'works-list { position: absolute; top: 63px; overflow-x: hidden; }',
        'works-list { -webkit-touch-callout: none;-webkit-user-select: none;-khtml-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none; }'
    ]
})
export class WorksComponent implements OnInit {
    constructor(private service: WorksService) {
        
    }
    ngOnInit() {
        Materialize.scrollFire([{selector: 'works-list', offset: 0, callback: function() {this.service.get(0, true)}.bind(this)}])
    }
}