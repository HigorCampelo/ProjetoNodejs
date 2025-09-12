//const fastify = require('fastify')
//const crypto = require('crypto')

import fastify from 'fastify'
import { validatorCompiler, serializerCompiler, type ZodTypeProvider, jsonSchemaTransform } from 'fastify-type-provider-zod'
import { fastifySwagger } from '@fastify/swagger'
import scalarAPIReference from '@scalar/fastify-api-reference'
import { getCoursesRoute } from './src/routes/get-courses.ts'
import { createCoursesRoute } from './src/routes/create-course.ts'
import { getCourseByIdRoute } from './src/routes/get-course-by-id.ts'

const server = fastify({
    logger: {
        transport: {
             target: 'pino-pretty',
                 options:{
                      translateTime: 'HH:MM:ss Z',
                      ignore: 'pid, hostname',
                 },
        },
    },
}).withTypeProvider<ZodTypeProvider>()

// Documentação da API
if(process.env.NODE_ENV !== 'production'){
    
        server.register(fastifySwagger, {
            openapi: {
                info: {
                        title: 'Desafio Node.js',
                        version: '1.0.0',
                }
            },
            transform: jsonSchemaTransform, 
        }),

        server.register(scalarAPIReference, {
            routePrefix: '/docs',
            configuration: {
                theme: 'mars'
            } // optional, default to '/api-    
        })
}

server.setSerializerCompiler(serializerCompiler)
server.setValidatorCompiler(validatorCompiler)

server.register(getCoursesRoute)
server.register(getCourseByIdRoute)
server.register(createCoursesRoute)


// server.delete('/courses/:id', async(request, reply) => {

//     type Params = {
//         id: string
//     }

//     const params = request.params as Params
//     const courseId = params.id

//     const index = await db.delete(courses).where(eq(courses.id, courseId)).returning();

//     if(index.length > 0){
    
//         return reply.status(200).send("Excluído com sucesso")
//     }
//     // 404 não encontrado
//     return reply.status(204).send()
// })


server.listen({port:3333}).then(() => {
    console.log('HTTP server running')
})