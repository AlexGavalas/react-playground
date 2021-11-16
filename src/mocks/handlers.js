import { rest } from 'msw';

export const handlers = [
    rest.get('http://localhost:3000/items', async (req, res, ctx) => {
        const id = req.url.searchParams.get('id');

        if (id) {
            return res(ctx.json({ id: id }));
        }

        return res(ctx.json([{ id: 1 }]));
    }),
];
