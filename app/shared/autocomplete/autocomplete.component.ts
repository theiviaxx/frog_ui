import { Component, ElementRef, Input, Output, EventEmitter, OnInit } from '@angular/core';

import { TagsService } from '../tags/tags.service';
import { Tag } from '../models';

@Component({
    selector: 'autocomplete',
    template: `
        <div>
            <div class="input-field col s12">
                <input id="search" type="search" class="validate filter-input input" [(ngModel)]=query (keyup)="filter($event)" (keyup.enter)="select()">
                <label for="search"><i class="material-icons">search</i></label>
                <i class="material-icons">close</i>
            </div>
            <ul class='autocomplete-content dropdown-content'>
                <li *ngFor="let item of filteredList; let idx = index" [class.complete-selected]="idx == selectedIndex"><a (click)="select($event, item)">{{item.name}}</a></li>
            </ul>
        </div>`,
    styles: [
        '.autocomplete-content { position: relative; }',
        '.complete-selected { background-color: #eee; }'
    ],
    host: {
        '(document:click)': 'handleClick($event)'
    }
})
export class AutocompleteComponent implements OnInit {
    @Output() onSelect = new EventEmitter<any>();
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
    select(event: any, tag: Tag) {
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
        let obj = {
            tag: tag,
            event: event
        }
        this.onSelect.emit(obj);
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