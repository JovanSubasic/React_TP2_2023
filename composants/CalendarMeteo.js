import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View , Image, ScrollView, Picker} from 'react-native';
import React, { useState, useEffect  } from 'react';
import * as Location from 'expo-location';
import SelectDropdown from 'react-native-select-dropdown';

export default function CalendarMeteo() {

    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

    const [selectDay, setSelectDay] = useState(null);

    const [selectHour, setSelectHour] = useState(null);

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
          setSelectHour(((new Date(data.list[7].dt_txt).length) < 2) ? '0'+(new Date(data.list[7].dt_txt).getHours()) : new Date(data.list[7].dt_txt).getHours()+'h')
        // console.log(calendarDataSelect);
        // console.log(data.list);
        } catch (error) {
        console.error(error);
        }
    };

    const listeJour = [
        "Dimanche",
        "Lundi",
        "Mardi",
        "Mercredi", 
        "Jeudi",
        "Vendredi",
        "Samedi"
    ];


    const listeHour = [
      "03h",
      "06h",
      "09h",
      "12h",
      "15h", 
      "18h",
      "21h",
      "00h"
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
        <Text style={styles.titre}>Prévision de la semaine</Text>
        
        <View style={styles.select}>
          <SelectDropdown
            data={listeHour}

            onSelect={(selectedItem, index) => {
              setSelectHour(selectedItem)
              // console.log(selectedItem);
            }}
            buttonStyle={styles.dropdownButton}

            defaultValue={selectHour}

            defaultButtonText={'Sélectionner  une heure'}
          /> 
        </View>
        <ScrollView horizontal={true} style={styles.scrollView}>           
            {
            calendarData.list.map((item, index) => {
                
                const date = new Date(item.dt_txt);

                let day = listeJour[date.getDay()];

                let hour = date.getHours()+'h';
                console.log((index ) % 8, listeHour.indexOf(selectHour))

                if((listeHour.indexOf(selectHour)+1) == (index + 1) % 8){
                  return (
                  <View key={index} style={styles.semaineMeteo}>
                      <Text style={styles.textSemaineMeteo}>{day}</Text>
                      <Text style={styles.tempSemaineMeteo}>{Math.floor(item.main.temp)} °C</Text>
                      <Image
                          resizeMode="cover"
                          style={styles.image}
                          source={{
                          uri: 'https://openweathermap.org/img/wn/'+ item.weather[0].icon +'@2x.png',
                          }}
                              
                      />
                      <Text style={styles.descriptionSemaineMeteo}>{item.weather[0].description}</Text>
                  </View>
                  );
                }
            })
            }
        </ScrollView>
      </View>
      : ""}
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#70aadb',
  },
  text: {
    textAlign: 'center',
  },
  image: {
    width: 100,
    height: 100,
  },
  titre: {
    fontSize: 20, 
    color: '#333',
    textAlign: 'center', 
    textTransform: 'uppercase',
    paddingTop: 50,
  },
  sousTitre: {
    fontSize: 15, 
    color: '#333',
    textAlign: 'center', 
    paddingTop: 10,
    paddingBottom: 50
  },
  semaineMeteo: {
    backgroundColor: '#7d9db8',
    borderRadius: 8,
    marginBottom: 100,
    paddingHorizontal: 30,
    marginRight: 10,
    marginLeft: 10
  },
  textSemaineMeteo: {
    fontSize: 15,
    fontWeight: 'bold', 
    marginTop: 30,
    textAlign: 'center',
  },
  tempSemaineMeteo: {
    fontSize: 10,
    marginTop: 5,
    textAlign: 'center',
  },
  descriptionSemaineMeteo: {
    fontSize: 15,
    textAlign: 'center',
  },
  select: {
    marginTop: 10,
    marginBottom: 10,
    alignItems: 'center',
    textAlign: 'center',
  },
  dropdownButton: {
    width: 100,
    height: 40,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
});
