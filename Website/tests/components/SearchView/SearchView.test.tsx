import React from 'react';
import { render, fireEvent } from "@testing-library/react";
import { expect, it } from "vitest";

import SearchView from '../../../src/components/SearchView';
import mockData from '../../../src/mockData';

it('SearchView renders correctly', () => {
    const { getByLabelText, getByText, container } = render(<SearchView data={mockData} />);

    expect(container).toMatchSnapshot();

    const majorSelect = getByLabelText(/major/i);
    fireEvent.change(majorSelect, { target: { value: "" } });

    const professorSelect = getByLabelText(/professor/i);
    fireEvent.change(professorSelect, { target: { value: "" } });

    const categorySelect = getByLabelText(/category/i);
    fireEvent.change(categorySelect, { target: { value: "" } });

    const universitySelect = getByLabelText(/university/i);
    fireEvent.change(universitySelect, { target: { value: "" } });

    expect(container).toMatchSnapshot();
});
