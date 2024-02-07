import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
} from '@mui/material';
import React, { useState } from 'react';
import CreateUserModel from './models/CreateUserModel';
import { VisibilityOff, Visibility } from '@mui/icons-material';
import { useSetRecoilState } from 'recoil';
import { snackbarState } from '../../services/state/RecoilAtoms';
import { createNewUser } from '../../services/api/apiUserCalls';
import CloseIcon from '@mui/icons-material/Close';
import { SubmitHandler, useForm } from 'react-hook-form';

interface CreateUserComponentProps {
  onUserCreated: () => void;
  onClose: () => void;
}

const CreateUserComponent: React.FC<CreateUserComponentProps> = ({ onUserCreated, onClose }) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm<CreateUserModel>();

  const [showPassword, setShowPassword] = useState(false);

  const setSnackbarState = useSetRecoilState(snackbarState);

  const handleClose = () => {
    onClose();
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleRoleChange = (role: string) => {
    setValue('isAdmin', role === 'Admin');
  };

  const onSubmit: SubmitHandler<CreateUserModel> = async (data) => {
    const response = await createNewUser(data);

    if (response.success && response.status === 201) {
      setSnackbarState({
        open: true,
        message: `Konto åt ${response.data!.name} skapat.`,
        severity: 'success',
      });

      onUserCreated();
    } else {
      setSnackbarState({
        open: true,
        message: response.error!,
        severity: 'error',
      });
    }
  };

  return (
    <Container
      component="main"
      maxWidth="xs"
      style={{ padding: 0, paddingRight: 0, paddingLeft: 0 }}>
      <Box>
        <Card>
          <CardContent
            sx={{
              height: '100vh',
              width: 330,
              paddingTop: 8,
            }}>
            <IconButton
              aria-label="close"
              onClick={handleClose}
              sx={{
                position: 'absolute',
                right: 10,
                top: 10,
              }}>
              <CloseIcon />
            </IconButton>
            <form
              id="newUser"
              name="newUserForm"
              onSubmit={handleSubmit(onSubmit)}
              style={{
                height: '100%',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'flex-end',
              }}>
              <FormControl sx={{ m: 0.5, width: '100%' }} variant="outlined">
                <InputLabel htmlFor="name">Namn</InputLabel>
                <OutlinedInput
                  id="name"
                  type="text"
                  label="Namn"
                  {...register('name', { required: 'Namn saknas.' })}
                  autoComplete="name"
                />
              </FormControl>
              <FormControl sx={{ m: 0.5, width: '100%' }} variant="outlined">
                <InputLabel htmlFor="email">Email</InputLabel>
                <OutlinedInput
                  id="email"
                  type="email"
                  {...register('email', { required: 'Email saknas.', pattern: /^\S+@\S+$/i })}
                  label="Email"
                  autoComplete="email"
                />
              </FormControl>
              <FormControl sx={{ m: 0.5, width: '100%' }} variant="outlined">
                <InputLabel htmlFor="password">Lösenord</InputLabel>
                <OutlinedInput
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', { required: 'Lösenord saknas.' })}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Lösenord"
                  autoComplete="new-password"
                />
              </FormControl>
              <FormControl sx={{ m: 0.5, width: '100%' }}>
                <InputLabel id="role">Roll</InputLabel>
                <Select
                  labelId="role"
                  id="createAdmin"
                  label="Roll"
                  defaultValue=""
                  {...register('isAdmin', { required: 'Roll saknas.' })}
                  onChange={(event) => handleRoleChange(event.target.value as string)}
                  sx={{ textAlign: 'left' }}>
                  <MenuItem value="false">Rådgivare</MenuItem>
                  <MenuItem value="true">Ansvarig</MenuItem>
                </Select>
              </FormControl>
              <CardActions
                sx={{
                  marginTop: 'auto',
                }}>
                <Button variant="contained" color="primary" type="submit" disabled={isSubmitting}>
                  {!isSubmitting ? 'Skapa konto' : 'Skapar...'}
                </Button>
              </CardActions>
            </form>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default CreateUserComponent;
