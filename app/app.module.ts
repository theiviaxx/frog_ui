import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { JsonpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { routing, appRoutingProviders } from './app.routing';

import { ViewerComponent } from './viewer/viewer.component';
import { WorksModule } from './works/works.module';
import { UserModule } from './user/user.module';


@NgModule({
    imports: [
        BrowserModule,
        HttpModule,
        JsonpModule,
        ReactiveFormsModule,
        routing,
        WorksModule,
        UserModule
    ],
    declarations: [
        AppComponent,
        ViewerComponent
    ],
    providers: [
        appRoutingProviders
    ],
    bootstrap: [ AppComponent ]
})
export class AppModule {}
