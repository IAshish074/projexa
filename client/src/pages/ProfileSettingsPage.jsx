import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import { User, Mail, Lock, Bell, Shield, Save, Upload, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../utils/api';
import { toast } from 'react-toastify';

const ProfileSettingsPage = () => {
  const { user, setUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  
  // Profile Form State
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });

  // Notification State
  const [notifications, setNotifications] = useState(user?.preferences || {
    projectUpdates: true,
    taskAssignments: true,
    teamMessages: false,
    weeklyReports: false
  });

  const handlePreferencesUpdate = async () => {
    setLoading(true);
    try {
      const res = await api.put('/auth/updatepreferences', notifications);
      setUser(prev => ({ ...prev, preferences: res.data.data.preferences }));
      toast.success('Preferences saved');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save preferences');
    } finally {
      setLoading(false);
    }
  };

  // Password Form State
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.put('/auth/updatedetails', profileData);
      setUser(prev => ({ ...prev, ...res.data.data }));
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return toast.error('Passwords do not match');
    }
    setLoading(true);
    try {
      await api.put('/auth/updatepassword', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      toast.success('Password updated successfully');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Password update failed');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    setLoading(true);
    try {
      const res = await api.put('/users/avatar', formData);
      setUser(prev => ({ ...prev, avatar: res.data.data.avatar }));
      toast.success('Avatar updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile Settings', icon: <User size={16} /> },
    { id: 'security', label: 'Security', icon: <Shield size={16} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={16} /> },
  ];

  return (
    <div className="space-y-6 pb-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Account Settings</h1>
        <p className="text-sm text-slate-400">Manage your profile, security, and preferences</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Settings Sidebar */}
        <div className="w-full md:w-64 shrink-0">
          <div className="glass-card p-2 flex flex-col gap-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors w-full text-left
                  ${activeTab === tab.id 
                    ? 'bg-primary-500/10 text-primary-400' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Settings Content */}
        <div className="flex-1">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="glass-card p-6 md:p-8"
          >
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h2 className="text-lg font-bold text-white border-b border-white/5 pb-4">Public Profile</h2>
                
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <img 
                      src={user?.avatar} 
                      alt={user?.name} 
                      className="w-24 h-24 rounded-full border-4 border-dark-800 object-cover"
                    />
                    {loading && (
                      <div className="absolute inset-0 bg-dark-900/50 rounded-full flex items-center justify-center">
                        <Loader2 className="animate-spin text-primary-500" />
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="relative">
                      <input 
                        type="file" 
                        id="avatar-upload" 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleAvatarUpload}
                      />
                      <Button 
                        variant="secondary" 
                        className="py-1.5 text-sm"
                        onClick={() => document.getElementById('avatar-upload').click()}
                        isLoading={loading}
                      >
                        <Upload size={14} className="mr-2" /> Change Avatar
                      </Button>
                    </div>
                    <p className="text-xs text-slate-500">JPG, GIF or PNG. Max size of 800K</p>
                  </div>
                </div>

                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1.5">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                        <input 
                          type="text" 
                          value={profileData.name}
                          onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                          className="glass-input w-full pl-10"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1.5">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                        <input 
                          type="email" 
                          value={profileData.email}
                          onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                          className="glass-input w-full pl-10"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <Button type="submit" isLoading={loading}>
                      <Save size={16} className="mr-2" /> Save Changes
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'security' && (
              <form onSubmit={handlePasswordUpdate} className="space-y-6">
                <h2 className="text-lg font-bold text-white border-b border-white/5 pb-4">Change Password</h2>
                
                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Current Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                      <input 
                        type="password" 
                        required
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        placeholder="••••••••" 
                        className="glass-input w-full pl-10" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                      <input 
                        type="password" 
                        required
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        placeholder="••••••••" 
                        className="glass-input w-full pl-10" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Confirm New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                      <input 
                        type="password" 
                        required
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        placeholder="••••••••" 
                        className="glass-input w-full pl-10" 
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <Button type="submit" isLoading={loading}>Update Password</Button>
                </div>
              </form>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h2 className="text-lg font-bold text-white border-b border-white/5 pb-4">Notification Preferences</h2>
                
                <div className="space-y-4">
                  {Object.entries(notifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-4 glass-card">
                      <div>
                        <h4 className="text-sm font-bold text-white capitalize">{key.replace(/([A-Z])/g, ' $1')}</h4>
                        <p className="text-xs text-slate-400">Receive alerts for this activity</p>
                      </div>
                      <button 
                        onClick={() => setNotifications({ ...notifications, [key]: !value })}
                        className={`w-12 h-6 rounded-full transition-colors relative ${value ? 'bg-primary-500' : 'bg-dark-900'}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${value ? 'right-1' : 'left-1'}`} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="pt-4">
                  <Button>Save Preferences</Button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettingsPage;
