import { filterLocations, filterStaff, buildSearchResults } from '../utils/search';
import { LOCATIONS, STAFF } from '../data/mockData';

describe('filterLocations', () => {
  it('returns all locations when filter is All and query is empty', () => {
    const result = filterLocations(LOCATIONS, '', 'All');
    expect(result).toHaveLength(LOCATIONS.length);
  });

  it('returns only labs when filter is Labs', () => {
    const result = filterLocations(LOCATIONS, '', 'Labs');
    expect(result.every(l => l.type === 'lab')).toBe(true);
  });

  it('filters by query string (case-insensitive)', () => {
    const result = filterLocations(LOCATIONS, 'dk1', 'All');
    expect(result.some(l => l.name === 'DK1 Lecture Hall')).toBe(true);
  });

  it('returns empty array when query matches nothing', () => {
    const result = filterLocations(LOCATIONS, 'xyznonexistent', 'All');
    expect(result).toHaveLength(0);
  });
});

describe('filterStaff', () => {
  it('returns all staff when query is empty', () => {
    expect(filterStaff(STAFF, '')).toHaveLength(STAFF.length);
  });

  it('filters by name (case-insensitive)', () => {
    const result = filterStaff(STAFF, 'suraya');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Dr Suraya Yaacob');
  });

  it('filters by department', () => {
    const result = filterStaff(STAFF, 'Artificial Intelligence');
    expect(result.some(s => s.department === 'Artificial Intelligence')).toBe(true);
  });
});

describe('buildSearchResults', () => {
  it('includes both locations and staff when filter is All', () => {
    const results = buildSearchResults(LOCATIONS, STAFF, '', 'All');
    const hasLocation = results.some(r => r.kind === 'location');
    const hasStaff = results.some(r => r.kind === 'staff');
    expect(hasLocation).toBe(true);
    expect(hasStaff).toBe(true);
  });

  it('excludes staff when filter is Labs', () => {
    const results = buildSearchResults(LOCATIONS, STAFF, '', 'Labs');
    expect(results.every(r => r.kind === 'location')).toBe(true);
  });
});
