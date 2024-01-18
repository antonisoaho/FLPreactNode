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
import { snackbarState } from '../../../recoil/RecoilAtoms';
import { createNewUser } from '../../../apiCalls/apiUserCalls';
import CloseIcon from '@mui/icons-material/Close';

interface CreateUserComponentProps {
  onUserCreated: () => void;
  onClose: () => void;
}

const CreateUserComponent: React.FC<CreateUserComponentProps> = ({ onUserCreated, onClose }) => {
  const initialUserModel: CreateUserModel = {
    name: '',
    email: '',
    password: '',
    isAdmin: false,
  };

  const [userModel, setUserModel] = useState<CreateUserModel>(initialUserModel);
  const [showPassword, setShowPassword] = useState(false);

  const setSnackbarState = useSetRecoilState(snackbarState);

  const handleClose = () => {
    onClose();
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setUserModel((prevUserModel) => ({
      ...prevUserModel,
      [field]: value,
    }));
  };

  const CreateUser = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const response = await createNewUser(userModel);

    if (response.success && response.status === 201) {
      setSnackbarState({
        open: true,
        message: `Konto åt ${response.data!.name} skapat.`,
        severity: 'success',
      });

      setUserModel(initialUserModel);
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
              onSubmit={CreateUser}
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
                  value={userModel.name}
                  required
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
                  value={userModel.email}
                  required
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
                  value={userModel.password}
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
                  required
                  onChange={(event) => handleInputChange('password', event.target.value)}
                  label="Lösenord"
                  autoComplete="new-password"
                />
              </FormControl>
              <FormControl sx={{ m: 0.5, width: '100%' }}>
                <InputLabel id="role">Roll</InputLabel>
                <Select
                  labelId="role"
                  id="createAdmin"
                  value={userModel.isAdmin}
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
                  Skapa konto
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
