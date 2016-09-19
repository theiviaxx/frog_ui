import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { GalleryService, Gallery } from './gallery.service';
import { UserService } from '../user/user.service';

@Component({
    selector: 'works-nav',
    template: `
    <ul id="navigation_sidenav" class="dropdown-content grey darken-4 lighten-4-text">
        <!--<li>
            <div class="userView">
                <img class="background" src="app/works/images/navbg.png">
                <a href="#!name"><span class="white-text name">{{userservice.user.name}}</span></a>
            </div>
        </li>
        <li>
            <a href="">
                <i class="material-icons left">cloud_upload</i>Upload
            </a>
        </li>
        <li><div class="divider"></div></li>
        <li class='divider'></li>-->
        <li *ngFor="let gallery of galleries">
            <a href="" (click)="switchGallery(gallery)">
                <i class="material-icons left">{{securityIcon(gallery)}}</i>{{gallery.title}}
            </a>
        </li>
    </ul>
    `,
    styles: [
        // 'i { vertical-align: middle; }',
        // 'a { color: #13aff0; transition: all 0.2s cubic-bezier(0.55, 0.085, 0.68, 0.53); font-weight: 300; }',
        // 'h3 { font-size: 22px; margin-bottom: 10px; margin-top: 0; font-weight: 200; line-height: 1.2em; }',
        // 'h4 { margin-top: 0px; font-weight: 300; font-size: 18px; margin-bottom: 12.5px; line-height: 1.2em; }',
        // 'h5 { text-transform: uppercase; letter-spacing: 1px; margin-top: 0px; font-weight: 300; font-size: 14px; }',
        // '.list-inline { padding-left: 0px; margin-left: -5px; list-style: none; }',
        // '.list-inline > li { display: inline-block; padding-left: 5px; padding-right: 5px; line-height: inherit; }',
        // 'hr { margin-top: 25px; margin-bottom: 25px; border-right-style: initial; border-bottom-style: initial; border-left-style: initial; border-right-color: initial; border-bottom-color: initial; border-left-color: initial; border-image-source: initial; border-image-slice: initia l; border-image-width: initial; border-image-outset: initial; border-image-repeat: initial; border-width: 1px 0px 0px; border-top: 1px solid rgb(93, 93, 93); }',
        // '.separator { height: 1.8em; }',
        // '.separator-sm { height: 0.9em; }'
    ]
})
export class NavigationComponent implements OnInit {
    private galleries: Gallery[];

    constructor(private service: GalleryService, private userservice: UserService, private router: Router) {
        service.results.subscribe(items => {
            this.galleries = items;
        });
        service.get();

        // userservice.results.subscribe(user => this.user = )
    }
    ngOnInit() {
        $("#nav_button").dropdown();
    }
    private securityIcon(gallery: Gallery) {
        switch(gallery.security) {
            case 0:
                return 'lock_open';
            case 1:
                return 'lock';
            case 2:
                return 'security';
        }
    }
    private switchGallery(gallery: Gallery) {
        this.router.navigate(['w/' + gallery.id]);
        // $('#navigation_sidenav').sideNav('hide');
    }
}