
import { Member, MemberUnderElder } from '@/types/database.types';
import { v4 as uuidv4 } from 'uuid';

// Mock data for development mode
export const mockMembers: Member[] = [
  {
    id: '1',
    name: 'Elder John Smith',
    phone: '+358 40 123 4567',
    email: 'john.smith@example.com',
    role: 'elder',
    role_id: '1',
    status: 'active',
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Elder Mary Johnson',
    phone: '+358 50 234 5678',
    email: 'mary.johnson@example.com',
    role: 'elder',
    role_id: '1',
    status: 'active',
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Elder Robert Wilson',
    phone: '+358 45 345 6789',
    email: 'robert.wilson@example.com',
    role: 'elder',
    role_id: '1',
    status: 'active',
    created_at: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Elder Elizabeth Davis',
    phone: '+358 40 456 7890',
    email: 'elizabeth.davis@example.com',
    role: 'elder',
    role_id: '1',
    status: 'active',
    created_at: new Date().toISOString()
  },
  {
    id: '5',
    name: 'Alice Brown',
    phone: '+358 40 567 8901',
    email: 'alice@example.com',
    address: 'Mannerheimintie 1, Helsinki',
    role: 'member',
    role_id: '2',
    status: 'active',
    created_at: new Date().toISOString()
  },
  {
    id: '6',
    name: 'Bob Johnson',
    phone: '+358 50 678 9012',
    email: 'bob@example.com',
    address: 'Aleksanterinkatu 15, Helsinki',
    role: 'member',
    role_id: '2',
    status: 'active',
    created_at: new Date().toISOString()
  },
  {
    id: '7',
    name: 'Carol Davis',
    phone: '+358 45 789 0123',
    email: 'carol@example.com',
    address: 'Tehtaankatu 25, Helsinki',
    role: 'member',
    role_id: '2',
    status: 'active',
    created_at: new Date().toISOString()
  },
  {
    id: '8',
    name: 'Daniel Wilson',
    phone: '+358 40 890 1234',
    email: 'daniel@example.com',
    address: 'Bulevardi 10, Helsinki',
    role: 'member',
    role_id: '2',
    status: 'active',
    created_at: new Date().toISOString()
  },
  {
    id: '9',
    name: 'Eva Martin',
    phone: '+358 50 901 2345',
    email: 'eva@example.com',
    address: 'Fredrikinkatu 30, Helsinki',
    role: 'member',
    role_id: '2',
    status: 'active',
    created_at: new Date().toISOString()
  },
  {
    id: '10',
    name: 'Frank Thomas',
    phone: '+358 45 012 3456',
    email: 'frank@example.com',
    address: 'Annankatu 20, Helsinki',
    role: 'member',
    role_id: '2',
    status: 'active',
    created_at: new Date().toISOString()
  },
  {
    id: '11',
    name: 'Grace Lee',
    phone: '+358 40 123 4567',
    email: 'grace@example.com',
    address: 'Iso Roobertinkatu 5, Helsinki',
    role: 'member',
    role_id: '2',
    status: 'active',
    created_at: new Date().toISOString()
  },
  {
    id: '12',
    name: 'Henry Clark',
    phone: '+358 50 234 5678',
    email: 'henry@example.com',
    address: 'Eerikinkatu 12, Helsinki',
    role: 'member',
    role_id: '2',
    status: 'active',
    created_at: new Date().toISOString()
  },
];

// Mock data for elder assignments
export const mockElderAssignments: MemberUnderElder[] = [
  {
    id: '1',
    member_id: '5',
    elder_id: '1',
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    member_id: '6',
    elder_id: '1',
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    member_id: '7',
    elder_id: '2',
    created_at: new Date().toISOString()
  },
  {
    id: '4',
    member_id: '8',
    elder_id: '2',
    created_at: new Date().toISOString()
  },
  {
    id: '5',
    member_id: '9',
    elder_id: '3',
    created_at: new Date().toISOString()
  },
  {
    id: '6',
    member_id: '10',
    elder_id: '3',
    created_at: new Date().toISOString()
  },
  {
    id: '7',
    member_id: '11',
    elder_id: '4',
    created_at: new Date().toISOString()
  },
  // Member 12 is intentionally left unassigned
];
