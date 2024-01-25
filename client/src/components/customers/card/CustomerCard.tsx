import React from 'react';
import {
  Card,
  CardActions,
  CardContent,
  Divider,
  Grid,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Link } from 'react-router-dom';

interface CustomerCardProps {
  cust: {
    custId: string;
    customerNames: string[];
    lastUpdate: Date;
  };
}
const CustomerCard: React.FC<CustomerCardProps> = ({ cust }) => {
  return (
    <Card
      sx={{
        height: '10rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}>
      <CardContent>
        <Typography textAlign="left" variant="subtitle2" color="text.secondary" gutterBottom>
          {cust.custId}
        </Typography>
        <Divider />
        {cust.customerNames.length ? (
          cust.customerNames.map((name) => (
            <Typography key={name} textAlign="left" variant="subtitle1" color="text.primary">
              {name}
            </Typography>
          ))
        ) : (
          <Typography textAlign="left" variant="subtitle1" color="text.primary">
            Inget namn registrerat.
          </Typography>
        )}
      </CardContent>
      <Grid container alignItems="center" paddingX="16px">
        <Grid item></Grid>
        <Typography variant="caption" textAlign="left" marginLeft="3px" color="text.secondary">
          Uppdaterad: <br />
          {new Date(cust.lastUpdate).toLocaleDateString('sv-SE')}
        </Typography>
        <Grid item marginLeft="auto">
          <CardActions sx={{ gap: '1px', paddingLeft: '20px' }}>
            <Tooltip title={'Titta på kund'}>
              <IconButton sx={{ p: '3px' }} component={Link} to={`${cust.custId}`}>
                <VisibilityIcon />
              </IconButton>
            </Tooltip>
          </CardActions>
        </Grid>
      </Grid>
    </Card>
  );
};

export default CustomerCard;
