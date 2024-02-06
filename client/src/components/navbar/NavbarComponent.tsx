import React from 'react';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import { Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useTheme } from '../../theme/ThemeProvider';

const pages = [
  { title: 'Start', link: '/', protected: false },
  { title: 'Användare', link: '/users', protected: true },
  { title: 'Kunder', link: '/customers', protected: true },
];
const settings = [
  { title: 'Mitt konto', link: '/account' },
  { title: 'Logga ut', link: '/logout' },
];

const ResponsiveAppBar = () => {
  const username = localStorage.getItem('USERNAME');
  const token = localStorage.getItem('TOKEN');

  const { toggleTheme, isDarkMode } = useTheme();
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const toggleDarkMode = () => {
    toggleTheme();
  };

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="sticky" sx={{ marginBottom: '20px' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            to={'/'}
            component={Link}
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}>
            GoLife
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="more"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit">
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}>
              {pages.map((page) =>
                (page.protected && token) || !page.protected ? (
                  <MenuItem
                    key={page.title}
                    onClick={handleCloseNavMenu}
                    to={page.link}
                    component={Link}>
                    <Typography textAlign="center">{page.title}</Typography>
                  </MenuItem>
                ) : null
              )}
            </Menu>
          </Box>
          <Typography
            variant="h5"
            noWrap
            to={'/'}
            component={Link}
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}>
            GoLife
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) =>
              (page.protected && token !== undefined) || !page.protected ? (
                <Button
                  LinkComponent={Link}
                  key={page.title}
                  onClick={handleCloseNavMenu}
                  to={page.link}
                  component={Link}
                  sx={{ my: 2, color: 'white', display: 'block' }}>
                  {page.title}
                </Button>
              ) : null
            )}
          </Box>
          {token !== undefined ? (
            <Box sx={{ flexGrow: 0 }}>
              {username}
              <Tooltip title="Öppna inställningar">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, m: 1 }}>
                  <Avatar>{username ? username.substring(0, 1).toUpperCase() : '-'}</Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}>
                <MenuItem
                  key="themetoggler"
                  onClick={() => {
                    toggleDarkMode();
                    handleCloseUserMenu();
                  }}>
                  <Typography textAlign="center">{'Mörkt tema'}</Typography>
                  <ListItemIcon sx={{ ml: 1 }} color="inherit">
                    {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
                  </ListItemIcon>
                </MenuItem>
                {settings.map((setting) => (
                  <MenuItem
                    key={setting.title}
                    to={setting.link}
                    component={Link}
                    onClick={handleCloseUserMenu}>
                    <Typography textAlign="center">{setting.title}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          ) : (
            <Button
              LinkComponent={Link}
              to={'/login'}
              component={Link}
              sx={{ my: 2, color: 'white', display: 'block' }}>
              Logga in
            </Button>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default ResponsiveAppBar;
