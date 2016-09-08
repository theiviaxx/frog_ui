import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginComponent }   from './login.component';
import { UserService } from './user.service';
import { userRouting } from './user.routing';

@NgModule({
    imports: [
        CommonModule,
        userRouting
    ],
    exports: [],
    declarations: [
        LoginComponent
    ],
    providers: [
        UserService
    ],
})
export class UserModule { }
