export interface FormOfPayment {
    id:          number;
    description: string;
}

export interface MedicalServices {
    id:          number;
    description: string;
    cost:        number;
    category:    number;
    categoryName:string;
}

export interface ServiceCategory {
    id:   number;
    name: string;
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

export interface SummaryTransaction{
  dailySummary: number;
  monthlySummary: number;
}

export interface Transaction {
  item: string;
  cost: number;
}