import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { WorksService } from './works.service';
import { TagsComponent } from './tags.component';
import { AutocompleteComponent } from './autocomplete.component';
import { Tag } from '../shared/iitem';

@Component({
    selector: 'works-filter',
    template: `
    <div id='filter_background' class='z-depth-2'></div>
    <div style="width: 300px; display: inline-block;">
        <autocomplete (onSelect)="addTag($event)"></autocomplete>
    </div>
    <div id='filtered_results' *ngFor="let bucket of service._terms">
        <tag *ngFor="let item of bucket" [item]="item" (onClose)="removeTag($event)"></tag>
    </div>`,
    styles: [
        '#filter_background { position: absolute; width: 100%; height: 81px; background-color: #fff; }',
        '#filtered_results { position: relative; display: inline-flex; }'
    ],
    directives: [TagsComponent, AutocompleteComponent]
})
export class FilterComponent implements OnInit, OnDestroy {
    private tags: string[];
    private galleryid: number;
    private query: string;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private service: WorksService
    ) {
        this.tags = [];
    }
    ngOnInit() {
        this.route.params.subscribe(params => {
            this.galleryid = +params['id'];
            this.service.reset();
            if (params['bucket1']) {
                params['bucket1'].split('+').forEach(element => {
                    this.service.addTerm(parseInt(element) || element, 0, true);
                });
            }
            this.service.get(this.galleryid);
        })
    }
    ngOnDestroy() {}
    addTag(tag: Tag) {
        let name = tag.id.toString();
        if (name === '0') {
            name = tag.name;
        }
        this.addTagString(name);
    }
    addTagString(name: string) {
        this.router.navigate(['w/' + this.galleryid + '/' + name]);
    }
    removeTag(tag:Tag) {
        this.router.navigate(['w/' + this.galleryid]);
    }
}