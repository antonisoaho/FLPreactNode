import { VisibilityOff, Visibility } from '@mui/icons-material';
import {
  IconButton,
  TextField,
  InputAdornment,
  MenuItem,
  CardActions,
  Button,
  CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import React, { useState } from 'react';
import PromptDialog from '../../ui/promtDialog/PromptDialog';
import { enqueueSnackbar } from 'notistack';
import {
  deleteUserById,
  getSingleUserById,
  updateSingleUserById,
} from '../../../services/api/apiUserCalls';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import UserModel from '../models/UserModel';
import UpdateUserModel from '../models/UpdateUserModel';

type CredentialsFormProps = {
  onClose: () => void;
  _id: string;
};

const CredentialsForm: React.FC<CredentialsFormProps> = ({ onClose, _id }) => {
  const [userModel, setUserModel] = useState<UpdateUserModel>();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
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

    onSuccess: (data: UserModel) => {
      const { name, email, isAdmin } = data;

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

  if (isLoading) return <CircularProgress />;
  if (userModel)
    return (
      <>
        <PromptDialog
          confirm={() => {
            handleRemoveClick();
            setDeleteDialogOpen(false);
          }}
          canceled={() => setDeleteDialogOpen(false)}
          dialogOpen={deleteDialogOpen}
          title={'Radera användare'}
          prompt={`Är du säker på att du vill ta bort användaren för ${userModel?.name}?`}
          color={'error'}
        />
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
            gap: 1,
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
          <TextField
            type="text"
            value={userModel.name}
            onChange={(event) => handleInputChange('name', event.target.value)}
            label="Namn"
            autoComplete="name"
          />
          <TextField
            type="email"
            value={userModel.email}
            onChange={(event) => handleInputChange('email', event.target.value)}
            label="Email"
            autoComplete="email"
          />

          <TextField
            type={showPassword ? 'text' : 'password'}
            value={userModel.password}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    onMouseDown={(e) => e.preventDefault()}
                    edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            onChange={(event) => handleInputChange('password', event.target.value)}
            label="Nytt lösenord"
            autoComplete="new-password"
          />

          <TextField
            id="isAdmin"
            select
            value={userModel.isAdmin}
            label="Roll"
            onChange={(event) => handleInputChange('isAdmin', event.target.value === 'true')}
            sx={{ textAlign: 'left' }}>
            <MenuItem value="false">Rådgivare</MenuItem>
            <MenuItem value="true">Ansvarig</MenuItem>
          </TextField>
          <CardActions
            sx={{
              position: 'absolute',
              bottom: 10,
              right: 10,
            }}>
            <Button variant="contained" color="primary" type="submit">
              Uppdatera användare
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => setDeleteDialogOpen(!deleteDialogOpen)}>
              Ta bort användare
            </Button>
          </CardActions>
        </form>
      </>
    );
};

export default CredentialsForm;
