import { test, expect} from 'vitest'
import request from 'supertest'
import { server } from '../app.ts'
import { makeCourses } from '../tests/factory/make-courses.ts'
import { randomUUID} from 'node:crypto'




test('get courses', async () => { 
    
    await server.ready()

    const titleId = randomUUID()
    
    //cria um curso antes do teste começar
    const course = await makeCourses(titleId)
    
    const response = await request(server.server)
                           .get(`/courses?search=${titleId}`)
    expect(response.statusCode).toEqual(200)                          
    expect(response.body).toEqual({
          total: 1,
          courses: [
            {
                id:expect.any(String),
                title: titleId,
                enrollments: 0,
            }
        ]
    })
}) 