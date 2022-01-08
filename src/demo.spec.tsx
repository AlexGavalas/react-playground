import { render, screen, waitFor } from '@testing-library/react';

import { ReactQueryApp } from './react-query';

describe('Async component', () => {
    test('Fetches some data', async () => {
        render(<ReactQueryApp />);

        const el = await waitFor(() => screen.findByTestId('2'));

        expect(el.textContent).toBe('test 1');
    });
});
