import React from 'react';
import { render } from "@testing-library/react";
import { expect, it } from "vitest";

import Homepage from '../../../src/components/Homepage';

const mockData = [
    { title: "Abstract 1", author: "Author A", professor: "Prof. X", school: "School Y", Major_1: "Major Z", category: "Category 1", abstractNumber: "001" },
    { title: "Abstract 2", author: "Author B", professor: "Prof. Y", school: "School X", Major_1: "Major A", category: "Category 2", abstractNumber: "002" }
];

it('Homepage renders correctly and updates abstract', () => {
    const tree = render(<Homepage data={mockData} />);
    expect(tree).toMatchSnapshot();
});
