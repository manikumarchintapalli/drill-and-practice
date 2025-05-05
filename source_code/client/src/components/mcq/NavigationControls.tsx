import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

export interface NavigationControlsProps {
  questionIndex: number;
  total: number;
  submitted: boolean;
  disabled: boolean;
  onSubmit: () => void;
  goTo: (delta: number) => void;
}

const NavigationControls = ({
  questionIndex,
  total,
  submitted,
  disabled,
  onSubmit,
  goTo,
}: NavigationControlsProps) => {
  return (
    <Box display="flex" justifyContent="space-between" gap={2} mt={3}>
      {/* Previous */}
      <Box flex={1}>
        <Button
          fullWidth
          variant="outlined"
          onClick={() => goTo(-1)}
          disabled={questionIndex === 0}
        >
          ⬅️ Previous
        </Button>
      </Box>

      {/* Submit */}
      <Box flex={1} display="flex" justifyContent="center">
        <Button
          variant="contained"
          onClick={onSubmit}
          disabled={submitted || disabled}
        >
          {submitted ? "Submitted" : "Submit"}
        </Button>
      </Box>

      {/* Next */}
      <Box flex={1}>
        <Button
          fullWidth
          variant="outlined"
          onClick={() => goTo(1)}
          disabled={questionIndex === total - 1}
        >
          Next ➡️
        </Button>
      </Box>
    </Box>
  );
};

export default NavigationControls;