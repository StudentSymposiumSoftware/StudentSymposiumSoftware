import React from 'react';
import { render } from "@testing-library/react";
import { expect, it } from "vitest";

import GridView from '../../../src/components/GridView';
import mockData from '../../../src/mockData'

it('GridView renders correctly', () => {
    const tree = render(<GridView data={mockData}/>)
    expect(tree).toMatchSnapshot();
});