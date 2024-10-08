import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const TextEffectFramer = ({children, secVal=1.5, deleyVal=0}) => {
    const control = useAnimation();
    const [ref, inView] = useInView({  triggerOnce: true, threshold: 0.3 });
    // const [aniVal, setAniVal] = useState(50);
    // const [prevScrollY, setPrevScrollY] = useState(0);
    // const handleScroll = () => {
    //     const currentScrollY = window.scrollY;
    //     if (currentScrollY < prevScrollY) {
    //         // when scrolling up
    //         setAniVal(50)
    //     } else {
    //         // when scrolling down
    //         setAniVal(-50)
    //     }
    //     setPrevScrollY(currentScrollY);
    // };

    // useEffect(() => {
    //     window.addEventListener('scroll', handleScroll, false);
    //     return () => {
    //         window.removeEventListener('scroll', handleScroll, false);
    //     };
    //     // eslint-disable-next-line
    // }, [prevScrollY]);

    useEffect(() => {
        if (inView) {
            control.start("visible");
        } else {
            control.start("hidden");
        }
    }, [control, inView]);

    const textVarients = {
        hidden: {
            y: 50,
            opacity: 0,
        },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                deley: deleyVal,
                duration: secVal,
                type: 'spring',
                bounce: 0.1

            }
        }
    };

    return (
        <>
            <div ref={ref} style={{overflow: ''}}>
                <motion.div
                    variants={textVarients}
                    animate={control}
                >
                    {children}
                </motion.div>
            </div>
        </>
    )
}

export default TextEffectFramer;