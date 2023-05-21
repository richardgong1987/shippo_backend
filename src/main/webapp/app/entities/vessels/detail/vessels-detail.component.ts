import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IVessels } from '../vessels.model';

@Component({
  selector: 'jhi-vessels-detail',
  templateUrl: './vessels-detail.component.html',
})
export class VesselsDetailComponent implements OnInit {
  vessels: IVessels | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ vessels }) => {
      this.vessels = vessels;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
