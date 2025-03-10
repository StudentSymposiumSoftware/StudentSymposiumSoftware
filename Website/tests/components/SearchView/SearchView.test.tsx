import React from 'react';
import { render } from "@testing-library/react";
import { expect, it } from "vitest";

import SearchView from '../../../src/components/SearchView';
import mockData from '../../../src/mockData'

it('SearchView renders correctly', () => {
    const tree = render(<SearchView data={mockData}/>)
    expect(tree).toMatchSnapshot();
});