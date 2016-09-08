import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, HostListener } from '@angular/core';
import { NgStyle } from '@angular/common';

import { SelectionService } from './selection.service';

import { Point, Matrix, Rect } from '../shared';


@Component({
    selector: 'selection-marquee',
    template: `<div #canvas [ngStyle]="{'display': (isMouseDown) ? 'block':'none'}"></div>`,
    styles: [
        'div { position: absolute; border: 1px solid rgb(51,153,255); background: rgba(51, 153, 255, 0.5); z-index: 1000; }'
    ],
    directives: [NgStyle]
})
export class SelectionComponent implements OnInit, AfterViewInit {
    @ViewChild('canvas') canvas: ElementRef;
    private element: HTMLElement;
    private isMouseDown: boolean;
    private origin: Point;
    private active: boolean;
    private rect: Rect;

    constructor(canvas: ElementRef, private service: SelectionService) {
        this.origin = new Point();
        this.active = false;
        this.rect = new Rect(0, 0, 0, 0);
    }

    ngOnInit() {
        // console.log(this);
    }
    ngAfterViewInit() {
        this.element = this.canvas.nativeElement;
    }
    @HostListener('window:mouseup')
    up() {
        this.isMouseDown = false;
    }
    @HostListener('window:mousedown', ['$event'])
    down(event:MouseEvent) {
        if (event.button == 0) {
            this.isMouseDown = true;
            this.origin.x = event.clientX;
            this.origin.y = event.clientY;
            this.rect.zero();
            this.render();
        }
    }
    @HostListener('window:mousemove', ['$event'])
    move(event:MouseEvent) {
        if (this.isMouseDown && event.shiftKey) {
            event.preventDefault();
            let x:number = event.clientX - this.origin.x;
            let y:number = event.clientY - this.origin.y;
            this.rect.width = 0;
            this.rect.height = 0;

            if (x > 0) {
                this.rect.width = x;
                this.rect.x = this.origin.x;
            }
            else {
                this.rect.width = Math.abs(x);
                this.rect.x = this.origin.x + x;
            }
            if (y > 0) {
                this.rect.height = y;
                this.rect.y = this.origin.y;
            }
            else {
                this.rect.height = Math.abs(y);
                this.rect.y = this.origin.y + y;
            }
            this.service.setRect(this.rect);

            this.render();
        }
    }
    render() {
        let style = '';
        style += 'top: ' + (this.rect.top + window.scrollY) + 'px;';
        style += 'left: ' + this.rect.left + 'px;';
        style += 'width: ' + this.rect.width + 'px;';
        style += 'height: ' + this.rect.height + 'px;';
        this.element.setAttribute('style', style);
    }
    // private selectItems() {
    //     let elements = $('thumbnail').each(function(index, element) {
    //         let r = element.getBoundingClientRect();
    //         let rect = new Rect(r.left, r.right, r.width, r.height);
    //         if (this.rect.intersects(rect)) {
    //             element.setAttribute('style', 'border: 1px solid #fff');
    //         }
    //     })
    // }
}