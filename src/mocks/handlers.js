import { rest } from 'msw';

export const handlers = [
    rest.get('http://localhost:3000/items', (req, res, ctx) => {
        console.log(13123);
        return res(ctx.json([{ id: 2 }]));
    }),
];
