import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login.component';

export const userRoutes: Routes = [
    { path: ':login', component: LoginComponent }
];

export const userRoutingProviders: any[] = [];
export const userRouting = RouterModule.forChild(userRoutes);
