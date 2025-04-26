// import {
//   Container,
//   Box,
//   Avatar,
//   Typography,
//   TextField,
//   Button,
//   Stack,
//   Alert,
//   CircularProgress,
//   Grid,
//   useMediaQuery,
//   useTheme,
// } from "@mui/material";
// import { useEffect, useState } from "react";
// import { useGetUserProfileService, useUpdateUserProfileService } from "../api/apiServices";
// import ResetPasswordDialog from "./ResetPasswordDialog";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";

// const inputs = [
//   { id: "username", label: "Username" },
//   { id: "email", label: "Email" },
//   { id: "phoneNo", label: "Phone Number" },
//   { id: "dob", label: "Date of Birth", type: "date" },
// ];

// const Profile = () => {
//   const { data: profile, isLoading, isError } = useGetUserProfileService();
//   const { mutate: updateProfile, isPending: isSaving } = useUpdateUserProfileService();

//   const [formData, setFormData] = useState({});
//   const [avatar, setAvatar] = useState(null);
//   const [editMode, setEditMode] = useState(false);
//   const [showResetDialog, setShowResetDialog] = useState(false);

//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

//   useEffect(() => {
//     if (profile) {
//       setFormData({
//         username: profile.username || "",
//         email: profile.email || "",
//         phoneNo: profile.phoneNo || "",
//         dob: profile.dob || "",
//       });
//       setAvatar(profile.avatar || null);
//     }
//   }, [profile]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleAvatarUpload = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     const reader = new FileReader();
//     reader.onloadend = () => setAvatar(reader.result);
//     reader.readAsDataURL(file);
//   };

//   const handleRemoveAvatar = () => setAvatar(null);

//   const handleSave = () => {
//     updateProfile({ ...formData, avatar });
//     setEditMode(false);
//   };

//   const handleCancel = () => {
//     if (!profile) return;
//     setFormData({
//       username: profile.username || "",
//       email: profile.email || "",
//       phoneNo: profile.phoneNo || "",
//       dob: profile.dob || "",
//     });
//     setAvatar(profile.avatar || null);
//     setEditMode(false);
//   };

//   if (isLoading) {
//     return (
//       <Container sx={{ textAlign: "center", py: 10 }}>
//         <CircularProgress />
//       </Container>
//     );
//   }

//   if (isError) {
//     return (
//       <Container sx={{ py: 10 }}>
//         <Alert severity="error">Failed to load profile</Alert>
//       </Container>
//     );
//   }

//   return (
//     <Box sx={{ bgcolor: "#f9fafb", minHeight: "100vh", pt: { xs: 8, md: 10 }, pb: 6 }}>
//       <Container maxWidth="sm">
//         <Box
//           sx={{
//             bgcolor: "white",
//             p: { xs: 3, sm: 4 },
//             borderRadius: 3,
//             boxShadow: 2,
//           }}
//         >
//           {/* Header */}
//           <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
//             <Typography variant={isMobile ? "h6" : "h5"} fontWeight="bold">
//               Profile
//             </Typography>
//             {!editMode && (
//               <Button
//                 variant="outlined"
//                 size="small"
//                 onClick={() => setEditMode(true)}
//                 startIcon={<EditIcon />}
//               >
//                 Edit
//               </Button>
//             )}
//           </Stack>

//           {/* Avatar */}
//           <Box textAlign="center" mb={3}>
//             <Avatar
//               src={avatar || "/avatar.svg"}
//               alt="avatar"
//               sx={{
//                 width: isMobile ? 90 : 120,
//                 height: isMobile ? 90 : 120,
//                 mx: "auto",
//                 mb: 1,
//               }}
//             />
//             {editMode && (
//               <Stack direction="row" justifyContent="center" spacing={2} flexWrap="wrap">
//                 <Button component="label" variant="outlined" size="small">
//                   Upload
//                   <input type="file" accept="image/*" hidden onChange={handleAvatarUpload} />
//                 </Button>
//                 <Button
//                   variant="outlined"
//                   color="error"
//                   size="small"
//                   startIcon={<DeleteIcon />}
//                   onClick={handleRemoveAvatar}
//                 >
//                   Remove
//                 </Button>
//               </Stack>
//             )}
//           </Box>

//           {/* Form Inputs */}
//           <Box component="form" noValidate>
//             <Grid container spacing={2}>
//               {inputs.map((inp) => (
//                 <Grid item xs="span 12" key={inp.id}>
//                   <TextField
//                     fullWidth
//                     label={inp.label}
//                     name={inp.id}
//                     type={inp.type || "text"}
//                     value={formData[inp.id] || ""}
//                     onChange={handleChange}
//                     disabled={!editMode}
//                   />
//                 </Grid>
//               ))}
//             </Grid>
//           </Box>

