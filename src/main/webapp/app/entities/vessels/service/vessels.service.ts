import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IVessels, NewVessels } from '../vessels.model';

export type PartialUpdateVessels = Partial<IVessels> & Pick<IVessels, 'id'>;

export type EntityResponseType = HttpResponse<IVessels>;
export type EntityArrayResponseType = HttpResponse<IVessels[]>;

@Injectable({ providedIn: 'root' })
export class VesselsService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/vessels');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(vessels: NewVessels): Observable<EntityResponseType> {
    return this.http.post<IVessels>(this.resourceUrl, vessels, { observe: 'response' });
  }

  update(vessels: IVessels): Observable<EntityResponseType> {
    return this.http.put<IVessels>(`${this.resourceUrl}/${this.getVesselsIdentifier(vessels)}`, vessels, { observe: 'response' });
  }

  partialUpdate(vessels: PartialUpdateVessels): Observable<EntityResponseType> {
    return this.http.patch<IVessels>(`${this.resourceUrl}/${this.getVesselsIdentifier(vessels)}`, vessels, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IVessels>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IVessels[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getVesselsIdentifier(vessels: Pick<IVessels, 'id'>): number {
    return vessels.id;
  }

  compareVessels(o1: Pick<IVessels, 'id'> | null, o2: Pick<IVessels, 'id'> | null): boolean {
    return o1 && o2 ? this.getVesselsIdentifier(o1) === this.getVesselsIdentifier(o2) : o1 === o2;
  }

  addVesselsToCollectionIfMissing<Type extends Pick<IVessels, 'id'>>(
    vesselsCollection: Type[],
    ...vesselsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const vessels: Type[] = vesselsToCheck.filter(isPresent);
    if (vessels.length > 0) {
      const vesselsCollectionIdentifiers = vesselsCollection.map(vesselsItem => this.getVesselsIdentifier(vesselsItem)!);
      const vesselsToAdd = vessels.filter(vesselsItem => {
        const vesselsIdentifier = this.getVesselsIdentifier(vesselsItem);
        if (vesselsCollectionIdentifiers.includes(vesselsIdentifier)) {
          return false;
        }
        vesselsCollectionIdentifiers.push(vesselsIdentifier);
        return true;
      });
      return [...vesselsToAdd, ...vesselsCollection];
    }
    return vesselsCollection;
  }
}
