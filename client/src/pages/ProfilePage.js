import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { User, Phone, Calendar, Edit3, Save, X, Globe } from 'lucide-react';
import styled from 'styled-components';

import LoadingSpinner from '../components/LoadingSpinner';

import { auth, db } from '../config/firebase'; // Đảm bảo đường dẫn đúng
import { doc, getDoc } from "firebase/firestore";

// STYLED COMPONENTS
const ProfileContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const ProfileHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const ProfileTitle = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  color: #1a202c;
  margin-bottom: 0.5rem;
`;

const ProfileSubtitle = styled.p`
  color: #6b7280;
`;

const ProfileCard = styled.div`
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex; // Bật flexbox để chứa 2 cột

  @media (max-width: 768px) {
    flex-direction: column; // Xếp chồng trên mobile
  }
`;

const ProfileSidebar = styled.div`
  flex: 0 0 280px; // Không co, không giãn, rộng 280px
  padding: 2rem;
  text-align: center;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    flex-basis: auto; // Reset chiều rộng trên mobile
    border-right: none;
    border-bottom: 1px solid #e5e7eb;
  }
`;

const ProfileContent = styled.div`
  flex: 1; // Chiếm hết không gian còn lại
  padding: 2rem;
`;

const Avatar = styled.div`
  width: 5rem;
  height: 5rem;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
`;

const UserName = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 0.5rem;
`;

const UserEmail = styled.p`
  color: #6b7280;
  margin-bottom: 1rem;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a202c;
`;

const EditButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: #2563eb;
  }
`;

const CancelButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #6b7280;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-right: 0.5rem;

  &:hover {
    background: #4b5563;
  }
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  padding: 0.75rem;
  background: #f8fafc;
  border-radius: 0.5rem;
`;

const DetailIcon = styled.div`
  color: #6b7280;
`;

const DetailContent = styled.div`
  flex: 1;
`;

const DetailLabel = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
`;

const DetailValue = styled.div`
  font-weight: 500;
  color: #1a202c;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 500;
  color: #374151;
  font-size: 0.875rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 2px solid ${(props) => (props.$error ? '#ef4444' : '#d1d5db')};
  border-radius: 0.375rem;
  font-size: 1rem;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const TextArea = styled.textarea`
  padding: 0.75rem;
  border: 2px solid ${(props) => (props.$error ? '#ef4444' : '#d1d5db')};
  border-radius: 0.375rem;
  font-size: 1rem;
  resize: vertical;
  min-height: 100px;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const ErrorMessage = styled.span`
  color: #ef4444;
  font-size: 0.875rem;
`;

const FormActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const InputRow = styled.div`
  display: flex;
  gap: 1rem;

  @media (max-width: 500px) {
    flex-direction: column;
  }
