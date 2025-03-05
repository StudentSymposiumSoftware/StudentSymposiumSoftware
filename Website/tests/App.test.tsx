import React from 'react';
import { render } from "@testing-library/react";
import { expect, it } from "vitest";

import App from '../src/App';

it('GridView renders correctly', () => {
    const tree = render(<App/>)
    expect(tree).toMatchSnapshot();
});