import { Location, StaffMember } from '../types';

export type SearchResult =
  | { kind: 'location'; id: string; name: string; subtitle: string; locationId: string }
  | { kind: 'staff'; id: string; name: string; subtitle: string; locationId: undefined };

export function filterLocations(
  locations: Location[],
  query: string,
  filter: string,
): Location[] {
  const q = query.toLowerCase();
  return locations
    .filter(l => {
      if (filter === 'Labs') return l.type === 'lab';
      if (filter === 'Rooms') return l.type === 'hall' || l.type === 'office';
      if (filter === 'Facilities') return l.type === 'facility';
      return true;
    })
    .filter(
      l =>
        !q ||
        l.name.toLowerCase().includes(q) ||
        l.block.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q),
    );
}

export function filterStaff(staff: StaffMember[], query: string): StaffMember[] {
  const q = query.toLowerCase();
  if (!q) return staff;
  return staff.filter(
    s =>
      s.name.toLowerCase().includes(q) ||
      s.department.toLowerCase().includes(q) ||
      s.course.toLowerCase().includes(q),
  );
}

export function buildSearchResults(
  locations: Location[],
  staff: StaffMember[],
  query: string,
  filter: string,
): SearchResult[] {
  const locationResults: SearchResult[] = filterLocations(locations, query, filter).map(l => ({
    kind: 'location',
    id: l.id,
    name: l.name,
    subtitle: `${l.block} · Floor ${l.floor === 0 ? 'G' : l.floor}`,
    locationId: l.id,
  }));

  const staffResults: SearchResult[] =
    filter === 'All' || filter === 'Staff'
      ? filterStaff(staff, query).map(s => ({
          kind: 'staff',
          id: s.id,
          name: s.name,
          subtitle: s.department,
          locationId: undefined,
        }))
      : [];

  return [...locationResults, ...staffResults];
}
