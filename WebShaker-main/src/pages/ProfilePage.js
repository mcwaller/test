import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { Container, Typography, Box } from '@mui/material';
import ProfileHandler from '../sections/@dashboard/profile/ProfileHandler';
import useResponsive from '../hooks/useResponsive';

/* //-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-// */

const StyledRoot = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const StyledContent = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

/* //-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-// */

export default function ProfilePage() {
  return (
    <>
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Profile
        </Typography>
      </Container>

      <StyledRoot>
        <StyledContent>
          <ProfileHandler />
        </StyledContent>
      </StyledRoot>
    </>
  );
}
