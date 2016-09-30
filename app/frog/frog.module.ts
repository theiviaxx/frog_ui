import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
    WorksComponent,
    WorksListComponent,
    WorksThumbnailComponent,
    WorksDetailComponent,
    WorksService,
    NavigationComponent,
    FilterComponent,
    SelectionComponent,
    GalleryService,
    worksRouting
} from './works/index';

import {
    TagsComponent, 
    TagsService, 
    SelectionService, 
    SelectionDetailComponent,
    CapitalizePipe, 
    TagArtistFilterPipe, 
    AutocompleteComponent, 
    CommentComponent,
    CommentURLPipe
} from './shared/index';

import {
    ViewerComponent,
    viewerRouting,
    ImageComponent,
    VideoComponent
} from './viewer/index';

import {
    UserService,
    LoginComponent,
    LogoutComponent,
    userRouting
} from './user/index';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        worksRouting,
        userRouting,
        viewerRouting
    ],
    declarations: [
        WorksComponent,
        WorksListComponent,
        WorksThumbnailComponent,
        WorksDetailComponent,
        NavigationComponent,
        FilterComponent,
        SelectionComponent,

        TagsComponent,   
        SelectionDetailComponent,
        AutocompleteComponent, 
        CommentComponent,
        CommentURLPipe,
        CapitalizePipe, 
        TagArtistFilterPipe, 

        ViewerComponent,
        ImageComponent,
        VideoComponent,

        LoginComponent,
        LogoutComponent
    ],
    providers: [
        WorksService,
        TagsService,
        SelectionService,
        GalleryService,
        UserService
    ]
})
export class FrogModule {}
