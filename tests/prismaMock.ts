// tests/prismaMock.ts
import { PrismaClient } from '@prisma/client'
import { mockDeep, DeepMockProxy } from 'jest-mock-extended'
import prisma from '../src/config/index'

jest.mock('../src/config/indexprismaClient', () => ({
    __esModule: true,
    default: mockDeep<PrismaClient>(),
}))

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>