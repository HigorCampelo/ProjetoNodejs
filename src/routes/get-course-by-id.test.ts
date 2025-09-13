import { test, expect} from 'vitest'
import request from 'supertest'
import { server } from '../app.ts'
import { makeCourses } from '../tests/factory/make-courses.ts'




test('get course by id', async () => { 
    
    await server.ready()
    
    //cria um curso antes do teste começar
    const course = await makeCourses()
    
    const response = await request(server.server)
                           .get(`/courses/${course.id}`)
                          
    expect(response.status).toBe(200)
    expect(response.body).toEqual({
        course: {
            id: expect.any(String),
            title: expect.any(String),
            description: null,    
        }   
    })
}) 

test('return 404 for non existing courses', async () => { 
    
    await server.ready()
    
    //cria um curso antes do teste começar
    
    const response = await request(server.server)
                           .get(`/courses/6944468c-491d-4b3a-822c-898700047dae`)
                          
    expect(response.status).toBe(404)
}) 