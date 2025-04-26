// src/components/FeedbackAlert.tsx
import React from "react";
import { Alert, Typography } from "@mui/material";

interface FeedbackAlertProps {
  submitted: boolean;
  selectedOption?: number;
  correctOption: number;
  options: string[];
}

const FeedbackAlert: React.FC<FeedbackAlertProps> = ({
  submitted,
  selectedOption,
  correctOption,
  options,
}) => {
  if (!submitted) return null;

  const isCorrect = selectedOption === correctOption;

  return (
    <Alert
      severity={isCorrect ? "success" : "error"}
      sx={theme => ({
        mt: theme.spacing(2),
      })}
    >
      {isCorrect ? (
        <Typography variant="body1" color="text.primary">
          🎉 Correct!
        </Typography>
      ) : (
        <>
          <Typography variant="body1" color="text.primary">
            ❌ Incorrect.
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 1 }}
          >
            <strong>Correct Answer:</strong> {options[correctOption]}
          </Typography>
        </>
      )}
    </Alert>
  );
};

export default FeedbackAlert;