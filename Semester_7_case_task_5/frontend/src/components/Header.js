import React, {useState} from "react";
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Menu,
    MenuItem,
} from "@mui/material";
import {Link, useNavigate} from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonOutlineOutlinedIcon
    from "@mui/icons-material/PersonOutlineOutlined";

function Header() {
    const navigate = useNavigate();

    const userName = localStorage.getItem("user_name");

    const handleLogout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user_name");
        navigate("/login");
    };

    const handleImportExport = () => {
        navigate("/import-export");
    }

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography
                    variant="h6"
                    component={Link}
                    to="/"
                    sx={{flexGrow: 1, textDecoration: "none", color: "inherit"}}
                >
                    MoneyFlow
                </Typography>
                <Button color="inherit" component={Link} to="/transactions">
                    Transactions
                </Button>
                {userName === "admin" && (
                    <Button color="inherit" component={Link} to="/users">
                        Users
                    </Button>
                )}
                <Button
                    aria-controls="simple-menu"
                    aria-haspopup="true"
                    color="inherit"
                    variant="outlined"
                    startIcon={<PersonOutlineOutlinedIcon />}
                    onClick={handleClick}
                    sx={{marginLeft: 3}}
                >
                    {userName || "Guest"}
                </Button>
                <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                >
                    <MenuItem onClick={handleImportExport}>
                        import/export
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>
                        <LogoutIcon sx={{marginRight: 1}}/>
                        Logout
                    </MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    );
}

export default Header;
