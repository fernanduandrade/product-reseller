import csvParse from 'csv-parse'
import { Sale } from './types'

const parser = csvParse.parse

export const getSalesFromCsv = (csv: Buffer) => {
  const sales: Sale[] = []
  parser(csv, async (err: any, records: string[]) => {
    if (err) {
      console.error(err)
      return null
    }

    const recordsLength = records.length - 1;    
    for (let i = 1; i < recordsLength; i++) {
      const sale: Sale = {
        productName: records[i][0],
        dateSale: records[i][1],
        employeeCode: records[i][2],
        totalPrice: parseInt(records[i][3], 10),
        quantity: parseInt(records[i][4], 10),
      }

      sales.push(sale)
    }

  })
  return sales
}