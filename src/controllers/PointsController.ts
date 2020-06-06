import knex from "../database/connection"
import { Request, Response, request } from "express"


class PointsController {
    async show(req: Request, res: Response) {
        const { id } = req.params

        const point = await knex('points').where('id', id).first()

        if (!point) {
            return res.status(400).json({ message: "Ponto não encontrado!" })
        }

        const serializedPoint = {   
               ...point,
                image_url: `http://192.168.15.22:5000/uploads/${point.image}`
            
        }

        const items = await knex('items').join('point_items', 'items.id', '=', 'point_items.item_id')
            .where('point_items.point_id', id).select('items.title')

        return res.json({ point: serializedPoint, items })

    }
    async create(req: Request, res: Response) {
        const {
            name,
            email,
            wpp,
            latitude,
            logitude,
            city,
            uf,
            num,
            items
        } = req.body

        const trx = await knex.transaction()

        const point = {
            image: req.file.filename ,
            name,
            email,
            wpp,
            latitude,
            logitude,
            city,
            uf,
            num
        }

        const InsertedIds = await trx('points').insert(point)

        const point_id = InsertedIds[0]

        const pointItems = items
            .split(',')
            .map((item: string) => Number(item.trim()))
            .map((item_id: number) => {
                return {
                    item_id,
                    point_id,
                }
            })

        await trx('point_items').insert(pointItems)

        await trx.commit();

        return res.json({
            id: point_id,
            ...point,
        })
    }
    async index(req: Request, res: Response) {
        const { city, uf, items } = req.query

        const parsedItems = String(items).split(",").map(item => Number(item.trim()))

        const points = await knex('points')
            .join('point_items', 'points.id', '=', 'point_items.point_id')
            .whereIn('point_items.item_id', parsedItems)
            .where('city', String(city))
            .where('uf', String(uf))
            .distinct()
            .select('points.*')

            const serializedPoints = points.map(point => {
                return {
                    ...point,
                    image_url: `http://192.168.15.22:5000/uploads/${point.image}`
                }
            })
          
        return res.json(serializedPoints)

    }
}

export default PointsController