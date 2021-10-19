import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';

import { rest } from 'msw';
import { setupServer } from 'msw/node';

import { App } from './index.jsx';

const server = setupServer(
    rest.get('http://localhost:3000/items', async (req, res, ctx) => {
        const params = req.url.searchParams;

        const id = params.get('id');
        if (id) {
            return res(ctx.json({ id: id }));
        }

        return res(ctx.json([{ id: 1 }]));
    }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('asdad', () => {
    test('23123', async () => {
        render(<App />);

        const el = await waitFor(() => screen.findByTestId('2'));

        expect(el.textContent).toBe('test 1');
    });
});
