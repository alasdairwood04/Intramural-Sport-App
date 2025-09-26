// client/src/pages/SettingsPage.jsx
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { updateProfile, changePassword } from '../api/userApi';
import { useForm } from 'react-hook-form';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { User, Lock, Bell, Settings as SettingsIcon } from 'lucide-react';

const SettingsPage = () => {
    const [activeTab, setActiveTab] = useState('profile');

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'security', label: 'Security', icon: Lock },
        { id: 'notifications', label: 'Notifications', icon: Bell },
    ];

    return (
        <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-neutral-900 mb-8">Settings</h1>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Navigation */}
                <div className="md:col-span-1">
                    <nav className="space-y-1">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                                    activeTab === tab.id
                                        ? 'bg-primary-50 text-primary-700'
                                        : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                                }`}
                            >
                                <tab.icon className="h-4 w-4" />
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Content */}
                <div className="md:col-span-3">
                    {activeTab === 'profile' && <ProfileSettings />}
                    {activeTab === 'security' && <SecuritySettings />}
                    {activeTab === 'notifications' && <NotificationSettings />}
                </div>
            </div>
        </div>
    );
};

// Profile Settings Component
const ProfileSettings = () => {
    const { user, setUser } = useAuth();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        defaultValues: {
            first_name: user?.first_name || '',
            last_name: user?.last_name || '',
            email: user?.email || '',
            student_id: user?.student_id || '',
        },
    });

    const onSubmit = async (data) => {
        try {
            const response = await updateProfile(data);
            setUser(response.data); // Update user in auth context
            alert('Profile updated successfully!');
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update profile.');
        }
    };

    return (
        <Card>
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">Public Profile</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input label="First Name" name="first_name" register={register} errors={errors} required />
                <Input label="Last Name" name="last_name" register={register} errors={errors} required />
                <Input label="Email" name="email" type="email" register={register} errors={errors} required />
                <Input label="Student ID" name="student_id" register={register} errors={errors} required />
                <div className="flex justify-end pt-2">
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </form>
        </Card>
    );
};

// Security Settings Component
const SecuritySettings = () => {
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm();

    const onSubmit = async (data) => {
        if (data.newPassword !== data.confirmPassword) {
            alert('New passwords do not match.');
            return;
        }
        try {
            await changePassword({ currentPassword: data.currentPassword, newPassword: data.newPassword });
            alert('Password changed successfully!');
            reset();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to change password.');
        }
    };
    
    return (
        <Card>
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">Change Password</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input label="Current Password" name="currentPassword" type="password" register={register} errors={errors} required />
                <Input label="New Password" name="newPassword" type="password" register={register} errors={errors} required />
                <Input label="Confirm New Password" name="confirmPassword" type="password" register={register} errors={errors} required />
                <div className="flex justify-end pt-2">
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Updating...' : 'Update Password'}
                    </Button>
                </div>
            </form>
        </Card>
    );
};

// Notification Settings Component
const NotificationSettings = () => {
    // This is a placeholder. You would fetch and update real notification settings here.
    return (
        <Card>
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">Notification Settings</h2>
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-medium text-neutral-800">Fixture Reminders</p>
                        <p className="text-sm text-neutral-500">Get notified about upcoming matches.</p>
                    </div>
                    <input type="checkbox" className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-medium text-neutral-800">Team Announcements</p>
                        <p className="text-sm text-neutral-500">Receive messages from your team captain.</p>
                    </div>
                    <input type="checkbox" className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500" defaultChecked />
                </div>
            </div>
        </Card>
    );
};

export default SettingsPage;