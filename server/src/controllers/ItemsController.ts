import {Request, Response} from 'express';
import knex from '../database/connection';

const API_PATH: string = `http://192.168.15.9:3333`;

class Itemscontroller {
    async index(request: Request, response: Response) {
        const items = await knex("items").select("*"); 
        const serializedItems = items.map(item => {
            return {
                id: item.id,
                title: item.title,
                image_url: `${API_PATH}/uploads/${item.image}`
            }
        });    
        return response.json(serializedItems);
    }
}

export default Itemscontroller;