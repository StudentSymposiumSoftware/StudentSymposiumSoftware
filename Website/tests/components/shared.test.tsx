import { abstractDataSearch } from '../../src/components/shared';
import { mockData } from '../../src/mockData'
import { it, expect } from 'vitest';

it('should return the correct abstract data for a given number', () => {
  const searchQuery = '38893888';
  const data = mockData.filter(item => {
          return abstractDataSearch(item, searchQuery);
      });
  expect(data).toBeDefined();
  expect(data[0]?.abstractNumber).toBe(38893888);
});

it('should return the correct abstract data for a given title', () => {
  const searchQuery = 'Machine Learning Approaches to Financial Fraud Detection';
  const data = mockData.filter(item => {
          return abstractDataSearch(item, searchQuery);
      });
  expect(data).toBeDefined();
  expect(data[0]?.title).toBe('Machine Learning Approaches to Financial Fraud Detection');
});

it('should return an empty array for a non-existent abstract number', () => {
  const searchQuery = '99999999'; // Non-existent abstract number
  const data = mockData.filter(item => {
          return abstractDataSearch(item, searchQuery);
      });
  expect(data.length).toBe(0); // Expecting no results
});

it('should return the correct abstract data for a given keyword', () => {
  const searchQuery = 'Financial Fraud'; // Keyword from the abstract
  const data = mockData.filter(item => {
          return abstractDataSearch(item, searchQuery);
      });
  expect(data).toBeDefined();
  expect(data.length).toBeGreaterThan(0); // Expecting at least one result
  expect(data[0]?.keywords.includes('Financial Fraud')).toBe(true); // Check if the keyword is present
});

it('should return the correct abstract data for a given author name', () => {
  const searchQuery = 'Elijah Smith'; // Author name from the abstract
  const data = mockData.filter(item => {
          return abstractDataSearch(item, searchQuery);
      });
  expect(data).toBeDefined();
  expect(data.length).toBeGreaterThan(0); // Expecting at least one result
  expect(data[0]?.author).toBe('Elijah Smith'); // Check if the author name matches
});

it('should return abstract data for a given professor name', () => {
  const searchQuery = 'Olivia Lewis'; // Professor name from the abstract
  const data = mockData.filter(item => {
          return abstractDataSearch(item, searchQuery);
      });
  expect(data).toBeDefined();
  expect(data.length).toBeGreaterThan(0); // Expecting at least one result
  expect(data[0]?.professor).toBe('Olivia Lewis'); // Check if the professor name matches
});