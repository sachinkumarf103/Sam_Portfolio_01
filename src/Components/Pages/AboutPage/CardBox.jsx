import React from 'react';
import { Box, Divider, Paper, Stack, Typography } from '@mui/material';

// contentBoxHight
const CardBox = ({ title = 'Titel', icon: IconComponent, content = <></>, paddingLeft = 2}) => {
    return (
        <>
            <Paper className={`${title.toLowerCase()}-box`} sx={{ height: '100%', backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.1)', borderRadius: '10px', py: 2, pl: paddingLeft, pr: 1 }}>
                <Box className='cardBox-header'>
                    <Stack display={'flex'} flexDirection={'row'} justifyContent={'space-between'} pr={1} pb={1} px={!paddingLeft && 2}>
                        <Typography variant='h5' fontWeight={'bold'} textAlign={'center'} sx={{ display: 'flex', alignItems: 'center' }}>{title}</Typography>
                        <IconComponent />    {/* Icon */}
                    </Stack>
                    <Divider />
                </Box>
                <Box
                    className='cardBox-content'
                    sx={{
                        // height: { xxs: 'auto', md: `${boxData.boxHight}` },
                        // overflowY: {xxs: 'hidden', sm: 'auto'},
                        pr: 1,
                        '&::-webkit-scrollbar': {
                            width: { xxs: 'none', sm: '5px' },
                        },
                        '&::-webkit-scrollbar-track': {
                            backgroundColor: 'grey',
                            borderRadius: '5px',
                        },
                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: 'mypresetcolor.highlightColor',
                            borderRadius: '5px'
                        }
                    }}>
                    {content}   {/* Component */}
                </Box>
            </Paper>
        </>
    )
}

export default CardBox;