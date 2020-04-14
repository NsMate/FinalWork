import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Partner } from 'src/app/models/BusinessModels/Partner/partner';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({ 
    'Content-Type': 'application/json',
  })
};

@Injectable({
  providedIn: 'root'
})
export class PartnerService {

  private partnerUrl:string = "http://localhost:8080/partners";

  constructor(
    private http: HttpClient
  ) { }

  getPartners(): Promise<Partner[]>{
    return this.http.get<Partner[]>(`${this.partnerUrl}`, httpOptions).toPromise();
  }

  getPartner(id: number): Promise<Partner>{
    return this.http.get<Partner>(`${this.partnerUrl}/${id}`, httpOptions).toPromise();
  }

  updatePartner(partner: Partner): Promise<Partner>{
    return this.http.put<Partner>(`${this.partnerUrl}/${partner.id}`, partner,  httpOptions).toPromise();
  }

  createPartner(partner: Partner): Promise<Partner>{
    return this.http.post<Partner>(`${this.partnerUrl}`, partner,  httpOptions).toPromise();
  }

  deletePartner(id: number): Promise<Partner>{
    return this.http.delete<Partner>(`${this.partnerUrl}/${id}`, httpOptions).toPromise();
  }

  getPartnersByInput(input: string): Observable<Partner[]>{
    return this.http.get<Partner[]>(`${this.partnerUrl}/input/${input}`, httpOptions);
  }

  getOwnCompany(): Promise<Partner>{
    return this.http.get<Partner>(`${this.partnerUrl}/own`, httpOptions).toPromise();
  }

  getOutsidePartners(): Promise<Partner[]>{
    return this.http.get<Partner[]>(`${this.partnerUrl}/outsidePartners`,httpOptions).toPromise();
  }
}
