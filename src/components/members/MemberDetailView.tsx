
import React from 'react';
import { Member } from '@/types/database.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  User, Phone, Mail, MapPin, Calendar, Users, 
  HeartHandshake, Building, Award, AlertCircle, 
  CheckCircle2, XCircle, UserPlus, Briefcase, 
  Home, Navigation
} from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import MemberMinistryAssignments from './MemberMinistryAssignments';
import { useAuth } from '@/contexts/AuthContext';

interface MemberDetailViewProps {
  member: Member;
  onClose: () => void;
}

const MemberDetailView: React.FC<MemberDetailViewProps> = ({ member, onClose }) => {
  const { userRole } = useAuth();
  const isReadOnly = userRole === 'elder';
  
  if (!member) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-900"
          aria-label="Close"
        >
          <XCircle size={24} />
        </button>
        
        <CardHeader className="border-b pb-4">
          <div className="flex items-center gap-4">
            {member.image ? (
              <img 
                src={member.image} 
                alt={member.name || 'Member'} 
                className="w-16 h-16 rounded-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder.svg';
                }} 
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                <User size={30} className="text-gray-500" />
              </div>
            )}
            <div>
              <CardTitle className="text-2xl">{member.name || 'Unnamed Member'}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={member.status === 'active' ? 'success' : 'secondary'}>
                  {member.status === 'active' ? 'Active' : 'Inactive'}
                </Badge>
                <span className="text-sm text-gray-500">
                  {member.role || member.roles?.name || 'Member'}
                </span>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Personal Information</h3>
              
              {member.email && (
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Email</p>
                    <p className="text-gray-900">{member.email}</p>
                  </div>
                </div>
              )}
              
              {member.phone && (
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Phone</p>
                    <p className="text-gray-900">{member.phone}</p>
                  </div>
                </div>
              )}
              
              {member.address && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Address</p>
                    <p className="text-gray-900">{member.address}</p>
                  </div>
                </div>
              )}
              
              {member.city && (
                <div className="flex items-start gap-3">
                  <Home className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">City</p>
                    <p className="text-gray-900">{member.city}</p>
                  </div>
                </div>
              )}
              
              {member.postal_code && (
                <div className="flex items-start gap-3">
                  <Navigation className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Postal Code</p>
                    <p className="text-gray-900">{member.postal_code}</p>
                  </div>
                </div>
              )}
              
              {member.created_at && (
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Member Since</p>
                    <p className="text-gray-900">{format(new Date(member.created_at), 'MMMM d, yyyy')}</p>
                  </div>
                </div>
              )}
              
              {member.gender && (
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Gender</p>
                    <p className="text-gray-900">{member.gender}</p>
                  </div>
                </div>
              )}
              
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Baptised</p>
                  <p className="text-gray-900">{member.is_baptised ? 'Yes' : 'No'}</p>
                </div>
              </div>

              {member.assigned_elder?.elder && (
                <div className="flex items-start gap-3">
                  <UserPlus className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Assigned Elder</p>
                    <p className="text-gray-900">{member.assigned_elder.elder.name}</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Family Information</h3>
              
              {member.marital_status && (
                <div className="flex items-start gap-3">
                  <HeartHandshake className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Marital Status</p>
                    <p className="text-gray-900">{member.marital_status}</p>
                  </div>
                </div>
              )}
              
              {member.spouse_name && (
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Spouse</p>
                    <p className="text-gray-900">{member.spouse_name}</p>
                  </div>
                </div>
              )}
              
              {member.num_children !== undefined && member.num_children > 0 && (
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Number of Children</p>
                    <p className="text-gray-900">{member.num_children}</p>
                  </div>
                </div>
              )}
              
              {member.emergency_contact && (
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Emergency Contact</p>
                    <p className="text-gray-900">{member.emergency_contact}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t">
            <div className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-gray-500" />
              <h3 className="text-lg font-semibold">Ministry Assignments</h3>
            </div>
            <div className="mt-3">
              <MemberMinistryAssignments member={member} readOnly={isReadOnly} />
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t">
            <h3 className="text-lg font-semibold mb-4">Church Background</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {member.previous_church && (
                <div className="flex items-start gap-3">
                  <Building className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Previous Church</p>
                    <p className="text-gray-900">{member.previous_church}</p>
                  </div>
                </div>
              )}
              
              {member.role_in_previous_church && (
                <div className="flex items-start gap-3">
                  <Award className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Role in Previous Church</p>
                    <p className="text-gray-900">{member.role_in_previous_church}</p>
                  </div>
                </div>
              )}
              
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Has Letter from Previous Church</p>
                  <p className="text-gray-900">{member.has_letter_from_prev_church ? 'Yes' : 'No'}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-4 flex justify-end">
            <button 
              onClick={onClose} 
              className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MemberDetailView;
