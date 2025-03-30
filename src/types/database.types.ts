
export interface Slide {
  id: string;
  created_at?: string;
  src: string;
  alt: string;
  title?: string;
  subtitle?: string;
  order: number;
}

export interface Ministry {
  id: string;
  created_at?: string;
  name: string;
  description: string;
  contact_name: string;
  contact_email: string;
  contact_phone?: string;
  status: 'active' | 'inactive';
  photo?: string;
  contact_person_id?: string;
  contact_elder?: Member;
}

export interface Role {
  id: string;
  created_at: string;
  name: string;
}

export interface MemberUnderElder {
  id: string;
  created_at?: string;
  member_id: string;
  elder_id: string;
  elder?: Member;
}

export interface Member {
  id: string;
  created_at?: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  image?: string;
  role?: string;
  role_id?: string;
  ministry_id?: string;
  // Fields from database
  gender?: string;
  marital_status?: string;
  spouse_name?: string;
  children_names?: string;
  previous_church?: string;
  role_in_previous_church?: string;
  emergency_contact?: string;
  has_letter_from_prev_church?: boolean;
  status?: 'active' | 'inactive';
  // New fields
  is_baptised?: boolean;
  num_children?: number;
  // Geographic coordinates
  latitude?: number;
  longitude?: number;
  // Include joined data
  ministries?: Pick<Ministry, 'id' | 'name'>;
  roles?: Pick<Role, 'id' | 'name'>;
  // Assigned elder
  assigned_elder?: MemberUnderElder;
}

export interface Database {
  public: {
    Tables: {
      slides: {
        Row: Slide;
        Insert: Omit<Slide, 'id' | 'created_at'>;
        Update: Partial<Omit<Slide, 'id' | 'created_at'>>;
      };
      ministries: {
        Row: Ministry;
        Insert: Omit<Ministry, 'id' | 'created_at'>;
        Update: Partial<Omit<Ministry, 'id' | 'created_at'>>;
      };
      members: {
        Row: Member;
        Insert: Omit<Member, 'id' | 'created_at'>;
        Update: Partial<Omit<Member, 'id' | 'created_at'>>;
      };
      roles: {
        Row: Role;
        Insert: Omit<Role, 'id' | 'created_at'>;
        Update: Partial<Omit<Role, 'id' | 'created_at'>>;
      };
      member_under_elder: {
        Row: MemberUnderElder;
        Insert: Omit<MemberUnderElder, 'id' | 'created_at'>;
        Update: Partial<Omit<MemberUnderElder, 'id' | 'created_at'>>;
      };
    };
    Views: {};
    Functions: {};
  };
}
