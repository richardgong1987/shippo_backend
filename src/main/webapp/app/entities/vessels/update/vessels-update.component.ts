import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { VesselsFormService, VesselsFormGroup } from './vessels-form.service';
import { IVessels } from '../vessels.model';
import { VesselsService } from '../service/vessels.service';

@Component({
  selector: 'jhi-vessels-update',
  templateUrl: './vessels-update.component.html',
})
export class VesselsUpdateComponent implements OnInit {
  isSaving = false;
  vessels: IVessels | null = null;

  editForm: VesselsFormGroup = this.vesselsFormService.createVesselsFormGroup();

  constructor(
    protected vesselsService: VesselsService,
    protected vesselsFormService: VesselsFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ vessels }) => {
      this.vessels = vessels;
      if (vessels) {
        this.updateForm(vessels);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const vessels = this.vesselsFormService.getVessels(this.editForm);
    if (vessels.id !== null) {
      this.subscribeToSaveResponse(this.vesselsService.update(vessels));
    } else {
      this.subscribeToSaveResponse(this.vesselsService.create(vessels));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IVessels>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(vessels: IVessels): void {
    this.vessels = vessels;
    this.vesselsFormService.resetForm(this.editForm, vessels);
  }
}
