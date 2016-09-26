import { Component, Input, AfterViewInit, OnDestroy, HostListener, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { Point, Matrix, Rect } from '../shared';
import { IItem, Tag, User, Comment, SelectionService } from '../shared';

class FVideo implements IItem {
    hash: string;
    tags: Tag[];
    deleted: boolean;
    video: string;
    height: number;
    guid: string;
    id: number;
    title: string;
    author: User;
    modified: Date;
    created: Date;
    width: number;
    comment_count: number;
    source: string;
    small: string;
    thumbnail: string;
    poster: string;
    comments: Comment[];
    description: string;
    selected: boolean;
    framerate: number;
}

@Component({
    selector: 'frog-video',
    template: `
    <div id='video_player'>
        <video #vid poster="{{object.poster}}" controls="controls" autoplay="autoplay" loop="loop" [style.margin-top]="margin" [style.width]="xform.elements[0][0]" [style.height]="xform.elements[1][1]">
            <source type='video/mp4' src="{{object.video}}" />
        </video>
        <p class='blue-text text-darken-2'>{{frame}}</p>
    </div>`
})
export class VideoComponent implements OnDestroy {
    @ViewChild('vid') vid: ElementRef;

    private object: FVideo;
    private origin: Point = new Point();
    private xform: Matrix = Matrix.Identity();
    private main: Matrix = Matrix.Identity();
    private scaleValue: number = 1.0;
    private time: number;
    private frame: number;
    private alive: boolean = true;
    private isMouseDown: boolean = false;
    private margin: number;
    private element: HTMLVideoElement;
    width: number;
    height: number;

    constructor(private service: SelectionService, private changeDetectionRef : ChangeDetectorRef) {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.object = new FVideo();
        this.element = null;
    }
    ngAfterViewInit() {
        this.element = this.vid.nativeElement;
        let sub = Observable.fromEvent(<any>this.element, 'timeupdate');
        sub.subscribe(event => {
            this.frame = Math.floor(this.object.framerate * this.element.currentTime);
        })
        this.service.detail.subscribe(item => {
            if (item) {
                setTimeout(() => this.setImage(item), 0);
            }
        });
    }
    ngOnDestroy() {
        this.element.pause();
        this.alive = false;
    }
    setImage(image: IItem) {
        if (!this.alive) {
            return;
        }
        this.object = <FVideo>image;
        this.element.load();
        this.fitToWindow();
    }
    setFrame(frame: number) {
        let delta = (frame > 0) ? 0.07 : -0.07;
        this.element.currentTime += delta;
    }
    // -- Events
    @HostListener('window:mouseup')
    up() {
        this.isMouseDown = false;
        this.main = this.xform;
    }
    @HostListener('window:mousedown', ['$event'])
    down(event:MouseEvent) {
        if (event.button == 0) {
            this.isMouseDown = true;
            this.origin.x = event.clientX;
            this.origin.y = event.clientY;
            this.element.pause();
            this.time = this.element.currentTime;
        }
    }
    @HostListener('window:mousemove', ['$event'])
    move(event:MouseEvent) {
        if (this.isMouseDown) {
            let x:number = event.clientX - this.origin.x;
            
            this.setFrame(x);
            this.origin.x = event.clientX;
        }
    }
    // @HostListener('window:mousewheel', ['$event'])
    // zoom(event:MouseEvent) {
    //     let scale:number = 1.0;
    //     if (event.detail > 0) {
    //         scale += 0.05;
    //     }
    //     else {
    //         scale -= 0.05;
    //     }
    //     let x:number = event.clientX;
    //     let y:number = event.clientY;
    //     this.xform = Matrix.Identity().x(this.main);
    //     this.translate(-x, -y);
    //     this.scale(scale, scale);
    //     this.translate(x, y);
    //     this.main = this.xform;
    //     this.render();
    // }
    @HostListener('window:resize')
    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.xform = this.main = new Matrix([
            [this.object.width, 0, 0],
            [0, this.object.height, 0],
            [0, 0, 1]
        ]);
        this.fitToWindow();
    }
    center(scale:number = 1.0) {
        this.xform = new Matrix([
            [this.object.width, 0, 0],
            [0, this.object.height, 0],
            [0, 0, 1]
        ]);
        this.scale(scale, scale);
        let x: number = this.width / 2 - this.xform.elements[0][0] / 2;
        let y: number = this.height / 2 - this.xform.elements[1][1] / 2;
        this.translate(x, y);

        this.main = this.xform;
    }
    original() {
        this.center();
    }
    fitToWindow() {
        let size = this.xform.rect.fit(window.innerWidth, window.innerHeight);
        let scale = size.width / this.object.width;
        scale = (scale > 1.0) ? 1.0 : scale;
        this.center(scale);

        this.margin = (window.innerHeight / 2) - (this.xform.elements[1][1] / 2);
    }
    translate(x:number, y:number) {
        let m1:Matrix = new Matrix([
            [1, 0, 0],
            [0, 1, 0],
            [x, y, 1]
        ]);
        let m2:Matrix = this.xform.x(m1);
        this.xform = m2.dup();
    }
    scale(x:number, y:number) {
        let m1:Matrix = new Matrix([
            [x, 0, 0],
            [0, y, 0],
            [0, 0, 1]
        ]);
        let m2:Matrix = this.xform.x(m1);
        this.xform = m2.dup();
    }
}