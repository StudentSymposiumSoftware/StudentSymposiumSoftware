import { expect, it } from "vitest";
import React from 'react';
import { render } from "@testing-library/react";

import YearSelector from '../../../src/firebase/yearSelector';

it('yearSelector renders correctly', () => {
    const availableYears = ["2025", "2024", "2023", "2022", "2021"];
    const tree = render(<YearSelector setYear={null} availableYears={availableYears} currYear={"2025"}/>)
    expect(tree).toMatchSnapshot();
});
