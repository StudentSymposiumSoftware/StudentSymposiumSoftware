import React from 'react';
import { render } from "@testing-library/react";
import { expect, it } from "vitest";

import { AuthAdmin, Loading, AdminPage } from '../../../src/components/Admin/AdminPage';

it('Admin Page renders correctly', () => {
    const tree = render(<AdminPage/>)
    expect(tree).toMatchSnapshot();
});

it('Loading Module Renders Correctly', () => {
    const tree = render(<Loading/>)
    expect(tree).toMatchSnapshot();
});

it('AuthAdmin Module Renders Correctly', () => {
    const tree = render(<AuthAdmin/>)
    expect(tree).toMatchSnapshot();
});