import React from 'react';
import { render, screen, fireEvent } from "@testing-library/react";
import { expect, it } from "vitest";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import SearchView from '../../../src/components/Views/Search/SearchView';
import mockData from '../../../src/mockData';


it('SearchView renders correctly', () => {
    const { container } = render(<Router><SearchView data={mockData} /></Router>);
    const searchItem = container.querySelector('div.search-item');
      
    if (searchItem) {
        fireEvent.click(searchItem);
    } else {
        throw new Error('Search item not found');
    }

    expect(container).toMatchSnapshot();
});

it ("Searching should properly search abstracts", () => {
    const { container } = render(<Router><SearchView data={mockData} /></Router>);
    const searchBar = container.querySelector('input.search-bar');

    fireEvent.change(searchBar, { target: { value: "Fraud"}})
    expect(container).toMatchSnapshot();
})
