import { Button, Card, CardActions, CardContent, Grid, Typography } from '@mui/material';
import React from 'react';
import { Link, useParams } from 'react-router-dom';

interface CardProps {
  field: string;
  value: string | number;
  href: string;
  key: number;
}

const DashboardCard: React.FC<CardProps> = (props) => {
  const { custId } = useParams();
  const baseViewPath = `/customers/${custId}/view/`;
  const baseEditPath = `/customers/${custId}/edit/`;

  return (
    <Grid item xs={2} minWidth="280px">
      <Card>
        <CardContent>
          <Typography variant="overline">{props.field}</Typography>
          <Typography>{props.value}</Typography>
        </CardContent>
        <CardActions>
          <Button component={Link} to={baseViewPath + props.href}>
            Granska
          </Button>
          <Button component={Link} to={baseEditPath + props.href}>
            Redigera
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );
};

export default DashboardCard;
