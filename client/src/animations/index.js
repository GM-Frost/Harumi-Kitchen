export const buttonClick ={
    whileTap:{scale:0.90},
}
export const fadeInOut ={
    initial:{opacity: 0},
    animate:{opacity: 1},
    exit:{opacity: 0},
};

export const imageScale ={
    animate:{ scale: 1.5},
    transition:{
      repeat: 4,
      repeatType: "reverse",
      duration: 1   
    },
}

export const loaderScale ={
    animate:{ scale: 1.3},
    transition:{
      repeat: Infinity,
      repeatType: "reverse",
      duration: 0.9   
    },
}

export const slideTop={
  initial:{opacity:0, y:30},
  animate:{opacity:1, y:0},
  exit:{opacity:0, y:30}
}

export const slideIn={
  initial:{opacity:0, x:30},
  animate:{opacity:1, x:0},
  exit:{opacity:0, x:30}
}




export const imageWhileHover={
  initial:{opacity:0, y:30},
  animate:{opacity:1, y:30},
  exit:{opacity:0, y:30}
}

export const staggerFadeInOut = (i) =>{
  return{
    initial:{opacity:0, y:50},
    animate:{opacity:1, y:0},
    exit:{opacity:0, y:50},
    transistion:{duration:0.3, delay:i*0.15},
    key:{i},
  }
}