`;


const schema = yup.object({
  firstName: yup.string().min(2, 'Họ và tên là bắt buộc').max(50).required('Họ và tên là bắt buộc'),
  lastName: yup.string().min(1, 'Họ và tên là bắt buộc').max(50).required('Họ và tên là bắt buộc'),
  phone: yup.string().matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g, 'Số điện thoại không hợp lệ').optional().nullable(),
  address: yup.string().max(200, 'Địa chỉ không quá 200 ký tự').optional().nullable(),
  gender: yup.string().oneOf(['male', 'female', 'other'], 'Giới tính không hợp lệ').optional().nullable(),
});

// ✅ BƯỚC 1: TẠO COMPONENT CON ĐỂ HIỂN THỊ THÔNG TIN
const DisplayProfile = ({ profile }) => (
  <>
    <DetailItem>
      <DetailIcon><User size={20} /></DetailIcon>
      <DetailContent>
        <DetailLabel>Họ và tên</DetailLabel>
        <DetailValue>{profile.lastName} {profile.firstName || 'Chưa cập nhật'}</DetailValue>
      </DetailContent>
    </DetailItem>
    <DetailItem>
              <DetailIcon><User size={20} /></DetailIcon>
      <DetailContent>
        <DetailLabel>Giới tính</DetailLabel>
        <DetailValue>
          {profile.gender === 'male' ? 'Nam' : 
           profile.gender === 'female' ? 'Nữ' : 
           profile.gender === 'other' ? 'Khác' : 'Chưa cập nhật'}
        </DetailValue>
      </DetailContent>
    </DetailItem>
    <DetailItem>
      <DetailIcon><Phone size={20} /></DetailIcon>
      <DetailContent>
        <DetailLabel>Số điện thoại</DetailLabel>
        <DetailValue>{profile.phone || 'Chưa cập nhật'}</DetailValue>
      </DetailContent>
    </DetailItem>
    <DetailItem>
      <DetailIcon><Globe size={20} /></DetailIcon>
      <DetailContent>
        <DetailLabel>Địa chỉ</DetailLabel>
        <DetailValue>{profile.address || 'Chưa cập nhật'}</DetailValue>
      </DetailContent>
    </DetailItem>
    <DetailItem>
      <DetailIcon><Calendar size={20} /></DetailIcon>
      <DetailContent>
        <DetailLabel>Ngày tham gia</DetailLabel>
          <DetailValue>
            {profile.createdAt
              ? profile.createdAt.toDate().toLocaleDateString('vi-VN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })
              : 'Không rõ'}
          </DetailValue>
      </DetailContent>
    </DetailItem>
  </>
);

// ✅ BƯỚC 2: TẠO COMPONENT CON CHO FORM CHỈNH SỬA
const EditProfileForm = ({ onSubmit, handleCancel, isSaving, register, handleSubmit, errors }) => (
  <Form onSubmit={handleSubmit(onSubmit)}>
    <InputRow>
      <FormGroup>
        <Label htmlFor="lastName">Họ</Label>
        <Input id="lastName" type="text" $error={!!errors.lastName} {...register('lastName')} />
        {errors.lastName && <ErrorMessage>{errors.lastName.message}</ErrorMessage>}
      </FormGroup>
      <FormGroup>
        <Label htmlFor="firstName">Tên</Label>
        <Input id="firstName" type="text" $error={!!errors.firstName} {...register('firstName')} />
        {errors.firstName && <ErrorMessage>{errors.firstName.message}</ErrorMessage>}
      </FormGroup>
    </InputRow>
    <FormGroup>
      <Label htmlFor="gender">Giới tính</Label>
      <select id="gender" {...register('gender')} style={{ padding: '0.75rem', border: '2px solid #d1d5db', borderRadius: '0.375rem' }}>
        <option value="">-- Chọn giới tính --</option>
        <option value="male">Nam</option>
        <option value="female">Nữ</option>
        <option value="other">Khác</option>
      </select>
      {errors.gender && <ErrorMessage>{errors.gender.message}</ErrorMessage>}
    </FormGroup>
    <FormGroup>
      <Label htmlFor="phone">Số điện thoại</Label>
      <Input id="phone" type="text" $error={!!errors.phone} {...register('phone')} />
      {errors.phone && <ErrorMessage>{errors.phone.message}</ErrorMessage>}
    </FormGroup>
    <FormGroup>
      <Label htmlFor="address">Địa chỉ</Label>
      <TextArea id="address" placeholder="Nhập địa chỉ của bạn..." $error={!!errors.address} {...register('address')} />
      {errors.address && <ErrorMessage>{errors.address.message}</ErrorMessage>}
    </FormGroup>
    <FormActions>
      <CancelButton type="button" onClick={handleCancel}><X size={16} /> Hủy</CancelButton>
      <EditButton type="submit" disabled={isSaving}>
        <Save size={16} /> {isSaving ? 'Đang lưu...' : 'Lưu Thay Đổi'}
      </EditButton>
    </FormActions>
  </Form>
);

const ProfilePage = () => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [originalData, setOriginalData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const userDocRef = doc(db, "mm_users", user.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            const data = userDocSnap.data();
            setProfileData(data);
            setOriginalData(data);
            reset(data);
          } else {
            setError("Không tìm thấy hồ sơ người dùng.");
          }
        } catch (err) {
          setError("Không thể tải dữ liệu hồ sơ.");
        }
      } else {
        navigate('/login');
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [navigate, reset]);

  // ✅ HÀM ONSUBMIT ĐÃ ĐƯỢỢC TỐI ƯU HÓA
  const onSubmit = async (data) => {
    setIsSaving(true);
    setError('');
    setSuccess('');

    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("Người dùng không được xác thực. Vui lòng đăng nhập lại.");
      }

      const token = await user.getIdToken();
      
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Cập nhật hồ sơ thất bại.');
      }
      
      setProfileData(result.data);
      setOriginalData(result.data);
      
      setIsEditing(false);
      setSuccess('Hồ sơ đã được cập nhật thành công!');

    } catch (err) {
      console.error("Lỗi khi cập nhật hồ sơ:", err);
      setError(err.message || "Không thể cập nhật hồ sơ. Vui lòng thử lại.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    reset(originalData);
    setIsEditing(false);
  };

  const getInitials = () => {
    if (!profileData) return '?';
    const firstNameInitial = profileData.firstName?.[0] || '';
    const lastNameInitial = profileData.lastName?.[0] || '';
    return `${firstNameInitial}${lastNameInitial}`.toUpperCase();
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen text="Đang tải hồ sơ..." />;
  }

  if (!profileData) {
    return <ProfileContainer><ErrorMessage message={error || "Không thể tải dữ liệu hồ sơ."} /></ProfileContainer>;
  }

return (
  <ProfileContainer>
    <ProfileHeader>
      <ProfileTitle>Hồ sơ của tôi</ProfileTitle>
      <ProfileSubtitle>Quản lý thông tin cá nhân của bạn</ProfileSubtitle>
    </ProfileHeader>

    <ProfileCard>
      <ProfileSidebar>
        <Avatar>{getInitials()}</Avatar>
        <UserName>{profileData.lastName || ''} {profileData.firstName || 'Người dùng'}</UserName>
        <UserEmail>{profileData.email}</UserEmail>
      </ProfileSidebar>

      <ProfileContent>
        <SectionHeader>
          <SectionTitle>Thông Tin Cá Nhân</SectionTitle>
          {!isEditing && (
            <EditButton onClick={() => setIsEditing(true)}>
              <Edit3 size={16} /> Chỉnh Sửa
            </EditButton>
          )}
        </SectionHeader>

        {success && <p style={{ color: 'green', marginBottom: '1rem' }}>{success}</p>}
        {error && <ErrorMessage message={error} onClose={() => setError('')} show={!!error} />}

        {isEditing ? (
          <EditProfileForm
            onSubmit={onSubmit}
            handleCancel={handleCancel}
            isSaving={isSaving}
            register={register}
            handleSubmit={handleSubmit}
            errors={errors}
          />
        ) : (
          <DisplayProfile profile={profileData} />
        )}

        {/* Quick Actions Section */}
        <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid #e5e7eb' }}>
          <SectionTitle>Thao tác nhanh</SectionTitle>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
            <Link 
              to="/my-orders" 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                backgroundColor: '#3b82f6',
                color: 'white',
                borderRadius: '0.5rem',
                textDecoration: 'none',
                fontWeight: '500',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#2563eb'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#3b82f6'}
            >
              📋 Đơn hàng của tôi
            </Link>
            <Link 
              to="/booking" 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                backgroundColor: '#10b981',
                color: 'white',
                borderRadius: '0.5rem',
                textDecoration: 'none',
                fontWeight: '500',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#059669'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#10b981'}
            >
              🧹 Đặt dịch vụ mới
            </Link>
          </div>
        </div>
        </ProfileContent>
      </ProfileCard>
    </ProfileContainer>
  );
};

export default ProfilePage;
