import { Router, Response, Request } from 'express'
import { PrismaClient } from '@prisma/client'
import { Employee } from '@/helpers/types'
import tryCatch from '../helpers/handleRequest'

const prisma = new PrismaClient()

const { employee } =  prisma

const router = Router()

router
.get('/', tryCatch(async (req: Request, res: Response) => {
  const employees = await employee.findMany()

  return res.status(200).json(employees)
}))
.post('/', tryCatch(async (req: Request, res: Response) => {
  const entity: Employee = req.body

  const newEmployee = await employee.create({
    data: entity
  })

  return res.status(201).json(newEmployee)
}))
.get('/:id', tryCatch(async (req: Request, res: Response) => {
  const { id } = req.params
  const data = await employee.findFirst({ where: { id } })

  return res.status(200).json(data)
}))
.patch('/:id', tryCatch(async (req: Request, res: Response) => {
  const { id } = req.params

  if(!id)
    return res.status(400).json({ message: 'Required parameter "id" is missing!' })
  
  const empl = await employee.findFirst({ where: { id } })

  if(!empl)
  return res.status(404).json({ message: 'Employee not found' })
  
  const changes: Partial<Employee> = req.body

  const updatedEmployee = await employee.update({
    where: { id},
    data: changes
  })

  return res.status(200).json(updatedEmployee)
}))
.delete('/:id', tryCatch(async (req: Request, res: Response) => {
  const { id } = req.params
  await employee.delete({ where: { id } })

  return res.status(200).json({ message: 'User deleted' })
}))

export default router