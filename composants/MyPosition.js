import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View , Image} from 'react-native';
import React, { useState, useEffect  } from 'react';
import * as Location from 'expo-location';

export default function MyPosition() {

    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

    const [myPositionData, setMyPositionData] = useState(null);

    const getMyPosition = async (latitude,longitude) => {
        try {
        const response = await fetch(
            'https://api.openweathermap.org/data/2.5/weather?appid=a3cca33b945358f4298ec5a580676d0f&lang=fr&units=metric&lat='+ latitude +'&lon='+ longitude +''
        );
        const data = await response.json();
          setMyPositionData(data);
        // console.log(data);
        } catch (error) {
        console.error(error);
        }
    };

    useEffect(() => {
        
        (async () => {
      
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
              setErrorMsg('Permission to access location was denied');
              return;
            }
      
            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
            location && getMyPosition(location.coords.latitude,location.coords.longitude);
        })();

        location && getMyPosition(location.coords.latitude,location.coords.longitude);
    }, []);

    let text = 'Waiting..';
    if (errorMsg) {
        text = errorMsg;
    } else if (location) {
        // text = JSON.stringify(location);
        text = "";
    }

  return (
    <View style={styles.container}>
      <Text>{ text }</Text>
      { myPositionData != null ? 
      <View >
        <View style={styles.viewText}>
            <Text style={styles.text}>Vous êtes à { myPositionData.name }</Text> 
            <Text style={styles.text}>{ myPositionData.main.temp } °C</Text> 
        </View>
        <View style={styles.card}>
            
            <Image
                resizeMode="cover"
                style={styles.image}
                source={{
                uri: 'https://openweathermap.org/img/wn/'+ myPositionData.weather[0].icon +'@2x.png',
                }}
                    
            />
            <Text style={styles.text}>{ myPositionData.weather[0].description }</Text> 
        </View>
      </View>
      : ""}
      {/* <StatusBar style="auto" /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e7e9eb',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  card: {
    boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
    transition: '0.3s',
    borderRadius: '5px',
    backgroundColor: '#e7e9eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
  },
  image: {
    width: 50,
    height: 50,
    // marginVertical: 5,
    // borderRadius: 5,
  },
});
