import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { WorksService } from './works.service';
import { NavigationComponent } from './navigation.component';
import { Tag, TagsComponent, AutocompleteComponent } from '../shared';

@Component({
    selector: 'works-filter',
    template: `
    <div class="navbar-fixed">
        <nav class="light-green darken-2">
            <div class="nav-wrapper">
                <a href="#" class="brand-logo right"><i class="material-icons">collections</i></a>
                <ul>
                    <li>
                        <a href="#" class="dropdown-button" data-activates="navigation_sidenav" id="nav_button">
                            <i class="small material-icons">menu</i>
                        </a>
                    </li>
                    <li>
                        <a href="#"><i class="material-icons left">cloud_upload</i></a>
                    </li>
                    <li>
                        <autocomplete (onSelect)="addTag($event)"></autocomplete>
                    </li>
                    <li id='filtered_results' *ngFor="let bucket of service.terms">
                        <tag *ngFor="let item of bucket" [item]="item" (onClose)="removeTag($event)"></tag>
                    </li>
                </ul>
            </div>
        </nav>
    </div>
    `,
    styles: [
        '#filtered_results { position: relative; display: inline-flex; }'
    ]
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
            
            if (params['bucket2']) {
                params['bucket2'].split('+').forEach(element => {
                    this.service.addTerm(parseInt(element) || element, 1, true);
                });
            }

            this.service.get(this.galleryid);
        })
    }
    ngOnDestroy() {}
    addTag(event: any) {
        let name = event.tag.id.toString();
        if (name === '0') {
            name = event.tag.name;
        }
        if (event.shiftKey) {
            this.addTagString(name, 1);
        }
        else {
            this.addTagString(name);
        }
    }
    addTagString(name: string, bucket: number=0) {
        if (bucket == 0 || this.service.terms[0].length == 0) {
            this.router.navigate(['w/' + this.galleryid + '/' + name]);
        }
        else {
            this.router.navigate(['w/' + this.galleryid + '/' + this.service.terms[0].join('+') + '/' + name]);
        }
    }
    removeTag(tag:Tag) {
        this.router.navigate(['w/' + this.galleryid]);
    }
}