//           {/* Reset Password */}
//           <Box textAlign="center" my={4}>
//             <Button variant="outlined" onClick={() => setShowResetDialog(true)}>
//               Reset Password
//             </Button>
//           </Box>

//           {/* Save / Cancel Buttons */}
//           {editMode && (
//             <Stack direction="row" justifyContent="flex-end" spacing={2}>
//               <Button variant="outlined" onClick={handleCancel}>
//                 Cancel
//               </Button>
//               <Button variant="contained" onClick={handleSave} disabled={isSaving}>
//                 {isSaving ? "Saving..." : "Save"}
//               </Button>
//             </Stack>
//           )}
//         </Box>

//         {/* Password Dialog */}
//         <ResetPasswordDialog show={showResetDialog} onClose={() => setShowResetDialog(false)} />
//       </Container>
//     </Box>
//   );
// };

// export default Profile;


// src/components/Profile.tsx
import React, { useEffect, useState } from 'react';
import {
  Container,
  Box,
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
import ResetPasswordDialog from './ResetPasswordDialog';
import {
  useGetUserProfileService,
  useUpdateUserProfileService,
} from '../api/apiServices';

interface ProfileData {
  _id: string;
  username: string;
  email: string;
  phoneNo?: string;
  dob?: string;
  avatar?: string;
}

const inputs = [
  { id: 'username', label: 'Username' },
  { id: 'email', label: 'Email' },
  { id: 'phoneNo', label: 'Phone Number' },
  { id: 'dob', label: 'Date of Birth', type: 'date' },
];

const Profile: React.FC = () => {
  const { data: profile, isLoading, isError } = useGetUserProfileService();
  const { mutate: updateProfile, isPending: isSaving } = useUpdateUserProfileService();
  const [formData, setFormData] = useState<Partial<ProfileData>>({});
  const [avatar, setAvatar] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [showReset, setShowReset] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (profile) {
      setFormData({
        username: profile.username || '',
        email: profile.email || '',
        phoneNo: profile.phoneNo || '',
        dob: profile.dob || '',
      });
      setAvatar(profile.avatar || null);
    }
  }, [profile]);

  if (isLoading) {
    return (
      <Container sx={{ textAlign: 'center', py: theme.spacing(10) }}>
        <CircularProgress />
      </Container>
    );
  }

  if (isError) {
    return (
      <Container sx={{ py: theme.spacing(10) }}>
        <Alert severity="error">Failed to load profile</Alert>
      </Container>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setAvatar(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    updateProfile({ ...formData, avatar });
    setEditMode(false);
  };

  const handleCancel = () => {
    if (!profile) return;
    setFormData({
      username: profile.username,
      email: profile.email,
      phoneNo: profile.phoneNo,
      dob: profile.dob,
    });
    setAvatar(profile.avatar || null);
    setEditMode(false);
  };

  return (
    <Box
      sx={{
        bgcolor: 'background.default',
        minHeight: '100vh',
        pt: { xs: theme.spacing(8), md: theme.spacing(10) },
        pb: theme.spacing(6),
      }}
    >
      <Container maxWidth="sm">
        <Box
          sx={{
            bgcolor: 'background.paper',
            p: theme.spacing(3),
            borderRadius: 3,
            boxShadow: 2,
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
            <Typography variant={isMobile ? 'h6' : 'h5'} fontWeight="bold">
              Profile
            </Typography>
            {!editMode && (
              <Button size="small" onClick={() => setEditMode(true)} startIcon={<EditIcon />}>
                Edit
              </Button>
            )}
          </Stack>

          {/* Avatar */}
          <Box textAlign="center" mb={3}>
            <Avatar
              src={avatar || '/avatar.svg'}
              sx={{
                width: isMobile ? 90 : 120,
                height: isMobile ? 90 : 120,
                mx: 'auto',
                mb: 1,
              }}
            />
            {editMode && (
              <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap">
                <Button component="label" size="small" startIcon={<EditIcon />}>
                  Upload
                  <input type="file" hidden accept="image/*" onChange={handleAvatar} />
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

          {/* Input Fields */}
          <Box component="form" noValidate>
            <Stack spacing={2}>
              {inputs.map(inp => (
                <TextField
                  key={inp.id}
                  fullWidth
                  label={inp.label}
                  name={inp.id}
                  type={inp.type || 'text'}
                  value={formData[inp.id as keyof ProfileData] || ''}
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

          {/* Save / Cancel Buttons */}
          {editMode && (
            <Stack direction="row" justifyContent="flex-end" spacing={2}>
              <Button onClick={handleCancel}>Cancel</Button>
              <Button variant="contained" onClick={handleSave} disabled={isSaving}>
                {isSaving ? 'Saving…' : 'Save'}
              </Button>
            </Stack>
          )}
        </Box>
      </Container>

      <ResetPasswordDialog show={showReset} onClose={() => setShowReset(false)} />
    </Box>
  );
};

export default Profile;