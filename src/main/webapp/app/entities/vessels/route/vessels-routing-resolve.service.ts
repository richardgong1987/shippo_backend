import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IVessels } from '../vessels.model';
import { VesselsService } from '../service/vessels.service';

@Injectable({ providedIn: 'root' })
export class VesselsRoutingResolveService implements Resolve<IVessels | null> {
  constructor(protected service: VesselsService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IVessels | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((vessels: HttpResponse<IVessels>) => {
          if (vessels.body) {
            return of(vessels.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
