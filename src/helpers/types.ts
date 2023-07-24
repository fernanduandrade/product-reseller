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
  quantity: number;
}

export interface SaleMessage {
  queueId: string, 
  data: Sale;
}


export interface Queue {
  id: string;
  dateCreated: Date;
  queueId: string;
  totalMessages: number;
  statusId: QueueStatus

}

export enum QueueStatus {
  IN_PROGRESS = 1,
  FINISHED = 2,
  ERROR_WHILE_PROCESSING_THE_MESSAGES = 3
}

export interface MessagesResponse {
  payload: string
}

export interface Message {
  messageId: string;
  sale: any
}