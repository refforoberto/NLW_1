import express, { request, response } from 'express';

const app = express();

app.use(express.json());
const users = [
    'Roberto',
    'Diego',
    'Fernando',
    'Rolando'
];

app.get('/users', (request, response) => {
    console.log("Listagem de usuários"); 

    const search = String(request.query.search);

    const filteredUsers = search ?  users.filter( user => user.includes(search)) : users;

    return response.json(filteredUsers);
});

app.get('/users/:id', (request, response) => {
    const id: number = Number(request.params.id);
    const user = users[id];

    return response.json(user);
});


app.post('/users', (request, response)=> {

    const data = request.body;

    console.log(data);
    
    const user = {
        name: data.name,
        email: data.email
    };

    return response.json(data);
});

app.listen(3333);