import { VisibilityOff, Visibility } from '@mui/icons-material';
import {
  CardContent,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  MenuItem,
  CardActions,
  Button,
  Select,
  Container,
  CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import React, { useEffect, useState } from 'react';
import {
  deleteUserById,
  getSingleUserById,
  updateSingleUserById,
} from '../../services/api/apiUserCalls';
import UpdateUserModel from './models/UpdateUserModel';
import UserModel from './models/UserModel';
import { enqueueSnackbar } from 'notistack';

export interface UserCredentialsProps {
  onUserChanged: () => void;
  onClose: () => void;
  _id: string;
}

const UserCredentialsComponent: React.FC<UserCredentialsProps> = ({
  onUserChanged,
  onClose,
  _id,
}) => {
  const [userModel, setUserModel] = useState<UpdateUserModel>();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, isLoading] = useState<boolean>(true);

  const getSelectedUser = async () => {
    const response = await getSingleUserById(_id);

    if (response.success && response.status === 200) {
      const { name, email, isAdmin } = response.data as UserModel;

      setUserModel({
        name,
        email,
        isAdmin,
      });
    } else {
      enqueueSnackbar(response.error!, {
        variant: 'error',
      });
    }
    isLoading(false);
  };
  useEffect(() => {
    getSelectedUser();
  });

  const handleClose = () => {
    onClose();
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setUserModel((prevUserModel) => ({
      ...prevUserModel,
      [field]: value,
    }));
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const updateUser = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const response = await updateSingleUserById(_id, userModel!);

    if (response.success && response.status === 200) {
      enqueueSnackbar(`${userModel!.name}'s konto ändrat.`, {
        variant: 'info',
      });

      onUserChanged();
    } else {
      enqueueSnackbar(response.error!, {
        variant: 'error',
      });
    }
  };

  const removeUser = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    const response = await deleteUserById(_id);

    if (response.success && response.status === 200) {
      enqueueSnackbar(`${userModel!.name}'s konto borttaget.`, {
        variant: 'info',
      });
    } else {
      enqueueSnackbar(response.error!, {
        variant: 'error',
      });
    }

    onUserChanged();
  };

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <Container>
      {!loading ? (
        <CardContent
          sx={{
            height: 340,
            width: '100%',
          }}>
          <form
            id="userUpdating"
            name="updateUserForm"
            onSubmit={updateUser}
            style={{
              height: '100%',
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
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
            <FormControl sx={{ m: 0.5, width: '100%' }} variant="outlined">
              <InputLabel htmlFor="name">Namn</InputLabel>
              <OutlinedInput
                id="name"
                type="text"
                value={userModel?.name}
                onChange={(event) => handleInputChange('name', event.target.value)}
                label="Namn"
                autoComplete="name"
              />
            </FormControl>
            <FormControl sx={{ m: 0.5, width: '100%' }} variant="outlined">
              <InputLabel htmlFor="email">Email</InputLabel>
              <OutlinedInput
                id="email"
                type="email"
                value={userModel?.email}
                onChange={(event) => handleInputChange('email', event.target.value)}
                label="Email"
                autoComplete="email"
              />
            </FormControl>
            <FormControl sx={{ m: 0.5, width: '100%' }} variant="outlined">
              <InputLabel htmlFor="password">Lösenord</InputLabel>
              <OutlinedInput
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={userModel?.password}
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
                onChange={(event) => handleInputChange('password', event.target.value)}
                label="Nytt lösenord"
                autoComplete="new-password"
              />
            </FormControl>
            <FormControl sx={{ m: 0.5, width: '100%' }}>
              <InputLabel id="role">Roll</InputLabel>
              <Select
                labelId="role"
                id="isAdmin"
                value={userModel?.isAdmin}
                label="Roll"
                onChange={(event) => handleInputChange('isAdmin', event.target.value === 'true')}
                sx={{ textAlign: 'left' }}>
                <MenuItem value="false">Rådgivare</MenuItem>
                <MenuItem value="true">Ansvarig</MenuItem>
              </Select>
            </FormControl>
            <CardActions
              sx={{
                marginTop: 'auto',
              }}>
              <Button variant="contained" color="primary" type="submit">
                Uppdatera användare
              </Button>
              <Button variant="contained" color="error" onClick={removeUser}>
                Ta bort användare
              </Button>
            </CardActions>
          </form>
        </CardContent>
      ) : (
        <CircularProgress />
      )}
    </Container>
  );
};

export default UserCredentialsComponent;
