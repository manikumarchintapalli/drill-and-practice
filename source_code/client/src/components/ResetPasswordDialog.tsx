
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
  Snackbar,
} from '@mui/material';
import { useResetPasswordService } from '../api/apiServices';

interface ResetPasswordDialogProps {
  show: boolean;
  onClose: () => void;
}

const ResetPasswordDialog: React.FC<ResetPasswordDialogProps> = ({
  show,
  onClose,
}) => {
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Pull status instead of isLoading
  const { mutate, status } = useResetPasswordService();
  const isLoading = status === 'pending';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setError(null);

    mutate(
      {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      },
      {
        onSuccess: () => {
          setSuccess(true);
          setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        },
        onError: (err: any) => {
          setError(err.response?.data?.message || 'Something went wrong.');
        },
      }
    );
  };

  return (
    <>
      <Dialog
        open={show}
        onClose={onClose}
        fullWidth
        maxWidth="xs"
        aria-labelledby="reset-password-dialog-title"
      >
        <form onSubmit={handleSubmit} noValidate>
          <DialogTitle id="reset-password-dialog-title">
            Reset Password
          </DialogTitle>

          <DialogContent
            dividers
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            {error && <Alert severity="error">{error}</Alert>}

            <TextField
              label="Current Password"
              name="currentPassword"
              type="password"
              autoComplete="current-password"
              value={form.currentPassword}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="New Password"
              name="newPassword"
              type="password"
              autoComplete="new-password"
              value={form.newPassword}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              value={form.confirmPassword}
              onChange={handleChange}
              fullWidth
            />
          </DialogContent>

          <DialogActions>
            <Button onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={isLoading}>
              {isLoading ? 'Updating…' : 'Reset Password'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={() => {
          setSuccess(false);
          onClose();
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => {
            setSuccess(false);
            onClose();
          }}
          severity="success"
          sx={{ width: '100%' }}
        >
          Password updated successfully!
        </Alert>
      </Snackbar>
    </>
  );
};

export default ResetPasswordDialog;