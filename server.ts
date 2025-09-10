//const fastify = require('fastify')
//const crypto = require('crypto')

import fastify from 'fastify'
import crypto from 'node:crypto'

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
})

const courses = [
    {id: '1', title: 'Cursos de Node.js'},
    {id:'2', title: 'Cursos de React'},
    {id:'3', title: 'Cursos de React Native'},
]

server.get('/courses', () => {
    return {courses}
})

server.get('/courses/:id', (request, reply) => {

    type Params = {
        id: string
    }

    const params = request.params as Params
    const courseId = params.id

    const course = courses.find(course => course.id === courseId)

    if(course){
        return ({course})
    }
    // 404 não encontrado
    return reply.status(404).send()
})

server.delete('/courses/:id', (request, reply) => {

    type Params = {
        id: string
    }

    const params = request.params as Params
    const courseId = params.id

    const index = courses.findIndex(course => course.id === courseId)

    if(index !== -1){
        courses.splice(index, 1);
        return reply.status(200).send("Excluído com sucesso")
    }
    // 404 não encontrado
    return reply.status(204).send()
})

server.post('/courses', (request, reply) => {

     type Body = {
        title: string
    }

    const body = request.body as Body
    const courseId =crypto.randomUUID()
    const courseTitle = body.title

    if(!courseTitle){
        return reply.status(400).send({message: 'Título Obrigatório'})
    }

    courses.push({id:courseId, title: courseTitle})

    return reply.status(201).send({courseId})
})

server.listen({port:3333}).then(() => {
    console.log('HTTP server running')
})