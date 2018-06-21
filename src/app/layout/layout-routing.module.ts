import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';

const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            //{ path: '', redirectTo: 'main' },
            //{ path: 'profile', loadChildren: './dashboard/dashboard.module#DashboardModule' },
            //{ path: 'main', loadChildren: './main/main.module#MainModule' }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LayoutRoutingModule {}
