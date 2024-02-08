import { enqueueSnackbar } from 'notistack';
import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useQueryClient, useMutation } from 'react-query';
import { createNewUser } from '../../../services/api/apiUserCalls';
import CreateUserModel from '../models/CreateUserModel';
import { VisibilityOff, Visibility } from '@mui/icons-material';
import {
  InputAdornment,
  IconButton,
  MenuItem,
  CardActions,
  Button,
  TextField,
} from '@mui/material';

interface CreateUserProps {
  onClose: () => void;
}

const CreateUserForm: React.FC<CreateUserProps> = ({ onClose }) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm<CreateUserModel>();

  const queryClient = useQueryClient();
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const { mutateAsync: onSubmit } = useMutation({
    mutationFn: (data: CreateUserModel) => createNewUser(data),

    onSuccess: (data) => {
      const { name } = data as CreateUserModel;

      enqueueSnackbar(`Användare för ${name} skapad.`, {
        variant: 'success',
      });
      onClose();
      queryClient.invalidateQueries('users');
    },
    onError: (error) => {
      enqueueSnackbar(error as string, {
        variant: 'error',
      });
    },
  });

  const handleRole = [
    {
      label: 'Rådgivare',
      value: false,
    },
    {
      label: 'Ansvarig',
      value: true,
    },
  ];

  return (
    <form
      id="newUser"
      name="newUserForm"
      onSubmit={handleSubmit(onSubmit as SubmitHandler<CreateUserModel>)}
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        gap: '5px',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
      }}>
      <TextField
        fullWidth
        id="name"
        type="text"
        label="Namn"
        {...register('name', { required: 'Namn saknas.' })}
        autoComplete="name"
      />
      <TextField
        fullWidth
        id="email"
        type="email"
        {...register('email', { required: 'Email saknas.', pattern: /^\S+@\S+$/i })}
        label="Email"
        autoComplete="email"
      />
      <TextField
        fullWidth
        id="password"
        label="Lösenord"
        type={showPassword ? 'text' : 'password'}
        {...register('password', { required: 'Lösenord saknas.' })}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end">
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <TextField
        select
        fullWidth
        id="createAdmin"
        label="Roll"
        defaultValue=""
        {...register('isAdmin', { required: 'Roll saknas.' })}
        onChange={(event) => setValue('isAdmin', event.target.value === 'true' ? true : false)}
        sx={{ textAlign: 'left' }}>
        {handleRole.map((option, index) => (
          <MenuItem key={index} value={`${option.value}`}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
      <CardActions
        sx={{
          marginTop: 'auto',
        }}>
        <Button variant="contained" color="primary" type="submit" disabled={isSubmitting}>
          {!isSubmitting ? 'Skapa konto' : 'Skapar...'}
        </Button>
      </CardActions>
    </form>
  );
};

export default CreateUserForm;
