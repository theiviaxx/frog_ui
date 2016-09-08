import { Component, OnInit, AfterViewInit } from '@angular/core';

import { SelectionService } from './selection.service';
import { WorksService } from './works.service';
import { IItem, Tag } from '../shared/iitem';
import { TagsComponent } from './tags.component';
import { TagsService } from './tags.service';
import { AutocompleteComponent } from './autocomplete.component';
import { TagArtistFilterPipe } from './tag-artist-filter.pipe';

@Component({
    selector: 'selection-detail',
    template: `
    <ul id="selection_sidenav" class="side-nav">
        <li *ngFor="let item of items">
            <div class='row'>
                <div class='col s4'>
                    <img class="circle responsive-img" src="http://127.0.0.1:8000{{item.thumbnail}}">
                </div>
                <div class='col s8'>
                    {{item.title}}
                </div>
            </div>
        </li>
        <li><a href="http://127.0.0.1:8000/frog/download?guids={{guidString()}}"><i class="material-icons">cloud download</i>Download</a></li>
        <li>
            <tag *ngFor="let tag of tags" [item]="tag.id" (onClose)="removeTag($event)"></tag>
            <autocomplete (onSelect)="addTag($event)"></autocomplete>
        </li>
    </ul>
    <div id="selection_actions">
        <a id="remove_button" (click)="removePrompt()" [style.zIndex]="zIndex()" class="button-collapse btn-floating btn-large waves-effect waves-light red modal-trigger"><i class="material-icons">delete</i></a>
        <a href="#" data-activates="selection_sidenav" [style.zIndex]="zIndex()" class="button-collapse btn-floating btn-large waves-effect waves-light green"><i class="material-icons">menu</i></a>
    </div>
    <div id="remove_prompt" class="modal">
        <div class="modal-content">
            <h4>Remove Items From Gallery?</h4>
            <p>Are you sure you wish to remove ({{items.length || 0}}) from the current gallery?</p>
            <small>This does not delete anything, it simply removes the items</small>
        </div>
        <div class="modal-footer">
            <a (click)="removeItems()" class=" modal-action modal-close waves-effect waves-green btn-flat">Ok</a>
            <a (click)="cancelPrompt()" class=" modal-action modal-close waves-effect waves-red btn-flat">Cancel</a>
        </div>
    </div>
    `,
    styles: [
        '#selection_actions a {position: fixed; top: 12px; right: 12px;}',
        '#selection_actions #remove_button { right: 100px; }',
        '#remove_prompt { z-index: 1000; }'
    ],
    directives: [TagsComponent, AutocompleteComponent],
    pipes: [TagArtistFilterPipe]
})
export class SelectionDetailComponent implements OnInit, AfterViewInit {
    enabled: boolean = false;
    private items: IItem[];
    private tags: Tag[];
    private initialized: boolean = false;

    constructor(private service: SelectionService, private works: WorksService, private tagssservice: TagsService) {
        this.tags = [];
        this.items = [];
        service.selection.subscribe(items => {
            this.items = items;
            this.enabled = items.length > 0;
            this.aggregateTags();
        });
    }

    ngOnInit() {
        // console.log(this);
    }
    ngAfterViewInit() {
        // $('#selection_sidenav').sideNav({edge: 'right'});
    }
    zIndex() {
        return (this.enabled) ? 950 : 0;
    }
    aggregateTags() {
        this.tags.length = 0;
        let ids = [];
        
        for (let item of this.items) {
            for (let tag of item.tags) {
                if (ids.indexOf(tag.id) == -1) {
                    this.tags.push(<Tag>tag);
                    ids.push(tag.id);
                }
            }
        }
    }
    removeTag(tag) {
        this.works.editTags(this.items, [], [tag]).subscribe();
    }
    guidString() {
        if (this.items) {
            return this.items.map(function(_) {return _.guid}).join(',');
        }
        return '';
    }
    show() {
        if (!this.initialized) {
            $('#selection_sidenav').sideNav({edge: 'right'});
            this.initialized = true;
        }
        $('#selection_sidenav').sideNav('show');
    }
    removePrompt() {
        $('#remove_prompt').openModal();
    }
    cancelPrompt() {
        $('#remove_prompt').closeModal();
    }
    removeItems() {
        this.cancelPrompt();
        this.works.remove(this.items).subscribe();
    }
    addTag(tag: Tag) {
        let name = tag.id.toString();
        this.tagssservice.create(name).subscribe(tag => {
            this.works.editTags(this.items, [tag], []);
            let found = false;
            for (let t of this.tags) {
                if (tag.id == t.id) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                this.tags.push(tag);
            }
        });
        Materialize.toast('Tag added', 4000);
    }
}