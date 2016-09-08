import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { GalleryService, Gallery } from './gallery.service';
import { UserService } from '../user/user.service';

@Component({
    selector: 'works-nav',
    template: `
    <ul id="navigation_sidenav" class="side-nav">
        <li>
            <div class="userView">
                <img class="background" src="app/works/images/navbg.png">
                <a href="#!name"><span class="white-text name">{{userservice.user.name}}</span></a>
                <a href="#!email"><span class="white-text email">{{userservice.user.email}}</span></a>
            </div>
        </li>
        <li><i class="material-icons">cloud_upload</i>Upload</li>
        <li><div class="divider"></div></li>
        <li *ngFor="let gallery of galleries">
            <span href="" (click)="switchGallery(gallery)">
                <i class="material-icons">{{securityIcon(gallery)}}</i>{{gallery.title}}
                <i class="material-icons">image</i>{{gallery.image_count}}
                <i class="material-icons">videocam</i>{{gallery.video_count}}
            </span>
        </li>
    </ul>
    <a href="#" data-activates="navigation_sidenav" class="button-collapse" style="position: fixed; width: 32px; z-index: 950;">
        <i class="small material-icons">menu</i>
    </a>
    `
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
        $(".button-collapse").sideNav();
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
        $('#navigation_sidenav').sideNav('hide');
    }
}