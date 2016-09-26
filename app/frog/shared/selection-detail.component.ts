import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

import { SelectionService } from './selection.service';
import { IItem, Tag } from './models';
import { TagsComponent } from './tags.component';
import { TagsService } from './tags.service';
import { TagArtistFilterPipe } from './tag-artist-filter.pipe';
import { AutocompleteComponent } from './autocomplete.component';

import { WorksService } from '../works/index';

@Component({
    selector: 'selection-detail',
    template: `
    <ul id="selection_sidenav" class="side-nav grey darken-4 grey lighten-4-text">
        <li class="stack">
            <img *ngFor="let item of items | slice:0:10; let i = index" [style.left]="offset(i)" [style.top]="offset(i)" class="z-depth-1" src="{{item.thumbnail}}">
        </li>
        <h4 class="title">
            <i class="material-icons green-text">photo_size_select_large</i> {{items.length}} Selected Items
        </h4>
        <div class="row">
            <div class="col s6">
                <a href="/frog/download?guids={{guidString()}}" class="waves-effect waves-light btn blue"><i class="material-icons left">cloud</i> Download</a>
            </div>
            <div class="col s6">
                <a class="waves-effect waves-light btn blue"><i class="material-icons left">collections</i> Add to Collection</a>
            </div>
        </div>
        <li>
            <div class="tags">
                <h4 class="title">
                    <i class="material-icons green-text">label</i> Tags
                </h4>
                <tag *ngFor="let tag of tags" [item]="tag.id" (onClose)="removeTag($event)" (click)="navigateToTag(tag)"></tag>
                <autocomplete (onSelect)="addTag($event)"></autocomplete>
            </div>
        </li>
    </ul>
    <div id="selection_actions" [hidden]="!enabled">
        <a id="remove_button" (click)="removePrompt()" class="btn-floating btn-large waves-effect waves-light red modal-trigger"><i class="material-icons">delete</i></a>
        <a id="selection_button" data-activates="selection_sidenav" class="btn-floating btn-large waves-effect waves-light green"><i class="material-icons">menu</i></a>
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
        '#selection_actions { position: fixed; top: 80px; right: 0; }',
        '#selection_actions a { margin-left: 12px; }',
        '#remove_prompt { z-index: 1000; }',
        '#selection_sidenav { padding: 20px 25px 20px 20px; }',
        'h4 { margin-top: 0px; font-weight: 300; font-size: 18px; margin-bottom: 12.5px; line-height: 1.2em; }',
        '.tags > a { display: inline-block; line-height: inherit; position: relative; }',
        'a { color: inherit; transition: all 0.2s cubic-bezier(0.55, 0.085, 0.68, 0.53); }',
        '.stack { position: relative; height: 256px; }',
        '.stack img { position: absolute; width: 128px; border: 1px solid #888; }',
        'a.btn { line-height: 36px !important; height: 36px !important; padding: inherit; margin: inherit !important; }',
        'i { vertical-align: middle; }'
    ]
})
export class SelectionDetailComponent implements OnInit, AfterViewInit {
    enabled: boolean = false;
    private items: IItem[];
    private tags: Tag[];

    constructor(private service: SelectionService, private works: WorksService, private tagssservice: TagsService, private router: Router) {
        this.tags = [];
        this.items = [];
        service.selection.subscribe(items => {
            this.items = items;
            this.enabled = items.length > 0;
            this.aggregateTags();
        });
    }

    ngOnInit() {
        
    }
    ngAfterViewInit() {
        $('#selection_button').sideNav({
            edge: 'right',
            menuWidth: 365
        });
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
    addTag(event: any) {
        let name = event.tag.id.toString();
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
    offset(index: number) {
        return index * 8 + 12;
    }
    navigateToTag(tag: Tag) {
        $('#selection_sidenav').sideNav('hide');
        this.router.navigate(['/w/' + this.works.id + '/' + tag.id]);
    }
}