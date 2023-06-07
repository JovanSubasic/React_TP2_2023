import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View , Image, ScrollView, Picker} from 'react-native';
import React, { useState, useEffect  } from 'react';
import * as Location from 'expo-location';
import SelectDropdown from 'react-native-select-dropdown';

export default function CalendarMeteo() {

    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

    const [calendarData, setCalendarData] = useState(null);


    const [calendarDataSelect, setCalendarDataSelect] = useState(null);

    const getCalendar = async (latitude,longitude) => {
        try {
        const response = await fetch(
            'https://api.openweathermap.org/data/2.5/forecast?appid=a3cca33b945358f4298ec5a580676d0f&lang=fr&units=metric&lat='+ latitude +'&lon='+ longitude +''
        );
        const data = await response.json();
          setCalendarData(data);
          setCalendarDataSelect(data.list[0]);
        console.log(calendarDataSelect);
        // console.log(calendarData.list);
        } catch (error) {
        console.error(error);
        }
    };

    const listeJour = [
        "Lun",
        "Mar",
        "Mer", 
        "Jeu",
        "Ven",
        "Sam",
        "Dim"
    ];

    useEffect(() => {
        
        (async () => {
      
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
              setErrorMsg('Permission to access location was denied');
              return;
            }
      
            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
            location && getCalendar(location.coords.latitude,location.coords.longitude);
        })();

        location && getCalendar(location.coords.latitude,location.coords.longitude);
    }, []);


  return (
    <View style={styles.container}>
      { calendarData != null ? 
      <View>
        {/* Etape :
            -faire un select avec les jours de la semaine en sélectionnant le jour actuel
            -afficher l'icon de la journée select
            -faire un select avec les heures dispo du jour en sélectionnant la première heure dispo de ce jour
        */}
        
        {/* <Picker
            selectedValue={selectedValue}
            style={{ height: 50, width: 150 }}
            onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
        >
            {
            listeJour.map((item, index) => {

                return (
                    <Picker.Item label={item} value={index} />
                );
            })
            } 
            
            <Picker.Item label="JavaScript" value="js" />
        </Picker> */}
        <ScrollView style={styles.scrollView}>
            
          {/* <SelectDropdown
            data={listeJour}
            // defaultValueByIndex={1} // use default value by index or default value
            // defaultValue={'Canada'} // use default value by index or default value
            onSelect={(selectedItem, index) => {
              console.log(selectedItem, index);
            }}
            defaultButtonText={'Sélectionner  un jour'}
            buttonTextAfterSelection={(selectedItem, index) => {
              return selectedItem;
            }}
            rowTextForSelection={(item, index) => {
              return item;
            }}
          /> */}
            {/* {
            calendarData.list.map((item, index) => {
                
                const date = new Date(item.dt_txt);

                let day = listeJour[date.getDay()];

                let hour = date.getHours();

                return (
                <View key={index}>
                    <Text >{day}</Text>
                    <Text >{hour} H</Text>
                    <Image
                        resizeMode="cover"
                        style={styles.image}
                        source={{
                        uri: 'https://openweathermap.org/img/wn/'+ item.weather[0].icon +'@2x.png',
                        }}
                            
                    />
                </View>
                );
            })
            } */}
        </ScrollView>
      </View>
      : ""}
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffff',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  scrollView: {
    // alignItems: 'center',
    // justifyContent: 'center',
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