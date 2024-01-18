import { useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Toolbar,
} from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import AccessibilityIcon from '@mui/icons-material/Accessibility';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import WorkIcon from '@mui/icons-material/Work';
import AddCardIcon from '@mui/icons-material/AddCard';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import SavingsIcon from '@mui/icons-material/Savings';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import CreditScoreIcon from '@mui/icons-material/CreditScore';
import ElderlyIcon from '@mui/icons-material/Elderly';
import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';

const drawerWidth = 100;
const closeWidth = 12;
const transitionDuration = 1000;

const CustomerSidebar = () => {
  const [open, setOpen] = useState(false);
  const { custId } = useParams();
  const basePath = `/customers/${custId}/edit/`;

  const items = [
    { text: 'Person', to: basePath + 'details', icon: <AccessibilityIcon /> },
    { text: 'Barn', to: basePath + 'children', icon: <ChildCareIcon /> },
    { text: 'Arbetsförhållande', to: basePath + 'workConditions', icon: <WorkIcon /> },
    { text: 'Inkomst', to: basePath + 'income', icon: <AddCardIcon /> },
    { text: 'Utgift', to: basePath + 'expenses', icon: <ShoppingCartCheckoutIcon /> },
    { text: 'Investering', to: basePath + 'investment', icon: <SavingsIcon /> },
    { text: 'Bankmedel', to: basePath + 'bankfunds', icon: <AccountBalanceWalletIcon /> },
    { text: 'Lån', to: basePath + 'liability', icon: <CreditScoreIcon /> },
    { text: 'Egendom', to: basePath + 'assets', icon: <DirectionsCarIcon /> },
    { text: 'Försäkring', to: basePath + 'insurances', icon: <HealthAndSafetyIcon /> },
    { text: 'Pension', to: basePath + 'pension', icon: <ElderlyIcon /> },
  ];

  const handleToggleDrawer = () => {
    setOpen(!open);
  };

  const listItemButtonSx = {
    width: !open ? '40px' : 'auto',
    paddingX: open ? 3 : 1,
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: open ? drawerWidth : closeWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
      }}
      transitionDuration={{
        enter: transitionDuration,
        exit: transitionDuration,
      }}
      open={open}>
      <Toolbar sx={{ marginBottom: 0.5 }} />
      <ListItem disablePadding sx={{ overflow: 'hidden' }}>
        <ListItemButton onClick={handleToggleDrawer} sx={{ ...listItemButtonSx }}>
          <ListItemIcon>{open ? <MenuOpenIcon /> : <MenuIcon />}</ListItemIcon>
          {open && <ListItemText primary="Formulär" />}
        </ListItemButton>
      </ListItem>

      <Divider />
      <List sx={{ overflow: 'hidden' }}>
        {items.map((item, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton
              component={Link}
              sx={{
                ...listItemButtonSx,
              }}
              to={item.to}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              {open && <ListItemText primary={item.text} />}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default CustomerSidebar;
