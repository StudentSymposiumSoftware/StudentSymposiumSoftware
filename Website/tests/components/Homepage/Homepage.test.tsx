import React from 'react';
import { render } from "@testing-library/react";
import { expect, it } from "vitest";

import Homepage from '../../../src/components/Homepage';

it('Homepage renders correctly', () => {
    const tree = render(<Homepage/>)
    expect(tree).toMatchSnapshot();
});