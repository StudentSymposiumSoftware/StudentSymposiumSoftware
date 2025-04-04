import React from 'react';
import { render } from "@testing-library/react";
import { expect, it, vi } from "vitest";

import mockData from '../../../src/mockData';
import AbstractPage from '../../../src/components/AbstractPage/AbstractPage';

vi.mock('react-router-dom', async () => {
    const mod = await vi.importActual('react-router-dom');
    return {
      ...mod,
      useParams: () => ({
        number: 38893888,
      }),
      useNavigate: vi.fn(),
    };
  });

it('Abstract Page renders correctly', () => {
    const tree = render(<AbstractPage data={mockData}/>)
    expect(tree).toMatchSnapshot();
});