// src/components/MCQQuestion.tsx
import React from "react";
import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Box,
  useTheme,
} from "@mui/material";

interface MCQQuestionProps {
  options: string[];
  selectedOption: number | null;
  onChange: (value: number) => void;
  submitted: boolean;
  answerIndex: number;
}

const MCQQuestion: React.FC<MCQQuestionProps> = ({
  options,
  selectedOption,
  onChange,
  submitted,
  answerIndex,
}) => {
  const theme = useTheme();

  return (
    <FormControl component="fieldset" sx={{ width: "100%" }}>
      <FormLabel component="legend">Choose the correct answer:</FormLabel>
      <RadioGroup
        name="mcq"
        value={selectedOption != null ? String(selectedOption) : ""}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
      >
        {options.map((option, idx) => {
          const isCorrect = idx === answerIndex;
          const isSelected = idx === selectedOption;
          const isWrong = submitted && isSelected && !isCorrect;
          const isRight = submitted && isCorrect;

          return (
            <Box
              key={idx}
              sx={{
                border: `1px solid ${
                  isRight
                    ? theme.palette.success.main
                    : isWrong
                    ? theme.palette.error.main
                    : theme.palette.grey[300]
                }`,
                borderRadius: theme.shape.borderRadius,
                px: 2,
                py: 1,
                backgroundColor: isRight
                  ? theme.palette.success.light
                  : isWrong
                  ? theme.palette.error.light
                  : "transparent",
                my: 1,
              }}
            >
              <FormControlLabel
                value={String(idx)}
                control={<Radio disabled={submitted} />}
                label={option}
              />
            </Box>
          );
        })}
      </RadioGroup>
    </FormControl>
  );
};

export default MCQQuestion;