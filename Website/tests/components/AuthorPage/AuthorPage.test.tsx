import React from 'react';
import { render } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import mockData from '../../../src/mockData';
import AuthorPage from '../../../src/components/AuthorPage';

it('Author Page renders correctly', () => {
    const tree = render(<Router> <AuthorPage data={mockData}/></Router>)
    expect(tree).toMatchSnapshot();
});


it('renders AuthorPage correctly when visiting /author/:name', () => {
    vi.mock('react-router-dom', async (importOriginal) => {
        const actual = (await importOriginal()) as { [key: string]: any };
      
        return {
          ...actual, 
          useParams: () => ({ name: 'Elijah Smith' }), 
        };
    });

    render(
      <Router>
        <Routes>
          <Route path="/author/:name" element={<AuthorPage data={mockData} />} />
        </Routes>
      </Router>
    );
});