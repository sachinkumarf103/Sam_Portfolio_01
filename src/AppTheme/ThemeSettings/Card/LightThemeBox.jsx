import React, { useContext, useEffect, useState } from 'react';
import { Box, IconButton, MenuItem, Paper, Select, Stack, Tooltip, Typography, styled, useTheme } from '@mui/material';
import { Add, Delete, DoneOutline } from '@mui/icons-material';
import { ThemeModeContext } from '../../ThemeModeProvider';
import TakeThemeDialog from '../TakingColor/TakeThemeDialog';
import ColorPickerDialog from '../TakingColor/ColorPickerDialog';
import ConfirmationDialogBox from '../../../Components/GlobalComponents/ConfirmationDialogBox';
import ColorsPreset from '../ColorsPreset.json';

const BulletPaper = styled(Paper)(({ theme }) => ({
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    cursor: 'pointer'
}));

const defaultLightTheme = JSON.parse(localStorage.getItem('lightTheme')) || {
    themeName: 'Default Light',
    themeColors: {
        backgroundColor: '#F3FDE8',
        foregroundColor: '#96B6C5',
        highlightColor: '#79E0EE',
        fontColor: '#27374D',
    }
};
const userAddedThemeLclS = JSON.parse(localStorage.getItem('userAddedLightTheme')) || [];
const userAddedHighlightLclSrg = JSON.parse(localStorage.getItem('userAddedLightHighlight')) || [];

