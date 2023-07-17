export interface Employee {
  name: string;
  active: boolean;
  registrationDate: Date;
  documentId: string;
}

export interface Sale {
  employeeName?: string;
  productName: string;
  dateSale: Date;
  employeeCode: string;
  totalPrice: number;
  quantity: number
}
