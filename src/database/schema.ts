
import { uniqueIndex } from 'drizzle-orm/pg-core'
import {pgTable, uuid, text, timestamp} from 'drizzle-orm/pg-core'
import ta from 'zod/v4/locales/ta.js'

export const users = pgTable('users', {
    id: uuid().primaryKey().defaultRandom(),
    name: text().notNull(),
    email: text().notNull().unique(),
})

export const courses = pgTable('courses', {
    id: uuid().primaryKey().defaultRandom(),
    title: text().notNull().unique(),
    description: text(),
})

//tabela de matriculas(enrollments) que vai referenciar os usuarios e cursos
// Relacionamento N para N (muitos para muitos) no qual sempre gera uma tabela intermediaria/pivot
export const enrollments = pgTable('enrollments', {
   id: uuid().primaryKey().defaultRandom(), 
   userId: uuid().notNull().references(() => users.id),
   courseId: uuid().notNull().references(() => courses.id),
   createdAt: timestamp({ withTimezone: true}).notNull().defaultNow(),
}, table => [
     // comando para garantir que um usuario não se matricule duas vezes no mesmo curso
     uniqueIndex().on(table.userId, table.courseId)
])

//UTC grava no banco com esse horario
//Brasil usa UTC-3