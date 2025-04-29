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

const ITEMS_PER_PAGE = 10;

const PracticeTable: React.FC<PracticeTableProps> = ({
  problems,
  isLoading = false,
}) => {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | Problem['status']>('All');
  const [filterDifficulty, setFilterDifficulty] = useState<'All' | Problem['difficulty']>('All');
  const [localProblems, setLocalProblems] = useState<Problem[]>(problems);
  const [page, setPage] = useState(1);

  const navigate = useNavigate();
  const theme = useTheme();

  // whenever the source problems change, reset our local copy
  useEffect(() => {
    setLocalProblems(problems);
  }, [problems]);

  // Automatically reset to page 1 when filters or search change
  useEffect(() => {
    setPage(1);
  }, [search, filterStatus, filterDifficulty]);

  const handleStatusChange = (id: string, newStatus: Problem['status']) => {
    setLocalProblems(lp =>
      lp.map(p => (p.id === id ? { ...p, status: newStatus } : p))
    );
  };

  // Apply search & filters
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

  // Compute pagination
  const pageCount = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

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
            {paginated.map(p => (
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

            {paginated.length === 0 && (
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
      {pageCount > 1 && (
        <Stack mt={4} alignItems="center">
          <Pagination
            count={pageCount}
            page={page}
            onChange={(_, val) => setPage(val)}
            color="primary"
          />
        </Stack>
      )}
    </Box>
  );
};

PracticeTable.propTypes = {
  problems: PropTypes.array.isRequired,
  isLoading: PropTypes.bool,
};

export default PracticeTable;