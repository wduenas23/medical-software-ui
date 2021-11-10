import { HttpClient, HttpResponse, HttpResponseBase } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { FormOfPayment, Income, IncomeResponse, MedicalServices, ServiceCategory, SummaryTransaction } from '../interfaces/medicalService.interface';

@Injectable({
  providedIn: 'root'
})
export class MedsoftService {

  private baseUrl: string = environment.baseUrl;


  obtenerFormasDePago(): Observable<FormOfPayment[]>{
    return this.http.get<FormOfPayment[]>(`${this.baseUrl}/forms-of-payment/all`);
  }

  obtenerServiciosMedicos(): Observable<MedicalServices[]>{
    return this.http.get<MedicalServices[]>(`${this.baseUrl}/medical-services/all`);
  }

  obtenerServiciosMedicosActivos(): Observable<MedicalServices[]>{
    return this.http.get<MedicalServices[]>(`${this.baseUrl}/medical-services/all-active`);
  }


  obtenerCategoriasServiciosMedicos(): Observable<ServiceCategory[]>{
    return this.http.get<ServiceCategory[]>(`${this.baseUrl}/service-category/all`);
  }

  obtenerServicioPorId(id: number): Observable<MedicalServices>{
    return this.http.get<MedicalServices>(`${this.baseUrl}/medical-services/byId?id=${id}`);
  }

  obtenerServiciosMedicosPromo(): Observable<MedicalServices[]>{
    return this.http.get<MedicalServices[]>(`${this.baseUrl}/medical-services/promotions`);
  } 

  guardarIngreso(ingreso: Income): Observable<IncomeResponse>{
    return this.http.post<IncomeResponse>(`${this.baseUrl}/income/save`,ingreso);
  }

  obtenerResumenDiarioYMensual(): Observable<SummaryTransaction>{
    return this.http.get<SummaryTransaction>(`${this.baseUrl}/summary/daily-monthly`);
  }

  editarServicioMedico(servicioMedico: MedicalServices): Observable<HttpResponse<MedicalServices>>{
    return this.http.post<MedicalServices>(`${this.baseUrl}/medical-services/edit`,servicioMedico,{observe: 'response'});
  }

  constructor(private http: HttpClient) { }
}
