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
  Tooltip,
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
import GroupRemoveIcon from '@mui/icons-material/GroupRemove';
import CustomerDeleteDialog from '../edit/CustomerDeleteDialog';

const drawerWidth = 100;
const closeWidth = 12;
const transDuration = 1000;

const CustomerSidebar = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const { custId } = useParams();
  const basePath = `/customers/${custId}/edit/`;

  const items = [
    { text: 'Personer', to: basePath + 'details', icon: <AccessibilityIcon /> },
    { text: 'Barn', to: basePath + 'children', icon: <ChildCareIcon /> },
    { text: 'Arbetsförhållanden', to: basePath + 'workConditions', icon: <WorkIcon /> },
    { text: 'Inkomster', to: basePath + 'income', icon: <AddCardIcon /> },
    { text: 'Utgifter', to: basePath + 'expenses', icon: <ShoppingCartCheckoutIcon /> },
    { text: 'Investeringar', to: basePath + 'investments', icon: <SavingsIcon /> },
    { text: 'Bankmedel', to: basePath + 'bankfunds', icon: <AccountBalanceWalletIcon /> },
    { text: 'Lån', to: basePath + 'liabilities', icon: <CreditScoreIcon /> },
    { text: 'Egendomar', to: basePath + 'assets', icon: <DirectionsCarIcon /> },
    { text: 'Försäkringar', to: basePath + 'insurances', icon: <HealthAndSafetyIcon /> },
    { text: 'Pensioner', to: basePath + 'pension', icon: <ElderlyIcon /> },
  ];

  const handleToggleDrawer = () => {
    setOpen(!open);
  };

  const listItemButtonSx = {
    width: !open ? '40px' : 'auto',
    paddingX: open ? 3 : 1,
  };

  const sidebarSx = {
    zIndex: 1000,
    width: open ? drawerWidth : closeWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  };

  const handleDialogOpen = () => {
    setDialogOpen(!dialogOpen);
  };

  const customerDeleteConfirm = () => {
    handleDialogOpen();
    console.log('custId deleted:', custId);
  };

  const customerDeleteCanceled = () => {
    handleDialogOpen();
    console.log('custId not deleted:', custId);
  };

  return (
    <Drawer
      variant="permanent"
      sx={{ ...sidebarSx }}
      transitionDuration={transDuration}
      open={open}>
      <Toolbar sx={{ marginBottom: 0.5 }} />
      <ListItem key="open" disablePadding sx={{ overflow: 'hidden' }}>
        <Tooltip title={open ? 'Stäng sidomeny' : 'Öppna sidomeny'} placement="right" arrow>
          <ListItemButton onClick={handleToggleDrawer} sx={{ ...listItemButtonSx }}>
            <ListItemIcon>{open ? <MenuOpenIcon /> : <MenuIcon />}</ListItemIcon>
            {open && <ListItemText primary="Formulär" />}
          </ListItemButton>
        </Tooltip>
      </ListItem>

      <Divider />
      <List sx={{ overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}>
        {items.map((item, index) => (
          <ListItem key={index} disablePadding>
            <Tooltip title={!open && item.text} placement="right" arrow>
              <ListItemButton
                component={Link}
                sx={{
                  ...listItemButtonSx,
                }}
                to={item.to}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                {open && <ListItemText primary={item.text} />}
              </ListItemButton>
            </Tooltip>
          </ListItem>
        ))}
        <ListItem key={items.length} disablePadding sx={{ marginTop: 'auto' }}>
          <Tooltip title={!open && 'Radera kund'} placement="right" arrow>
            <ListItemButton
              sx={{
                ...listItemButtonSx,
              }}
              onClick={handleDialogOpen}>
              <ListItemIcon>
                <GroupRemoveIcon color="error" />
              </ListItemIcon>
              {open && <ListItemText primary="Radera kund" />}
            </ListItemButton>
          </Tooltip>
        </ListItem>
      </List>
      <CustomerDeleteDialog
        deleteDialogOpen={dialogOpen}
        deleteConfirm={customerDeleteConfirm}
        deleteCanceled={customerDeleteCanceled}
      />
    </Drawer>
  );
};

export default CustomerSidebar;
