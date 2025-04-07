import React from 'react';
import { render, fireEvent  } from "@testing-library/react";
import { expect, it } from "vitest";
import { HashRouter as Router } from 'react-router-dom';

import GridView from '../../../src/components/Views/Grid/GridView';
import mockData from '../../../src/mockData'

it('GridView renders correctly', () => {
    const tree = render(<Router><GridView data={mockData}/></Router>)
    expect(tree).toMatchSnapshot();
});

it('clicks on the author link', () => {
    const { container } = render(<Router><GridView data={mockData} /></Router>);
    const authorLink = container.querySelector('h4.author-link');
  
    if (authorLink) {
        fireEvent.click(authorLink);
    } else {
        throw new Error('Author link not found');
    }
});