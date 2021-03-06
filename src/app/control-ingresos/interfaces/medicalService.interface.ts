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
    deleteFlag: number;
    user: string | null;
  }

  export interface IncomeSale {
    products:       Producto[];
    totals:         Totales[];
    formOfPayment:  FormOfPayment;
    txDate:         Date ;
    discount:       number; 
    id:             number | undefined;
    paymentDetails: PaymentDetails[];
    patient: Patient;
    deleteFlag: number;
    user: string | null;
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
    txSubTotal:     number;
    paymentType:    string;
    paymentId:      number;
    txId:           number;
    discount:       number;
    discountTotal:  number;
    comission:      number;
    services:       MedicalServices[];
    paymentDetails: PaymentDetails[];
    patient: Patient;
    date:           Date;
}  

export interface IncomeResponseSale {
  code: string;
  message: string;
  subTotalClient: number;
  txTotal:        number;
  txSubTotal:     number;
  paymentType:    string;
  paymentId:      number;
  txId:           number;
  discount:       number;
  discountTotal:  number;
  comission:      number;
  products:       Producto[];
  paymentDetails: PaymentDetails[];
  patient: Patient;
  date:           Date;
  saleComission:  number;
}  


export interface SummaryTransaction{
  dailySummary: number;
  monthlySummary: number;
  rangeSummary: number;
  rangeComission: number;
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
  drogueriaId:  number;
  drogueriaName: string;
	name:         string;
	description:  string;
	inventory:    number;
	cost:         number;
	sellingPrice: number;
	valid:        boolean;
  expiDate:     Date;
  promotionPrice: number;
  prdLot:       string;
  user:         string | null;
  brand:        string | null;
  comment:     string | null;
}

export interface CatProductos {
  id:   number;
  name: string;
}

export interface ProductFactoryPojo {
  id:   number;
  description: string;
  name: string;
}

export interface ReportRanges {
  startDate: Date;
  endDate:   Date;
}

export interface MedicalServiceCount {
  serviceName:  string;
  count:        number;
}

export interface ProductCount {
  prdName:  string;
  count:        number;
}

export interface Parameter{
  pmtId:        string;
  pmContext:    string;
  pmtValue:     string;
}