import { expect, it } from "vitest";

import { fetchXLSXData, parseInput } from '../../../src/firebase/xlsxDataFetcher';

it('Data can be fetched', async () => {
    await fetchXLSXData('2025')
    .then(data => expect(data).toBeDefined())
});

it('Data can be parsed', async () => {
    await fetchXLSXData('2025')
    .then(data => parseInput(data['studentApplicationsLinkedRaw']))
    .then(parsedData => expect(parsedData).toBeDefined())
});