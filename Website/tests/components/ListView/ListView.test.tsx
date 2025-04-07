import React from 'react';
import { render } from "@testing-library/react";
import { expect, it } from "vitest";

import ListView from '../../../src/components/Views/List/ListView';
import mockData from '../../../src/mockData'

it('ListView renders correctly', () => {
    const tree = render(<ListView data={mockData}/>)
    expect(tree).toMatchSnapshot();
});