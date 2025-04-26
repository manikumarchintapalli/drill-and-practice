// src/components/PracticeTable.tsx
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Chip,
  Pagination,
  Stack,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useNavigate } from 'react-router-dom';

export interface Problem {
  id: string;
  title: string;
  topic: string;
  status: 'todo' | 'attempted' | 'solved';
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

interface PracticeTableProps {
  problems: Problem[];
  isLoading?: boolean;
}

const slugify = (text: string) =>
  text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

const PracticeTable: React.FC<PracticeTableProps> = ({
  problems,
  isLoading = false,
}) => {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | Problem['status']>('All');
  const [filterDifficulty, setFilterDifficulty] = useState<'All' | Problem['difficulty']>('All');
  const [localProblems, setLocalProblems] = useState<Problem[]>(problems);

  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    setLocalProblems(problems);
  }, [problems]);

  const handleStatusChange = (id: string, newStatus: Problem['status']) => {
    setLocalProblems(lp =>
      lp.map(p => (p.id === id ? { ...p, status: newStatus } : p))
    );
  };

  const filtered = localProblems
    .filter(p => {
      const q = search.toLowerCase();
      return (
        !search ||
        p.topic.toLowerCase().includes(q) ||
        p.title.toLowerCase().includes(q)
      );
    })
    .filter(p => (filterStatus === 'All' ? true : p.status === filterStatus))
    .filter(p => (filterDifficulty === 'All' ? true : p.difficulty === filterDifficulty));

  const difficultyColorMap: Record<Problem['difficulty'], 'success' | 'warning' | 'error'> = {
    Easy: 'success',
    Medium: 'warning',
    Hard: 'error',
  };

  if (isLoading) {
    return (
      <Typography textAlign="center" py={4}>
        Loading…
      </Typography>
    );
  }

  return (
    <Box sx={{ mt: { xs: 4, md: 6 } }}>
      {/* Filters */}
      <Stack
        direction="row"
        flexWrap="wrap"
        spacing={2}
        alignItems="center"
        justifyContent="space-between"
        mb={4}
      >
        <Stack direction="row" spacing={2} flexWrap="wrap">
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={filterStatus}
              label="Status"
              onChange={e => setFilterStatus(e.target.value as any)}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="todo">To Do</MenuItem>
              <MenuItem value="attempted">Attempted</MenuItem>
              <MenuItem value="solved">Solved</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Difficulty</InputLabel>
            <Select
              value={filterDifficulty}
              label="Difficulty"
              onChange={e => setFilterDifficulty(e.target.value as any)}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Easy">Easy</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="Hard">Hard</MenuItem>
            </Select>
          </FormControl>

          <TextField
            size="small"
            variant="outlined"
            placeholder="Search"
            sx={{ minWidth: 220 }}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </Stack>
      </Stack>

      {/* Table */}
      <Box
        sx={{
          overflowX: 'auto',
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 1,
        }}
      >
        <Table>
          <TableHead sx={{ bgcolor: theme.palette.grey[200] }}>
            <TableRow>
              <TableCell align="center">Status</TableCell>
              <TableCell>Question</TableCell>
              <TableCell>Difficulty</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filtered.map(p => (
              <TableRow key={p.id}>
                <TableCell align="center">
                  <FormControl fullWidth size="small">
                    <Select
                      value={p.status}
                      onChange={e =>
                        handleStatusChange(p.id, e.target.value as Problem['status'])
                      }
                    >
                      <MenuItem value="todo">To Do</MenuItem>
                      <MenuItem value="attempted">Attempted</MenuItem>
                      <MenuItem value="solved">Solved</MenuItem>
                    </Select>
                  </FormControl>
                </TableCell>

                <TableCell>
                  <Typography fontWeight="bold" fontSize="0.95rem">
                    {p.title}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Chip
                    label={p.difficulty}
                    color={difficultyColorMap[p.difficulty]}
                    size="small"
                    sx={{ fontWeight: 500 }}
                  />
                </TableCell>

                <TableCell align="center">
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<PlayArrowIcon />}
                    onClick={() =>
                      navigate(`/practice/${slugify(p.topic)}/${p.id}`)
                    }
                    sx={{ whiteSpace: 'nowrap' }}
                  >
                    Start
                  </Button>
                </TableCell>
              </TableRow>
            ))}

            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <Typography color="text.secondary">
                    No questions found matching your criteria.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Box>

      {/* Pagination */}
      <Stack mt={4} alignItems="center">
        <Pagination count={3} color="primary" />
      </Stack>
    </Box>
  );
};

PracticeTable.propTypes = {
  problems: PropTypes.array.isRequired,
  isLoading: PropTypes.bool,
};

export default PracticeTable;