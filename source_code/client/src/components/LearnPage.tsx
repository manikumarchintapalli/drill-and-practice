
import React from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import keyPointsData from './data/keyPoints';

const LearnPage: React.FC = () => {
  const { topicSlug } = useParams<{ topicSlug: string }>();
  const topic = keyPointsData[topicSlug || ''];
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      sx={{
        bgcolor: 'background.default',
        minHeight: '100vh',
        py: theme.spacing(6),
        pt: { xs: theme.spacing(10), md: theme.spacing(12) },
      }}
    >
      <Container maxWidth="md">
        {topic ? (
          <>
            <Typography
              variant={isMobile ? 'h5' : 'h4'}
              fontWeight="bold"
              gutterBottom
              sx={{ color: 'secondary.main' }}
            >
              {topic.title} – Key Points
            </Typography>
            <List>
              {topic.points.map((point, idx) => (
                <ListItem key={idx} disableGutters sx={{ mb: 1 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <CheckCircleIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography fontSize={isMobile ? '0.95rem' : '1.05rem'}>
                        {point}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </>
        ) : (
          <Typography color="error" variant="h6" textAlign="center">
            No key points found for this topic.
          </Typography>
        )}
      </Container>
    </Box>
  );
};

export default LearnPage;