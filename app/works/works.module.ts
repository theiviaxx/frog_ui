import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { WorksComponent } from './works.component';
import { WorksListComponent } from './works-list.component';
import { WorksThumbnailComponent } from './works-thumbnail.component';
import { WorksService } from './works.service';
import { worksRouting, worksRoutingProviders } from './works.routing';

import { FilterComponent } from './filter.component';

import { TagsComponent } from './tags.component';
import { TagsService } from './tags.service';

import { SelectionComponent } from './selection.component';
import { SelectionService } from './selection.service';

import { GalleryService } from './gallery.service';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        worksRouting
    ],
    declarations: [
        WorksComponent,
        WorksThumbnailComponent,
        WorksListComponent,
        FilterComponent,
        TagsComponent,
        SelectionComponent
    ],
    providers: [
        WorksService,
        TagsService,
        SelectionService,
        GalleryService
    ]
})
export class WorksModule {}
