import { Component, Input, AfterViewInit, HostListener, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';

import { Point, Matrix, Rect } from '../shared';
import { IItem, Tag, User, Comment, SelectionService } from '../shared';

class FImage implements IItem {
    hash: string;
    tags: Tag[];
    deleted: boolean;
    image: string;
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
    comments: Comment[];
    description: string;
    selected: boolean;
}

@Component({
    selector: 'frog-image',
    template: `
    <div *ngIf="loading" class='spinner'>
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
    <img #img src="{{object.image}}" style='display: none;' />
    <canvas #canvas width="{{width}}" height="{{height}}"></canvas>`,
    styles: [
        '.spinner { position: fixed; background: rgba(0, 0, 0, 0.5); width: 100%; height: 100%; color: #fff; font-size: 36px; text-align: center; padding-top: 50%; z-index: 3001; }'
    ]
})
export class ImageComponent{
    @ViewChild('canvas') canvas: ElementRef;
    @ViewChild('img') img: ElementRef;

    private object: FImage;
    private origin: Point = new Point();
    private xform: Matrix = Matrix.Identity();
    private main: Matrix = Matrix.Identity();
    private scaleValue: number = 1.0;
    private axis: string;
    private loading: boolean = false;
    private isMouseDown: boolean = false;
    private ctx: CanvasRenderingContext2D;
    private element: HTMLImageElement;
    width: number;
    height: number;

    constructor(canvas: ElementRef, img: ElementRef, private service: SelectionService, private changeDetectionRef : ChangeDetectorRef) {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.object = new FImage();
    }
    ngAfterViewInit() {
        this.ctx = this.canvas.nativeElement.getContext('2d');
        this.element = this.img.nativeElement;
        // TODO: How to properly do this in angular2
        this.element.onload = this.resize.bind(this);
        this.service.detail.subscribe(item => {
            if (item) {
                // this.setImage(item)
                setTimeout(() => this.setImage(item), 0);
            }
        });
    }
    setImage(image: IItem) {
        this.object = <FImage>image;
        this.loading = true;
        // this.changeDetectionRef.detectChanges();
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
        }
    }
    @HostListener('window:mousemove', ['$event'])
    move(event:MouseEvent) {
        if (this.isMouseDown) {
            let x:number = event.clientX - this.origin.x;
            let y:number = event.clientY - this.origin.y;

            if (event.shiftKey) {
                if (this.axis == 'x') {
                    y = 0
                }
                else {
                    x = 0;
                }
            }

            this.xform = Matrix.Identity().x(this.main);
            this.translate(x, y);
            this.render();
        }
    }
    @HostListener('window:mousewheel', ['$event'])
    zoom(event:MouseEvent) {
        let scale:number = 1.0;
        if (event.detail > 0) {
            scale += 0.05;
        }
        else {
            scale -= 0.05;
        }
        let x:number = event.clientX;
        let y:number = event.clientY;
        this.xform = Matrix.Identity().x(this.main);
        this.translate(-x, -y);
        this.scale(scale, scale);
        this.translate(x, y);
        this.main = this.xform;
        this.render();
    }
    @HostListener('window:resize')
    resize() {
        this.loading = false;
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.xform = this.main = new Matrix([
            [this.object.width, 0, 0],
            [0, this.object.height, 0],
            [0, 0, 1]
        ]);
        this.fitToWindow();
    }
    clear() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }
    render() {
        this.clear();
        this.ctx.drawImage(
            this.element,
            Math.floor(this.xform.elements[2][0]),
            Math.floor(this.xform.elements[2][1]),
            Math.floor(this.xform.elements[0][0]),
            Math.floor(this.xform.elements[1][1])
        )
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
        this.render();
    }
    original() {
        this.center();
    }
    fitToWindow() {
        let size = this.xform.rect.fit(window.innerWidth, window.innerHeight);
        let scale = size.width / this.object.width;
        scale = (scale > 1.0) ? 1.0 : scale;
        this.center(scale);
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