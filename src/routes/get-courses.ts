import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { db } from '../database/client.ts'
import { courses, enrollments } from '../database/schema.ts'
import z from 'zod'
import { asc, desc, ilike, eq, count} from 'drizzle-orm'
import { SQL } from 'drizzle-orm'
import { and } from 'drizzle-orm'



export const getCoursesRoute: FastifyPluginAsyncZod  = async (server) =>{
    server.get('/courses', {
        schema: {
           tags: ['Courses'],
           summary: 'Get all Courses',
           querystring: z.object({
               search: z.string().optional(),
               orderBy: z.enum(['id','title']).optional().default('id'),
               page: z.coerce.number().optional().default(1),
           }),
           response:{
                200: z.object({
                    courses: z.array(
                        z.object({
                           id: z.uuid(),
                           title: z.string(),
                           enrollments: z.number(),
                })
                    
                    ), 
                    total: z.number(),
            })
           } 
        },           
    } ,async (request, reply) => {

        const { search, orderBy, page } = request.query

        const conditions: SQL[] = []

        if(search){
            conditions.push(ilike(courses.title, `%${search}%`))
        }

        const [result, total] = await Promise.all([
                    db.select({
                        id: courses.id,
                        title: courses.title,
                        enrollments: count(enrollments.id),
                    }).from(courses)
                      .leftJoin(enrollments, eq(enrollments.courseId, courses.id))
                      .where(and(...conditions))
                      .orderBy(asc(courses[orderBy]))
                      .offset((page -1) * 2)
                      .limit(10)
                      .groupBy(courses.id),

                      db.$count(courses, and(...conditions)),
        ])

        //innerJoin precisa que os lados existam, se existir algum curso sem aluno, ele não traz
        //leftJoin traz todos os cursos, left precisa que o lado esquerdo exista, esquerdo é o que está no from

        return reply.send({courses: result, total})
    })
}