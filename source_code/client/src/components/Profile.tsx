
import React, { useEffect, useState } from 'react';
import {
  Container,
  Box,
  Toolbar,
  Avatar,
  Typography,
  TextField,
  Button,
  Stack,
  Alert,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ResetPasswordDialog from '../components/ResetPasswordDialog';
import {
  useGetUserProfileService,
  useUpdateUserProfileService,
  ProfileData,
} from '../api/apiServices';

const editableInputs = [
  { id: 'email', label: 'Email', type: 'email' },
  { id: 'phoneNo', label: 'Phone Number', type: 'tel' },
  { id: 'dob', label: 'Date of Birth', type: 'date' },
];

const Profile: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

 
  const { data: profile, isLoading, isError } = useGetUserProfileService();

  const { mutate: updateProfile, status } = useUpdateUserProfileService();
  
  const isSaving = status === 'pending';


  const [formData, setFormData] = useState<Partial<ProfileData>>({});
  const [avatar, setAvatar] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [showReset, setShowReset] = useState(false);

  
  useEffect(() => {
    if (profile) {
      setFormData({
        email: profile.email,
        phoneNo: profile.phoneNo,
        dob: profile.dob,
      });
      setAvatar(profile.avatar ?? null);
    }
  }, [profile]);

  
  if (isLoading) {
    return (
      <Container sx={{ textAlign: 'center', py: theme.spacing(10) }}>
        <CircularProgress />
      </Container>
    );
  }
  if (isError || !profile) {
    return (
      <Container sx={{ py: theme.spacing(10) }}>
        <Alert severity="error">Failed to load profile</Alert>
      </Container>
    );
  }


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setAvatar(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    updateProfile({
      _id: profile._id,
      ...formData,
      avatar: avatar ?? undefined,
    } as ProfileData);
    setEditMode(false);
  };

  const handleCancel = () => {
    setFormData({
      email: profile.email,
      phoneNo: profile.phoneNo,
      dob: profile.dob,
    });
    setAvatar(profile.avatar ?? null);
    setEditMode(false);
  };


  return (
    <Box
      sx={{
        bgcolor: 'background.default',
        minHeight: '100vh',
        pt: { xs: '56px', sm: '64px' },
        pb: theme.spacing(6),
      }}
    >
      <Toolbar />
      <Container maxWidth="sm">
        <Box
          sx={{
            bgcolor: 'background.paper',
            p: theme.spacing(3),
            borderRadius: 3,
            boxShadow: 2,
          }}
        >
          {/* Header */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            mb={4}
          >
            <Typography variant={isMobile ? 'h6' : 'h5'} fontWeight="bold">
              Profile
            </Typography>
            {!editMode && (
              <Button
                size="small"
                startIcon={<EditIcon />}
                onClick={() => setEditMode(true)}
              >
                Edit
              </Button>
            )}
          </Stack>

          {/* Avatar */}
          <Box textAlign="center" mb={3}>
            <Avatar
              src={avatar ?? '/avatar.svg'}
              sx={{
                width: isMobile ? 90 : 120,
                height: isMobile ? 90 : 120,
                mx: 'auto',
                mb: 1,
              }}
            />
            {editMode && (
              <Stack direction="row" spacing={2} justifyContent="center">
                <Button component="label" size="small" startIcon={<EditIcon />}>
                  Upload
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleAvatar}
                  />
                </Button>
                <Button
                  size="small"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => setAvatar(null)}
                >
                  Remove
                </Button>
              </Stack>
            )}
          </Box>

          {/* Username */}
          <Box textAlign="center" mb={3}>
            <Typography variant="subtitle1">
              Username: <strong>{profile.username}</strong>
            </Typography>
          </Box>

          {/* Editable Fields */}
          <Box component="form" noValidate>
            <Stack spacing={2}>
              {editableInputs.map((inp) => (
                <TextField
                  key={inp.id}
                  fullWidth
                  label={inp.label}
                  name={inp.id}
                  type={inp.type}
                  value={(formData as any)[inp.id] ?? ''}
                  onChange={handleChange}
                  disabled={!editMode}
                />
              ))}
            </Stack>
          </Box>

          {/* Reset Password */}
          <Box textAlign="center" my={4}>
            <Button variant="outlined" onClick={() => setShowReset(true)}>
              Reset Password
            </Button>
          </Box>

          {/* Save / Cancel */}
          {editMode && (
            <Stack direction="row" justifyContent="flex-end" spacing={2}>
              <Button onClick={handleCancel}>Cancel</Button>
              <Button
                variant="contained"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? 'Saving…' : 'Save'}
              </Button>
            </Stack>
          )}
        </Box>
      </Container>

      <ResetPasswordDialog
        show={showReset}
        onClose={() => setShowReset(false)}
      />
    </Box>
  );
};

export default Profile;