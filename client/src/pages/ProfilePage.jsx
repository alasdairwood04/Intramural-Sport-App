import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getUserTeams } from '../api/teamsApi';
import { updateProfile, changePassword } from '../api/userApi';
import Card, { StatsCard } from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';
import { useForm } from 'react-hook-form';
import { 
  User, 
  Mail, 
  IdCard, 
  Shield, 
  Trophy, 
  Users, 
  Calendar,
  Camera,
  Edit3,
  Lock,
  Settings,
  Activity,
  Award,
  Target
} from 'lucide-react';

const ProfilePage = () => {
  const { user, setUser } = useAuth();
  const [userTeams, setUserTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Fetch user teams for stats
  useEffect(() => {
    const fetchUserTeams = async () => {
      try {
        setIsLoading(true);
        const response = await getUserTeams();
        setUserTeams(response.data.data || []);
      } catch (err) {
        setError('Failed to fetch team data');
        console.error('Error fetching teams:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserTeams();
  }, []);

  // Calculate user stats
  const captainTeams = userTeams.filter(team => team.user_role === 'captain');
  const playerTeams = userTeams.filter(team => team.user_role === 'player');
  const activeSports = [...new Set(userTeams.map(team => team.sport_name))].length;

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Profile</h1>
          <p className="text-neutral-600 mt-1">
            Manage your account settings and view your sports activity
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button 
            variant="secondary"
            onClick={() => setIsPasswordModalOpen(true)}
          >
            <Lock className="h-4 w-4 mr-2" />
            Change Password
          </Button>
          <Button 
            onClick={() => setIsEditModalOpen(true)}
          >
            <Edit3 className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        </div>
      </div>

      {/* Alert Messages */}
      {error && (
        <div className="bg-error-50 border border-error-200 rounded-lg p-4">
          <p className="text-error-600 text-sm">{error}</p>
        </div>
      )}
      
      {success && (
        <div className="bg-success-50 border border-success-200 rounded-lg p-4">
          <p className="text-success-600 text-sm">{success}</p>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <Card>
            <div className="text-center">
              {/* Avatar */}
              <div className="relative inline-block mb-4">
                <div className="w-24 h-24 bg-gradient-to-r from-primary-400 to-primary-500 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  {user?.first_name?.[0]?.toUpperCase()}{user?.last_name?.[0]?.toUpperCase()}
                </div>
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full shadow-md border-2 border-neutral-100 flex items-center justify-center hover:bg-neutral-50 transition-colors duration-200">
                  <Camera className="h-4 w-4 text-neutral-600" />
                </button>
              </div>

              {/* User Info */}
              <h2 className="text-xl font-semibold text-neutral-900 mb-1">
                {user?.first_name} {user?.last_name}
              </h2>
              <p className="text-neutral-600 mb-2">{user?.email}</p>
              
              {/* Role Badge */}
              <div className="inline-flex items-center px-3 py-1 bg-primary-100 text-primary-800 text-sm font-medium rounded-full mb-4">
                <Shield className="h-4 w-4 mr-1" />
                {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
              </div>

              {/* Profile Details */}
              <div className="space-y-3 text-left">
                <ProfileDetailItem 
                  icon={User}
                  label="Full Name"
                  value={`${user?.first_name} ${user?.last_name}`}
                />
                <ProfileDetailItem 
                  icon={Mail}
                  label="Email"
                  value={user?.email}
                />
                <ProfileDetailItem 
                  icon={IdCard}
                  label="Student ID"
                  value={user?.student_id}
                />
                <ProfileDetailItem 
                  icon={Shield}
                  label="Account Type"
                  value={user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Stats and Activity */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatsCard
              title="Total Teams"
              value={userTeams.length}
              icon={Users}
            />
            <StatsCard
              title="As Captain"
              value={captainTeams.length}
              icon={Trophy}
            />
            <StatsCard
              title="Sports Played"
              value={activeSports}
              icon={Target}
            />
          </div>

          {/* Team Activity */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-neutral-900">My Teams</h3>
              <span className="text-sm text-neutral-500">{userTeams.length} teams</span>
            </div>
            
            {userTeams.length > 0 ? (
              <div className="space-y-3">
                {userTeams.map(team => (
                  <div key={team.id} className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors duration-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                        <Trophy className="h-5 w-5 text-primary-600" />
                      </div>
                      <div>
                        <div className="font-medium text-neutral-900">{team.name}</div>
                        <div className="text-sm text-neutral-600">
                          {team.sport_name} • {team.season_name}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RoleBadge role={team.user_role} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-neutral-400 mx-auto mb-2" />
                <p className="text-neutral-500">No teams joined yet</p>
              </div>
            )}
          </Card>

          {/* Recent Activity */}
          <Card>
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {/* Mock activity items */}
              <ActivityItem 
                icon={Trophy}
                title="Joined Football Team"
                description="You joined the 'Thunder Bolts' football team"
                time="2 days ago"
              />
              <ActivityItem 
                icon={Calendar}
                title="Fixture Scheduled"
                description="Upcoming match against Lightning Strikes on March 15"
                time="1 week ago"
              />
              <ActivityItem 
                icon={Award}
                title="Season Started"
                description="Spring 2025 season has begun"
                time="2 weeks ago"
              />
            </div>
          </Card>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={user}
        onSuccess={(updatedUser) => {
          setUser(updatedUser); // Update the user in the AuthContext
          setSuccess('Profile updated successfully');
          setTimeout(() => setSuccess(null), 5000);
        }}
        onError={(error) => {
          setError(error);
          setTimeout(() => setError(null), 5000);
        }}
      />

      {/* Change Password Modal */}
      <ChangePasswordModal 
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSuccess={() => {
          setSuccess('Password changed successfully');
          setTimeout(() => setSuccess(null), 5000);
        }}
        onError={(error) => {
          setError(error);
          setTimeout(() => setError(null), 5000);
        }}
      />
    </div>
  );
};

// Profile Detail Item Component
const ProfileDetailItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-neutral-50 transition-colors duration-200">
    <Icon className="h-4 w-4 text-neutral-500" />
    <div className="flex-1">
      <div className="text-xs text-neutral-500 uppercase tracking-wide font-medium">{label}</div>
      <div className="text-sm text-neutral-900">{value}</div>
    </div>
  </div>
);

// Role Badge Component
const RoleBadge = ({ role }) => {
  const styles = {
    captain: 'bg-primary-100 text-primary-800',
    player: 'bg-neutral-100 text-neutral-800',
    admin: 'bg-purple-100 text-purple-800'
  };
  
  return (
    <span className={`
      inline-flex items-center px-2 py-1 text-xs font-medium rounded-full capitalize
      ${styles[role] || styles.player}
    `}>
      {role}
    </span>
  );
};

// Activity Item Component
const ActivityItem = ({ icon: Icon, title, description, time }) => (
  <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-neutral-50 transition-colors duration-200">
    <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
      <Icon className="h-4 w-4 text-primary-600" />
    </div>
    <div className="flex-1 min-w-0">
      <div className="font-medium text-neutral-900">{title}</div>
      <div className="text-sm text-neutral-600">{description}</div>
      <div className="text-xs text-neutral-500 mt-1">{time}</div>
    </div>
  </div>
);

// Edit Profile Modal
const EditProfileModal = ({ isOpen, onClose, user, onSuccess, onError }) => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      email: user?.email || '',
      student_id: user?.student_id || ''
    }
  });

  const onSubmit = async (data) => {
    try {
      const response = await updateProfile(data);
      onSuccess(response.data);
      onClose();
    } catch (err) {
      onError(err.response?.data?.message || 'Failed to update profile');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Profile">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input 
            label="First Name" 
            name="first_name"   // Changed from firstName 
            register={register} 
            errors={errors} 
            required 
          />
          <Input 
            label="Last Name" 
            name="last_name"    // Changed from lastName
            register={register} 
            errors={errors} 
            required 
          />
        </div>
        <Input 
          label="Email" 
          name="email" 
          type="email" 
          register={register} 
          errors={errors} 
          required 
        />
        <Input 
          label="Student ID" 
          name="student_id"    // Changed from studentId
          register={register} 
          errors={errors} 
          required 
        />
        
        <div className="flex justify-end space-x-3 pt-6 border-t border-neutral-200">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={isSubmitting}>
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
};

// Change Password Modal
const ChangePasswordModal = ({ isOpen, onClose, onSuccess, onError }) => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, watch } = useForm();

  const onSubmit = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      onError('Passwords do not match');
      return;
    }

    try {
      await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword
      });
      onSuccess();
      onClose();
    } catch (err) {
      onError(err.response?.data?.message || 'Failed to change password');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Change Password">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input 
          label="Current Password" 
          name="currentPassword" 
          type="password" 
          register={register} 
          errors={errors} 
          required 
        />
        <Input 
          label="New Password" 
          name="newPassword" 
          type="password" 
          register={register} 
          errors={errors} 
          required 
        />
        <Input 
          label="Confirm New Password" 
          name="confirmPassword" 
          type="password" 
          register={register} 
          errors={errors} 
          required 
        />
        
        <div className="flex justify-end space-x-3 pt-6 border-t border-neutral-200">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={isSubmitting}>
            Update Password
          </Button>
        </div>
      </form>
    </Modal>
  );
};

// Loading Skeleton
const ProfileSkeleton = () => (
  <div className="max-w-7xl mx-auto space-y-8">
    <div className="flex justify-between items-center">
      <div className="space-y-2">
        <div className="h-8 w-32 bg-neutral-200 rounded animate-pulse" />
        <div className="h-4 w-64 bg-neutral-200 rounded animate-pulse" />
      </div>
      <div className="flex space-x-3">
        <div className="h-10 w-32 bg-neutral-200 rounded animate-pulse" />
        <div className="h-10 w-24 bg-neutral-200 rounded animate-pulse" />
      </div>
    </div>
    
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 h-96 bg-neutral-200 rounded-lg animate-pulse" />
      <div className="lg:col-span-2 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-neutral-200 rounded-lg animate-pulse" />
          ))}
        </div>
        <div className="h-64 bg-neutral-200 rounded-lg animate-pulse" />
        <div className="h-48 bg-neutral-200 rounded-lg animate-pulse" />
      </div>
    </div>
  </div>
);

export default ProfilePage;