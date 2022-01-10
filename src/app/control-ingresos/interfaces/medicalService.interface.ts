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
    valid:      boolean;
    trxdId:      number;
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
    services:       MedicalServices[];
    totals:         Totales[];
    formOfPayment:  FormOfPayment;
    txDate:         Date ;
    discount:       number; 
    id:             number | undefined;
    paymentDetails: PaymentDetails[];
    patient: Patient;
  }

export interface Patient{
  name:           string;
	lastName:       string;
	phone:          string;
	address:        string;
	identification: string;
	birthday:       string;
  id:             number;
}  


export interface  PaymentDetails{
    pdId:         number;
    txId:         number | undefined;
    ptId:         number;
    description:  string | null;
    amount:       number | undefined;
}

export interface IncomeResponse {
    code: string;
    message: string;
    subTotalClient: number;
    txTotal:        number;
    paymentType:    string;
    paymentId:      number;
    txId:           number;
    discount:       number;
    services:       MedicalServices[];
    paymentDetails: PaymentDetails[];
    patient: Patient;
    date:           Date;
}  


export interface SummaryTransaction{
  dailySummary: number;
  monthlySummary: number;
  rangeSummary: number;
}

export interface Transaction {
  item: string;
  cost: number;
}

export interface Producto{
  id:           number;
	categoryId:   number;
  prdCode:      string;
	categoryName: string;
	name:         string;
	description:  string;
	inventory:    number;
	cost:         number;
	sellingPrice: number;
	valid:        boolean;
}

export interface CatProductos {
  id:   number;
  name: string;
}