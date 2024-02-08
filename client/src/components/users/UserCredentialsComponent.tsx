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
import React, { useState } from 'react';
import {
  deleteUserById,
  getSingleUserById,
  updateSingleUserById,
} from '../../services/api/apiUserCalls';
import UpdateUserModel from './models/UpdateUserModel';
import UserModel from './models/UserModel';
import { enqueueSnackbar } from 'notistack';
import { useMutation, useQuery, useQueryClient } from 'react-query';

export interface UserCredentialsProps {
  onClose: () => void;
  _id: string;
}

const UserCredentialsComponent: React.FC<UserCredentialsProps> = ({ onClose, _id }) => {
  const [userModel, setUserModel] = useState<UpdateUserModel>();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const handleInputChange = (field: string, value: string | boolean) => {
    setUserModel((prevUserModel) => ({
      ...prevUserModel,
      [field]: value,
    }));
  };

  const { isLoading } = useQuery({
    queryKey: ['user', _id],
    queryFn: () => getSingleUserById(_id),

    onSuccess: (data) => {
      const { name, email, isAdmin } = data as UserModel;

      setUserModel({
        name,
        email,
        isAdmin,
      });
    },

    onError: (error) => {
      enqueueSnackbar(error as String, {
        variant: 'error',
      });
    },
  });

  const { mutateAsync: updateUser } = useMutation({
    mutationFn: () => updateSingleUserById(_id, userModel!),
    onSuccess: () => {
      enqueueSnackbar(`${userModel!.name}'s konto ändrat.`, {
        variant: 'info',
      });

      queryClient.invalidateQueries(['users']);
      onClose();
    },
    onError: (error) => {
      enqueueSnackbar(error as String, {
        variant: 'error',
      });
    },
  });

  const { mutateAsync: handleRemoveClick } = useMutation({
    mutationFn: () => deleteUserById(_id),
    onSuccess: () => {
      enqueueSnackbar(`${userModel!.name}'s konto borttaget.`, {
        variant: 'info',
      });

      queryClient.invalidateQueries(['users']);
      onClose();
    },
    onError: (error) => {
      enqueueSnackbar(error as String, {
        variant: 'error',
      });
    },
  });

  return (
    <Container>
      {!isLoading ? (
        <CardContent
          sx={{
            height: 340,
            width: '100%',
          }}>
          <form
            id="userUpdating"
            name="updateUserForm"
            onSubmit={() => updateUser()}
            style={{
              height: '100%',
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <IconButton
              aria-label="close"
              onClick={onClose}
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
                      onClick={() => setShowPassword(!showPassword)}
                      onMouseDown={(e) => e.preventDefault()}
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
              <Button variant="contained" color="error" onClick={() => handleRemoveClick()}>
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
