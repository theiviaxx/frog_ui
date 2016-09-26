import { Component, Input, AfterViewInit, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import { Location } from '@angular/common';

import { Router, ActivatedRoute } from '@angular/router';

import { Point, Matrix, IItem } from '../shared';
import { SelectionService } from '../shared';
import { WorksService } from '../works/works.service';
import { ImageComponent } from './image.component';
import { VideoComponent } from './video.component';


@Component({
    selector: 'viewer',
    template: `
    <ul id="works_detail" class="side-nav grey darken-4 grey lighten-4-text">
        <works-detail></works-detail>
    </ul>
    <div class="actions">
        <a (click)="location.back()"><i class="material-icons">close</i></a>
    </div>
    <div id='viewer' class="noselect">
        <div class="fixed-action-btn" style="bottom: 45px; right: 24px;">
            <a class="btn-floating btn-large light-green">
                <i class="large material-icons">more_vert</i>
            </a>
            <ul>
                <li><a id="viewer_info" class="btn-floating blue" data-activates="works_detail"><i class="material-icons">info_outline</i></a></li>
                <li><a class="btn-floating blue darken-2" (click)="fitToWindow()"><i class="material-icons">desktop_windows</i></a></li>
                <li><a class="btn-floating blue darken-4" (click)="original()"><i class="material-icons">zoom_in</i></a></li>
            </ul>
        </div>
        <frog-image *ngIf="isimage"></frog-image>
        <frog-video *ngIf="!isimage"></frog-video>
    </div>
    <div class='row' *ngIf="objects.length > 0">
        <div class='col s1 left'>
            <a class="waves-effect waves-light" (click)="previous()"><i class="material-icons large" [style.padding-top]="height / 2">navigate_before</i></a>
        </div>
        <div class='col s1 right'>
            <a class="waves-effect waves-light" (click)="next()"><i class="material-icons large" [style.padding-top]="height / 2">navigate_next</i></a>
        </div>
    </div>
    `,
    styles: [
        '#viewer { background: #000; position: absolute; width: 100%; height: 100%; top: 0; left: 0; cursor: move; }',
        '.actions { position: absolute; top: 0; right: 0; }',
        '.row { margin-bottom: 0; z-index: 3000; }',
        '.row a { height: 100%; opacity: 0; -webkit-transition: opacity 0.3s 0.0s; -moz-transition: opacity 0.3s 0.0s; -ms-transition: opacity 0.3s 0.0s; }',
        '.row a:hover { height: 100%; opacity: 1; }',
    ]
})
export class ViewerComponent implements OnInit, AfterViewInit {
    @ViewChild(ImageComponent) image: ImageComponent;
    @ViewChild(VideoComponent) video: VideoComponent;

    private objects: IItem[] = [];
    private index: number = 0;
    private isimage: boolean = true;
    width: number = 0;
    height: number = 0;
    
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private service: WorksService,
        private selectionservice: SelectionService,
        private location: Location
    ) {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.service.resolved.subscribe(items => {
            this.objects = items;
            this.setIndex(this.index);
        });
    }
    ngOnInit() {
        this.route.params.subscribe(params => {
            this.index = +params['focus'];
            let guids = params['guids'].split(',');
            this.service.resolveGuids(guids);
        });
    }
    ngAfterViewInit() {
        $('#viewer_info').sideNav({
            edge: 'right',
            menuWidth: 365
        });
    }
    next() {
        let index:number = this.index + 1;
        index = (index > this.objects.length - 1) ? 0 : index;
        this.setIndex(index);
    }
    previous() {
        let index = this.index - 1;
        index = (index < 0) ? this.objects.length - 1 : index;
        this.setIndex(index);
    }
    original() {
        if (this.image) {
            this.image.original();
        }
        if (this.video) {
            this.video.original();
        }
    }
    fitToWindow() {
        if (this.image) {
            this.image.fitToWindow();
        }
        if (this.video) {
            this.video.fitToWindow();
        }
    }
    download() {

    }
    setIndex(index:number) {
        this.index = index;
        if (this.objects.length) {
            this.isimage = this.objects[index].guid.charAt(0) == '1';
            this.selectionservice.setDetailItem(this.objects[index]);
        }
    }
}