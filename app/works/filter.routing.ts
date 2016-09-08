import { Routes, RouterModule } from '@angular/router';

import { FilterComponent } from './filter.component';

const filterRoutes: Routes = [
    { path: 'filter/:bucket1', component: FilterComponent }
];

export const filterRouting = RouterModule.forChild(filterRoutes);
