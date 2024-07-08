import React from 'react';
import { makeStyles, Paper, InputBase, IconButton } from "@material-ui/core";
import SearchIcon from '@material-ui/icons/Search';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles({
    root: {
        fontSize: '1rem !important',
        padding: '0px 4px',
        display: 'flex',
        alignItems: 'center',
        width: 220,
        border: '1px solid #EBEDF2',
        boxShadow: 'none',
        borderRadius: 8,
        height: 35
    },
    input: {
        fontSize: '1rem !important',
        color: '#4e4e4e',
        marginLeft: 8,
        flex: 1,
        fontFamily: 'Mulish'
    },
    iconButton: {
        padding: 8,
        color: '#32a9e2'
    },
});

const Search = ({
    onSearch,
    value,
    setter
}) => {
    const { t } = useTranslation();
    const handleSearchClick = () => {
        onSearch(value);
    };

    const onHandlerKeyDown = (event) => {
        if(event.key == 'Enter'){
            onSearch(value);
        }
    }

    const classes = useStyles();
    return (
        <Paper className={classes.root}>
            <InputBase
                onKeyDown={onHandlerKeyDown}
                value={value}
                className={classes.input}
                placeholder={t('action.search')}
                inputProps={{
                    'aria-label': 'Search...'
                }}
                onChange={e => setter(e.target.value)}
            />
            <IconButton
                className={classes.iconButton}
                aria-label="Search"
                onClick={handleSearchClick}
            >
                <SearchIcon />
            </IconButton>
        </Paper>
    )
};

export default Search;