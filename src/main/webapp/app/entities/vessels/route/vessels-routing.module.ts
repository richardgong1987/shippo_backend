import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { VesselsComponent } from '../list/vessels.component';
import { VesselsDetailComponent } from '../detail/vessels-detail.component';
import { VesselsUpdateComponent } from '../update/vessels-update.component';
import { VesselsRoutingResolveService } from './vessels-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const vesselsRoute: Routes = [
  {
    path: '',
    component: VesselsComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: VesselsDetailComponent,
    resolve: {
      vessels: VesselsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: VesselsUpdateComponent,
    resolve: {
      vessels: VesselsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: VesselsUpdateComponent,
    resolve: {
      vessels: VesselsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(vesselsRoute)],
  exports: [RouterModule],
})
export class VesselsRoutingModule {}
