import { Component, ElementRef, Output, EventEmitter, OnInit } from '@angular/core';

import { TagsService } from './tags.service';
import { Tag } from '../shared/iitem';

@Component({
    selector: 'autocomplete',
    template: `
        <div class="container" >
            <div class="input-field col s12">
              <input id="search" type="text" class="validate filter-input" [(ngModel)]=query (keyup)="filter($event)" (keyup.enter)="select()">
              <label for="search">Search</label>
            </div>
            <ul class='autocomplete-content dropdown-content'>
                <li *ngFor="let item of filteredList; let idx = index" [class.complete-selected]="idx == selectedIndex"><a (click)="select(item)">{{item.name}}</a></li>
            </ul>
            <!--<div class="suggestions" *ngIf="filteredList.length > 0">
                <ul *ngFor="let item of filteredList; let idx = index" >
                    <li [class.complete-selected]="idx == selectedIndex">
                        <a (click)="select(item)">{{item.name}}</a>
                    </li>
                </ul>
            </div>-->
        </div>`,
    styles: [
        '.autocomplete-content { position: relative; }'
    ],
    host: {
        '(document:click)': 'handleClick($event)'
    }
})
export class AutocompleteComponent implements OnInit {
    @Output() onSelect = new EventEmitter<Tag>();
    private tags: Tag[];
    private selectedIndex: number;
    public query: string;
    public filteredList: Tag[];
    public elementRef: ElementRef;

    constructor(element: ElementRef, private service: TagsService) {
        this.tags = [];
        this.filteredList = [];
        this.query = '';
        this.selectedIndex = -1;
        this.elementRef = element;
        
        service.tags.subscribe({
            next: (items) => {
                this.tags = items;
            }
        });
    }
    ngOnInit() {
        this.service.get();
    }
    filter(event) {
        if (event.code === "ArrowDown" && this.selectedIndex < this.filteredList.length) {
            this.selectedIndex++;
        }
        else if (event.code === "ArrowUp" && this.selectedIndex > 0) {
            this.selectedIndex--;
        }
        else {
            if (this.query !== '') {
                this.filteredList = this.tags.filter(function(tag) {
                    return tag.name.indexOf(this.query.toLowerCase()) > -1;
                }.bind(this));
            }
            else {
                this.filteredList = [];
            }
        }
    }
    select(tag: Tag) {
        if (!tag) {
            if (this.selectedIndex === -1) {
                tag = new Tag(0, this.query, false);
            }
            else {
                tag = this.filteredList[this.selectedIndex];
            }
        }
        this.query = '';
        this.filteredList = [];
        this.onSelect.emit(tag);
    }
    handleClick(event) {
        let clickedComponent = event.target;
        let inside = false;
        do {
            if (clickedComponent === this.elementRef.nativeElement) {
                inside = true;
            }
            clickedComponent = clickedComponent.parentNode;
        }
        while (clickedComponent) {
            if (!inside) {
                this.filteredList = [];
            }
        }
    }
}