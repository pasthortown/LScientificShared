import { HeaderComponent } from './header/header.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';

@NgModule({
    imports: [
        CommonModule,
        NgbModule.forRoot(),
        LayoutRoutingModule,
    ],
    declarations: [LayoutComponent, HeaderComponent]
})
export class LayoutModule {}
