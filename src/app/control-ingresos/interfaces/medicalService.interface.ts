export interface FormOfPayment {
    id:          number;
    description: string;
}

export interface MedicalServices {
    id:          number;
    description: string;
    cost:        number;
    category:    number;
}

export interface Totales{
    title: string;
    value: number;
  }

export interface Income {
    nombres:        string;
    apellidos:      string;
    telefono:       string;
    services:       MedicalServices[];
    totals:         Totales[];
    formOfPayment:  FormOfPayment;
    txDate:         Date ;
    discount:       number; 
  }

export interface IncomeResponse {
    code: string;
    message: string;
}  