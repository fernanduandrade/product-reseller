import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { Employee } from '@/helpers/types'

const prisma = new PrismaClient()

const { employee } =  prisma

const router = Router()

router
.get('/', async (req, res) => {
  const employees = await employee.findMany()

  return res.status(200).json(employees)
})
.post('/', async (req, res) => {
  const entity: Employee = req.body

  const newEmployee = await employee.create({
    data: entity
  })

  return res.status(201).json(newEmployee)
})

export default router