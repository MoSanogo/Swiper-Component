import React, { useRef, useEffect, useState,useReducer } from 'react';
import { View, Animated, PanResponder, Dimensions,StyleSheet,SafeAreaView,LayoutAnimation,UIManager,Platform} from 'react-native';
const SWIPE_OUT_DURATION=250;


//We are using reudcer here because the next value of the state deepends on the initial one.

 const rootReducer=(state,{type})=>{
   switch(type){
     case "NEXT":
     return state+1;
     default:
     return state;
   }

 }
export default ({ renderCard, data,onSwipeLeft,onSwipeRight,renderNoMoreCards }) => {

 //We define a state to keep strack of which we are swiping.

       const[Index,dispatch]=useReducer(rootReducer,0);


  //SCREEN_WIDTH defines the width of the current screen,
  const [SCREEN_WIDTH, setSCREEN_WIDTH] = useState(() => {
    const { width } = Dimensions.get('window');
    return width;
  });

//forceSwipeRight

const forceSwipe=(direction)=>{
  const x=direction==="right"? SCREEN_WIDTH*2.5 : -SCREEN_WIDTH*2.5;
   Animated.timing(position,{
     toValue:{x,y:0},
     duration:SWIPE_OUT_DURATION,
     useNativeDriver: false
   }).start(()=>onSwipeComplete(direction))
}

const onSwipeComplete=(direction)=>{
  const item=data[Index];
   direction==="right"? onSwipeLeft(item):onSwipeRight(item);
   
   //We forcibly reset the position back to zero.

   position.setValue({x:0,y:0})

   //We incriment the Index value to get the next item in data.
     dispatch({type:"NEXT"})

  
}
  //panResponder handle gesture venet of the user.
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (event, gesture) => true,
      onPanResponderMove: (e, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy });
      },
      onPanResponderRelease: (event, gesture) => {

        //We define a threshold SWIPE_THRESHOLD
         
        if (gesture.dx > SCREEN_WIDTH * 0.25) {
           
          forceSwipe("right");
        
        } else if (gesture.dx < - SCREEN_WIDTH * 0.25) {
          forceSwipe();
        
        } else {
          resetPostion();
        }
      },
    })
  ).current;

  //position is used by Animated module to animate the card on the screen.
  const position = useRef(new Animated.ValueXY()).current;

  //getCardStyle is a function helper.
  const getCardStyle = () => {
    const rotate = position.x.interpolate({
      inputRange: [-SCREEN_WIDTH * 1.5, 0, SCREEN_WIDTH * 1.5],
      outputRange: ['-120deg', '0deg', '120deg'],
    });
    return {
      ...position.getLayout(),
      transform: [{ rotate }],
    };
  };

  //resetPosition reposition the card when the user relases the screen press.
  const resetPostion = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: false 
    
    }).start();
  };

  //renderCards renders the cards to the view .
  const renderCards = () => {
  if(Index>=data.length){ 
    return renderNoMoreCards()
  }
    return data.map((item, index) => {

      if(index<Index){return null;}
      if (index == Index) {
        return (
          <Animated.View
            key={index}
            {...panResponder.panHandlers}
            style={[getCardStyle(),{width:SCREEN_WIDTH,position:"absolute",top:Index,
            height:SCREEN_WIDTH*1.5,borderRadius:10,borderStyle:"solid",borderWidth:1,
            borderColor:"white"}]}>
            {renderCard(item)}
          </Animated.View>
        );
      }
      return( 
               <Animated.View key={item.id} style={{position:"absolute",width:SCREEN_WIDTH,
               height:SCREEN_WIDTH*1.5,top:15*(Index-index),borderRadius:10,borderStyle:"solid",
               borderWidth:1,borderColor:"white"}}>
                  {renderCard(item)}
               </Animated.View>);
    }).reverse();
  };
  // We dynamically get the screen dimensions

  useEffect(() => {
    const getDimensions = () => {
      setSCREEN_WIDTH(Dimensions.get('window').width);
    };
   Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    LayoutAnimation.spring();
    Dimensions.addEventListener('change', getDimensions);
    return () => {
      Dimensions.removeEventListener('change', getDimensions);
    };
  }, [data]);




  return( 
    
    <SafeAreaView >
    <View  style={{position:"relative",height:SCREEN_WIDTH*1.5, width:SCREEN_WIDTH}} >{renderCards()}</View>
    </SafeAreaView>);
};
