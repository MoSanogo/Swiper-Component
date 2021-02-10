import  React,{useState,useEffect} from 'react';
import { Text, View, StyleSheet,Animated,SafeAreaView,ScrollView,Image,Dimensions } from 'react-native';
import{Card,Button} from "react-native-elements"
import faker from "faker";
import Deck from "./components/Deck";



export default function App() {
 //SCREEN_WIDTH defines the width of the current screen,
  const [{SCREEN_WIDTH,SCREEN_HEIGHT}, setSCREEN_WIDTH] = useState(() => {
    const { width ,height} = Dimensions.get('window');
    return {width,height}
  });
      const [data,setData]=useState([]);

      useEffect(()=>{
        let dataArr=[];
        let i=0;
        while(i<=20){
          dataArr.push({
            id:faker.random.uuid(),
            title:faker.name.title(),
            text:faker.lorem.text(),
            uri:faker.image.imageUrl()
          });
          i++;
        }
        setData(dataArr);

  const getDimensions = () => {
      setSCREEN_WIDTH(Dimensions.get('window'));
    };

  Dimensions.addEventListener('change', getDimensions);
    return () => {
      Dimensions.removeEventListener('change', getDimensions);
    };

    
      },[])
 const renderNoMoreCards=()=>{
   return <Card>
           <Card.Title> All done!!!!!! </Card.Title>
         <Text style={{marginBottom:10}}>
         There is no more cards.</Text>
         <Button title="Get more"/>
          </Card>
 }
const renderCard=({id,title,text,uri})=>{
       return (
         <View style={{width:"100%",borderStyle:"solid",borderWidth:2,borderColor:"white"}}> 
              <Image  source={{uri:uri}} style={{width:"100%",height:"100%"}}/>
          </View>)
};
  return (
    <SafeAreaView style={{marginTop:50}} >
    <ScrollView contentContainerStyle={{justifyContent:"center",height:SCREEN_WIDTH,alignItems:"center",marginTop:45}}>
      <View style={{justifyContent:"center",alignItems:"center"}} > 
      <Text style={{textAlign:"center"}}>
        This is picture swipping application</Text>
      </View>

        <View  >
        
        < Deck 
         data={data}
        renderCard={renderCard}
        onSwipeLeft={(item)=>console.log("Somethimg was swipe Left")}
        onSwipeRight={(item)=>console.log("Somethimg was swipe right")}
        renderNoMoreCards={renderNoMoreCards}


        
        />
      
     </View>
   </ScrollView>

    </SafeAreaView>
  );
}