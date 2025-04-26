// import { useState } from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   Button,
//   Alert,
// } from "@mui/material";
// import { useResetPasswordService } from "../api/apiServices";

// const ResetPasswordDialog = ({ show, onClose }) => {
//   const [form, setForm] = useState({
//     currentPassword: "",
//     newPassword: "",
//     confirmPassword: "",
//   });

//   const [error, setError] = useState(null);
//   const { mutate, isPending } = useResetPasswordService();

//   const handleChange = (e) => {
//     setForm((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   const handleReset = () => {
//     setError(null);

//     if (form.newPassword !== form.confirmPassword) {
//       setError("Passwords do not match.");
//       return;
//     }

//     mutate(
//       {
//         currentPassword: form.currentPassword,
//         newPassword: form.newPassword,
//       },
//       {
//         onSuccess: () => {
//           onClose();
//           setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
//         },
//         onError: (err) => {
//           const msg = err?.response?.data || "Something went wrong.";
//           setError(msg);
//         },
//       }
//     );
//   };

//   return (
//     <Dialog open={show} onClose={onClose} fullWidth maxWidth="xs">
//       <DialogTitle>Reset Password</DialogTitle>

//       <DialogContent
//         dividers
//         sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
//       >
//         {error && <Alert severity="error">{error}</Alert>}

//         <TextField
//           label="Current Password"
//           name="currentPassword"
//           type="password"
//           value={form.currentPassword}
//           onChange={handleChange}
//           fullWidth
//         />
//         <TextField
//           label="New Password"
//           name="newPassword"
//           type="password"
//           value={form.newPassword}
//           onChange={handleChange}
//           fullWidth
//         />
//         <TextField
//           label="Confirm Password"
//           name="confirmPassword"
//           type="password"
//           value={form.confirmPassword}
//           onChange={handleChange}
//           fullWidth
//         />
//       </DialogContent>

//       <DialogActions>
//         <Button onClick={onClose} variant="outlined" disabled={isPending}>
//           Cancel
//         </Button>
//         <Button onClick={handleReset} variant="contained" disabled={isPending}>
//           {isPending ? "Updating..." : "Reset Password"}
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default ResetPasswordDialog;

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
} from '@mui/material';
import { AxiosError } from 'axios';
import { useResetPasswordService } from '../api/apiServices';

interface ResetPasswordDialogProps {
  show: boolean;
  onClose: () => void;
}

const ResetPasswordDialog: React.FC<ResetPasswordDialogProps> = ({ show, onClose }) => {
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState<string | null>(null);

  const { mutate, isPending } = useResetPasswordService();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleReset = () => {
    setError(null);

    if (form.newPassword !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    mutate(
      {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      },
      {
        onSuccess: () => {
          setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
          onClose();
        },
        onError: (err) => {
          const axiosErr = err as AxiosError<{ message?: string }>;
          setError(axiosErr.response?.data?.message || 'Something went wrong.');
        },
      }
    );
  };

  return (
    <Dialog open={show} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Reset Password</DialogTitle>
      <DialogContent
        dividers
        sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}
      >
        {error && <Alert severity="error">{error}</Alert>}
        <TextField
          label="Current Password"
          name="currentPassword"
          type="password"
          value={form.currentPassword}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="New Password"
          name="newPassword"
          type="password"
          value={form.newPassword}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          value={form.confirmPassword}
          onChange={handleChange}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isPending}>
          Cancel
        </Button>
        <Button onClick={handleReset} variant="contained" disabled={isPending}>
          {isPending ? 'Updating…' : 'Reset Password'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ResetPasswordDialog;