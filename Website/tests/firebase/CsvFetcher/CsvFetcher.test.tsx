import { expect, it } from "vitest";

import { fetchCsvData, parseInput } from '../../../src/firebase/CsvFetcher.js';

it('Data can be fetched', async () => {
    fetchCsvData("2025_abstracts.csv")
    .then(data => parseInput(data))
    .then(parsedData => expect(parsedData.length).toBeGreaterThan(0));
});

it('Data can be parsed', async () => {
    let data = await fetchCsvData("2025_abstracts.csv");
    let parsedData = parseInput(data);

    expect(parsedData).toBeInstanceOf(Array);
    expect(parsedData.length).toBeGreaterThan(0);
});

it('fetchCsvData returns empty array on error', async () => {
    const data = await fetchCsvData("invalid_file.csv");
    expect(data).toEqual([]);
});