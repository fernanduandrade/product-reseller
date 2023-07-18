export interface Employee {
  name: string;
  active: boolean;
  registrationDate: Date;
  documentId: string;
}

export interface Sale {
  productName: string;
  dateSale: string;
  employeeCode: string;
  totalPrice: number;
  quantity: number
}

export interface SaleMessage {
  queueId: string, 
  sale: Sale;
}