const LightThemeBox = ({ lightThemeColors, getUserLightTheme, changeThemeHighlightFunc, setIsDrawerOpen }) => {
    const consumer = useContext(ThemeModeContext);
    const { changeHighlight, themeChangerFunc } = consumer.Customization;
    const theme = useTheme();

    const [userAddedTheme, setUserAddedTheme] = useState(userAddedThemeLclS);
    const [userAddedHiglight, setUserAddedHighlight] = useState(userAddedHighlightLclSrg);
    const [newLightThemePresets, setNewLightThemePresets] = useState([...lightThemeColors.themePresets, ...userAddedTheme]);
    const [newThemeHighlight, setNewThemeHighlight] = useState([...lightThemeColors.themeHighlight, ...userAddedHiglight]);

    const [selectTheme, setSelectTheme] = useState(defaultLightTheme.themeName);
    const [selectHighlight, setSelectHighlight] = useState(defaultLightTheme.themeColors.highlightColor);
    const [selectedTheme, setSelectedTheme] = useState({
        themeName: defaultLightTheme.themeName,
        themeColors: {
            backgroundColor: defaultLightTheme.themeColors.backgroundColor,
            foregroundColor: defaultLightTheme.themeColors.foregroundColor,
            highlightColor: selectHighlight,
            fontColor: defaultLightTheme.themeColors.fontColor
        }
    });
    
    const [isThemeDialogOpen, setIsThemeDialogOpen] = useState(false);
    const [colorPickerProps, setColorPickerProps] = useState({
        isOpen: false,
        whichColorBox: 'Highlight',
        defaultColors: ColorsPreset.lightThemePreset.highlightPreset,

    }); 
    const addThemeCounter = newLightThemePresets.length - lightThemeColors.themePresets.length + 1;
    const [confirmationProps, setConfirmationProps] = useState({
        isOpen: false,
        infoMess: 'Successfully added.',
        message: '',
        doneBtnName: 'Yes',
        closeBtnName: 'NO',
        whatChange: 'themeChange'
    });

    // Theme Preset Function
    const selectThemePresetFunc = (e) => {
        const selVal = e.target.value;
        setSelectTheme(selVal);
        const findTheme = newLightThemePresets.filter(preset => preset.themeName === selVal);
        const themeCol = findTheme[0].themeColors;
        themeChangerFunc({ ...themeCol, highlightColor: selectHighlight });
        setSelectedTheme({ themeName: selVal, themeColors: { ...themeCol, highlightColor: selectHighlight } });
        changeThemeHighlightFunc('theme');  // when change theme then call this func and show snackbar message
    }

    // Highlight Function
    const highlightHandlerFunc = (e) => {
        setSelectHighlight(e.target.value);
        changeHighlight(e.target.value);
        setSelectedTheme({ ...selectedTheme, themeColors: { ...selectedTheme.themeColors, highlightColor: e.target.value } });
        changeThemeHighlightFunc('highlight');      // when change highlight then show snackbar message
    }

    useEffect(() => {
        if (theme.palette.mode === 'light') {
            getUserLightTheme(selectedTheme);
        }
        // eslint-disable-next-line
    }, [selectedTheme]);

    // Add Theme Btn 
    const addthemeBtn = (whichBtn) => {
        if (whichBtn === 'themeAddBtn') setIsThemeDialogOpen(true);
        else setColorPickerProps({...colorPickerProps, isOpen: true});

    };

    const userThemeTakingFunc = (themePre, newHighlight) => {
        let allPrestName = newLightThemePresets.map((preset) => preset.themeName);
        if (!allPrestName.includes(themePre.themeName)) {
            setNewLightThemePresets([...newLightThemePresets, themePre]);
            setNewThemeHighlight([...newThemeHighlight, newHighlight]);
            setConfirmationProps({ ...confirmationProps, isOpen: true, infoMess: 'Successfully added Theme.', message: 'Would you like to apply the Theme you just added?', whatChange: 'themeChange' });
            setUserAddedTheme([...userAddedTheme, themePre]);
            localStorage.setItem('userAddedLightTheme', JSON.stringify([...userAddedTheme, themePre]));
            setUserAddedHighlight([...userAddedHiglight, newHighlight]);
            localStorage.setItem('userAddedLightHighlight', JSON.stringify([...userAddedHiglight, newHighlight]));
        } else {
            console.log('Theme already Exits')
        }

    };

    // taking highlight color value from color picker component.
    const selectedColor = (highlightColor) => {
        setNewThemeHighlight([...newThemeHighlight, highlightColor]);
        setUserAddedHighlight([...userAddedHiglight, highlightColor]);
        localStorage.setItem('userAddedLightHighlight', JSON.stringify([...userAddedHiglight, highlightColor]));
        setConfirmationProps({ ...confirmationProps, isOpen: true, infoMess: 'Successfully added highlight.', message: 'Would you like to apply the highlight you just added?', whatChange: 'highlightChange' });
    };

    const confirmDoneBtnFunc = (whatChange) => {
        if (whatChange === 'themeChange') themeApplyAndSaveFunc(); 
        else {
            let highlightLastIndex = newThemeHighlight.length - 1;
            let userhighlight = newThemeHighlight[highlightLastIndex];
            setSelectHighlight(userhighlight);
            changeHighlight(userhighlight);
            localStorage.setItem('lightTheme', JSON.stringify({ themeName: selectedTheme.themeName, themeColors: { ...selectedTheme.themeColors, highlightColor: userhighlight } }));
        }
        setConfirmationProps({ ...confirmationProps, isOpen: false });
        setIsDrawerOpen(false);
    }

    // Apply and Save theme or highlight in localStorage.
    function themeApplyAndSaveFunc() {
        let themePreLastIndex = newLightThemePresets.length - 1;
        let highlightLastIndex = newThemeHighlight.length - 1;
        let userTheme = newLightThemePresets[themePreLastIndex];
        let userhighlight = newThemeHighlight[highlightLastIndex];
        const userThemeColors = userTheme.themeColors;
        setSelectTheme(userTheme.themeName)
        themeChangerFunc({ ...userThemeColors, highlightColor: userhighlight });
        setSelectHighlight(userhighlight);
        localStorage.setItem('lightTheme', JSON.stringify({ themeName: userTheme.themeName, themeColors: { ...userThemeColors, highlightColor: userhighlight } }));
    };

    return (
        <>
            <Box className='lightTheme-boxCard' sx={{ padding: 1, m: 1, border: '1px solid', borderColor: 'mypresetcolor.highlightColor', borderRadius: '10px', backdropFilter: 'blur(5px)' }}>
                {/* Theme Selection */}
                <Box className='theme-select-box' >
                    <Stack mb={0.5} display={'flex'} flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'}>
                        <Typography variant='body1' color={'mypresetcolor.fontColor'}>Theme Presets :</Typography>
                        {/* Add Theme Button */}
                        <Tooltip title={'Add Theme'} >
                            <IconButton size='small' onClick={() => addthemeBtn('themeAddBtn')}>
                                <Add fontSize='small' />
                            </IconButton>
                        </Tooltip>
                    </Stack>
                    {/* Select Theme Preset */}
                    <Select
                        size='small'
                        fullWidth
                        value={selectTheme}
                        onChange={selectThemePresetFunc}
                        sx={{
                            '& .MuiSelect-select .color-boxes': {
                                display: 'none'
                            },
                        }}
                    >
                        {
                            newLightThemePresets.map((item, index) =>
                                <MenuItem key={index} value={item.themeName} sx={{ justifyContent: 'space-between' }}>
                                    {item.themeName}
                                    <Box className='color-boxes' display={'flex'} flexDirection={'row'} gap={0.25}>
                                        {Object.entries(item.themeColors).map((color, ind) => <Tooltip key={ind} title={`${color[0].slice(0, -5).toUpperCase()} : ${color[1]}`}><BulletPaper className='bullet-circle' sx={{ backgroundColor: color[1] }} /></Tooltip>)}
                                        <Tooltip title={selectHighlight}><BulletPaper className='bullet-circle' sx={{ backgroundColor: selectHighlight }} /></Tooltip>
                                    </Box>
                                </MenuItem>)
                        }
                    </Select>
                </Box>
                {/* Highlight Selection */}
                <Box className='highligh-colors-boxes' mt={1}>
                    <Stack display={'flex'} flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'}>
                        <Typography variant='body1' color={'mypresetcolor.fontColor'}>Highlight Colors :</Typography>
                        <Tooltip title={'Add Highlight'}>
                            <IconButton size='small' onClick={() => addthemeBtn('highlightAddBtn')}>
                                <Add fontSize='small' />
                            </IconButton>
                        </Tooltip>
                    </Stack>
                    <Select
                        fullWidth
                        size='small'
                        value={selectHighlight}
                        onChange={highlightHandlerFunc}
                        sx={{
                            '& .MuiSelect-select .del-btn': {
                                display: 'none'
                            },
                            '& .MuiSelect-select .check-icon': {
                                display: 'none'
                            },
                            '& .MuiSelect-select .MuiPaper-root': {
                                width: '100%'
                            }

                        }}
                    >
                        {
                            newThemeHighlight.map((item, ind) =>
                                <MenuItem
                                    key={ind}
                                    value={`${item}`}
                                    // onClick={() => changeHighlight(item)}
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        '&.MuiMenuItem-root .del-btn': {
                                            display: 'none'
                                        },
                                        '&.MuiMenuItem-root:hover .del-btn': {
                                            display: 'block'
                                        },
                                        '&.MuiMenuItem-root .check-icon': {
                                            display: 'none'
                                        },
                                        '&.Mui-selected .check-icon': {
                                            display: 'block'
                                        },
                                        '&.Mui-selected:hover .del-btn': {
                                            display: 'none'
                                        }
                                    }}
                                >
                                    <Stack width={'100%'} display={'flex'} flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'}>
                                        <Paper sx={{ width: '75px', height: '25px', backgroundColor: `${item}`, borderRadius: '5px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                            <Typography variant='caption' component={'div'} textAlign={'right'}>{item}</Typography>
                                        </Paper>

                                        <Tooltip title='Remove' >
                                            <IconButton className='del-btn' size='small' sx={{ p: 0.5 }} onClick={() => console.log('Deleted')} >
                                                <Delete sx={{ fontSize: '1rem' }} />
                                            </IconButton>
                                        </Tooltip>
                                        <DoneOutline className='check-icon' fontSize='small' sx={{ mr: 0.6, fontWeight: 'bold' }} />
                                    </Stack>
                                </MenuItem>
                            )
                        }
                    </Select>
                </Box>
            </Box>

            {/* Take Theme Colors Dialog */}
            {
                isThemeDialogOpen && (
                    <TakeThemeDialog isThemeDialogOpen={isThemeDialogOpen} setIsThemeDialogOpen={setIsThemeDialogOpen} userThemeTakingFunc={userThemeTakingFunc} addThemeCounter={addThemeCounter} newThemePresets={newLightThemePresets}/>
                )
            }
            <ConfirmationDialogBox confirmationProps={confirmationProps} setConfirmationProps={setConfirmationProps} confirmDoneBtnFunc={confirmDoneBtnFunc} />
            <ColorPickerDialog colorPickerProps={colorPickerProps} setColorPickerProps={setColorPickerProps} selectedColor={selectedColor}/>
        </>
    )
}

export default LightThemeBox;