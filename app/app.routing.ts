import { Routes, RouterModule } from '@angular/router';

// import { worksRoutes } from './works/works.routing';
// import { ViewerComponent } from './viewer/viewer.component';

const appRoutes: Routes = [
    // ...worksRoutes,
    // { path: 'viewer/:index/:guids', component: ViewerComponent }
];

export const appRoutingProviders: any[] = [

];

export const routing = RouterModule.forRoot(appRoutes);
