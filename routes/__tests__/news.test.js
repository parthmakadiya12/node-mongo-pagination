const app = require('../../app');
const supertest = require('supertest')
const mongoose = require('mongoose')
const NewsSchema = require("../../schemas/NewsSchema");

const request = supertest(app);

const databaseName = 'test'
const news = [{
    title: 'One',
    description: 'Desc'
}, {
    title: 'Two',
    description: 'Desc'
}, {
    title: 'Three',
    description: 'Desc'
},
{
    title: 'Four',
    description: 'Desc'
},
]

describe('News Api Test', () => {
    beforeAll(async () => {
        const url = `mongodb://127.0.0.1/${databaseName}`
        await mongoose.connect(url, { useNewUrlParser: true })
    })

    afterEach(async () => {
        await NewsSchema.deleteMany()
    })

    afterAll(async () => {
        await NewsSchema.drop()
    })

    it('GET:gets the news from news get endpoint', async done => {
        const response = await request.get('/news?page=1&limit=3')

        expect(response.status).toBe(200)
        expect(response.body).toEqual({ response: { message: [] }, totalPages: 0, currentPage: 1 });
        done()
    });

    it('GET:news Get enpoint should have page number start from 1 only', async done => {
        const response = await request.get('/news?page=0&limit=3')

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Page Should be a number and should start with 1")
        done()
    });

    it('GET: should get paginated news as passed in the query params', async done => {
        for (u of news) {
            const newsitem = new NewsSchema(u)
            await newsitem.save();
        }
        const response = await request.get('/news?page=1&limit=2')
        expect(response.status).toBe(200);
        const length = response.body.response.message.length;
        expect(length).toBe(2);
        expect(response.body.response.message[length - 1].title).toBe("Two");
        done()
    });

    it('GET: should get second page news as we pass pageno 2', async (done) => {
        for (u of news) {
            const newsitem = new NewsSchema(u)
            await newsitem.save();
        }
        const response = await request.get('/news?page=2&limit=2');
        expect(response.status).toBe(200);
        const length = response.body.response.message.length;
        expect(length).toBe(2);
        expect(response.body.response.message[length - 1].title).toBe("Four");
        done();
    });

    it('POST:Should save news to database', async done => {
        const res = await request.post('/news/')
            .send({
                "title": "Demo6",
                "description": "Lorem Ipsum is simply"
            });
        const user = await NewsSchema.findOne({ title: 'Demo6', description: 'Lorem Ipsum is simply' });
        expect(user.title).toBe("Demo6");
        done()
    });
});