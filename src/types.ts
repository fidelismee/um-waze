export interface StaffMember {
  id: string;
  name: string;
  title: string;
  department: string;
  room: string;
  course: string;
  email: string;
}

export interface Location {
  id: string;
  name: string;
  type: 'lab' | 'hall' | 'office' | 'facility';
  block: string;
  floor: number;
  lat: number;
  lng: number;
  description: string;
}
