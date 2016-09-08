import {Component, Input, AfterViewInit, HostListener, ViewChild, ElementRef} from '@angular/core';
// import {ActivatedRoute} from 'angular2/router';
import {Point, Matrix} from '../shared/euclid';
import {IItem} from '../shared/iitem';
import {WorksService} from '../works/works.service';


@Component({
    selector: 'viewer',
    templateUrl: './app/viewer/viewer.component.html',
    styleUrls: ['./app/viewer/viewer.component.css'],
    properties: ['data']
})
export class ViewerComponent implements AfterViewInit {
    @ViewChild('canvas') canvas: ElementRef;
    @ViewChild('img') img: ElementRef;
    
    private origin: Point = new Point();
    private xform: Matrix = Matrix.Identity();
    private main: Matrix = Matrix.Identity();
    private scaleValue: number = 1.0;
    private axis: string;
    private objects: IItem[] = [];
    private index: number = 0;
    private isMouseDown: boolean = false;
    private isOpen: boolean = true;
    private ctx: CanvasRenderingContext2D;
    private fimage: HTMLImageElement;
    width: number = 0;
    height: number = 0;

    @Input() image;
    constructor(
        canvas: ElementRef,
        img: ElementRef,
        // private activatedroute: ActivatedRoute,
        private _query:WorksService) {
        this._query.results.subscribe(
            items => this.build(items)
        );
    }
    ngAfterViewInit() {
        this.ctx = this.canvas.nativeElement.getContext('2d');
        this.fimage = this.img.nativeElement;
        var self = this;
        // TODO: How to properly do this in angular2
        this.fimage.onload = this.render.bind(this);
        this._query.get(1);
    }
    build(items:IItem[]) {
        this.objects = items;
        this.render();
    }
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
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.xform = this.main = new Matrix([
            [this.objects[this.index].width, 0, 0],
            [0, this.objects[this.index].height, 0],
            [0, 0, 1]
        ]);
        this.center();
    }
    clear() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }
    render() {
        this.clear();
        if (this.objects.length == 0) {
            return;
        }
        if (this.fimage.src == "http://localhost:3000/") {
            this.fimage.src = 'http://127.0.0.1:8000' + this.objects[0].source;
        }

        this.ctx.drawImage(
            this.fimage,
            Math.floor(this.xform.elements[2][0]),
            Math.floor(this.xform.elements[2][1]),
            Math.floor(this.xform.elements[0][0]),
            Math.floor(this.xform.elements[1][1])
        )
    }
    center(scale:number = 1.0) {
        this.xform = new Matrix([
            [this.objects[this.index].width, 0, 0],
            [0, this.objects[this.index].height, 0],
            [0, 0, 1]
        ]);
        this.scale(scale, scale);
        let x: number = this.width / 2 - this.xform.elements[0][0] / 2;
        let y: number = this.height / 2 - this.xform.elements[1][1] / 2;
        this.translate(x, y);

        this.main = this.xform;
        this.render();
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
        this.center();
    }
    fitToWindow() {

    }
    download() {

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
    setImage(image:string) {

    }
    setVideo(video:Object) {

    }
    setImages(images:any[], id:number) {

    }
    setIndex(index:number) {

    }
    private loadCallback() {

    }
    private progressCallback() {

    }
    show() {

    }
    hide() {

    }

}