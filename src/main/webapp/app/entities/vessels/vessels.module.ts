import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { VesselsComponent } from './list/vessels.component';
import { VesselsDetailComponent } from './detail/vessels-detail.component';
import { VesselsUpdateComponent } from './update/vessels-update.component';
import { VesselsDeleteDialogComponent } from './delete/vessels-delete-dialog.component';
import { VesselsRoutingModule } from './route/vessels-routing.module';

@NgModule({
  imports: [SharedModule, VesselsRoutingModule],
  declarations: [VesselsComponent, VesselsDetailComponent, VesselsUpdateComponent, VesselsDeleteDialogComponent],
})
export class VesselsModule {}
