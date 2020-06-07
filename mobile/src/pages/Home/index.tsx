import React, { useState , useEffect } from 'react';
import { 
  Image, 
  StyleSheet , 
  ImageBackground , 
  View, 
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback } from 'react-native';

import { RectButton } from 'react-native-gesture-handler';  
import { Feather as Icon } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import defaultStyles from 'react-native-picker-select';
import axios  from 'axios';

const baseUrlIbge: string = `https://servicodados.ibge.gov.br/api/v1/localidades/`;

interface IBGEUFResponse {
  sigla: string
}

interface IBGEMunicipioResponse {
  id: number;
  nome: string;
}

interface City {
  id: number;
  name: string;
}


const Home = () => {

    const navigation = useNavigation();

    const [uf , setUf ] = useState('');
    const [city , setCity ] = useState('');
    const [ufs, setUfs] = useState<string[]>([]);
    const [cities, setCities] = useState<City[]>([]);
  

    useEffect(()=> {
      axios.get<IBGEUFResponse[]>(`${baseUrlIbge}estados`)
      .then( response => {
          const ufInitials = response.data.map(uf => uf.sigla);
          setUfs(ufInitials);
      })
  },[]);


  useEffect(()=> {
      if(uf === "0") return;
      
      axios.get<IBGEMunicipioResponse[]>(`${baseUrlIbge}estados/${uf}/municipios`)
      .then( response => {
          const cities: City[] = response.data.map( c => ({ id: c.id , name: c.nome }));
          setCities(cities);
      })
      
  },[uf]);

    const handleSelectUF = (value: string) => {
      setUf(value);
      console.log(value);
      
    }

    const handleSelectCity = (value: string) => {
      setCity(value);
      console.log(value);
    }

    function handleNavigateToPoints() {
      navigation.navigate('Points', {uf, city});
    }

    return (  
      <KeyboardAvoidingView style = {{ flex: 1 }} behavior= { Platform.OS === 'ios' ? 'padding' : undefined }>
        <ImageBackground 
          source={require('../../assets/home-background.png')}
          style={styles.container}
          imageStyle={ {width: 274, height: 368 } }> 

            <View style={styles.main}> 
                <Image source={require('../../assets/logo.png')} />
                <Text style={styles.title}>
                    Seu marketplace de coleta de resíduos
                </Text>
                <Text style={styles.description}>
                   Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.
                </Text>
            </View>    

            <View style={styles.footer}> 
              <RNPickerSelect 
                  style={pickerSelectStyles}
                  onValueChange={(value) => handleSelectUF(value)}
                  placeholder = {{label: "Selecione uma UF"}}
                  items={
                    ufs.sort().map((uf: string) => ({ label: uf, value: uf }))
                    }
              />

              <RNPickerSelect 
                  style={pickerSelectStyles}
                  onValueChange={(value) => handleSelectCity(value)}
                  placeholder = {{label: "Selecione um estado"}}
                  items={
                    cities.sort().map((city: City) => ({ label: city.name, value: city.name }))
                    }
              />
               
              <RectButton style={styles.button} onPress={ handleNavigateToPoints }>
                <View style={styles.buttonIcon}> 
                  <Text>
                    <Icon name="arrow-right" color="#FFF" size={24} />
                  </Text>                                  
                </View>
                <Text style={styles.buttonText}> 
                  Entrar
                </Text> 
              </RectButton>
            </View>       
        </ImageBackground>
      </KeyboardAvoidingView>
    );
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 32
    },
  
    main: {
      flex: 1,
      justifyContent: 'center',
    },
  
    title: {
      color: '#322153',
      fontSize: 32,
      fontFamily: 'Ubuntu_700Bold',
      maxWidth: 260,
      marginTop: 64,
    },
  
    description: {
      color: '#6C6C80',
      fontSize: 16,
      marginTop: 16,
      fontFamily: 'Roboto_400Regular',
      maxWidth: 260,
      lineHeight: 24,
    },
  
    footer: {},
  
    select: {
      backgroundColor: '#FFF'
    },
  
    input: {
      height: 60,
      backgroundColor: '#FFF',
      borderRadius: 10,
      marginBottom: 8,
      paddingHorizontal: 24,
      fontSize: 16,
    },
  
    button: {
      backgroundColor: '#34CB79',
      height: 60,
      flexDirection: 'row',
      borderRadius: 10,
      overflow: 'hidden',
      alignItems: 'center',
      marginTop: 8,
    },
  
    buttonIcon: {
      height: 60,
      width: 60,
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      justifyContent: 'center',
      alignItems: 'center'
    },
  
    buttonText: {
      flex: 1,
      justifyContent: 'center',
      textAlign: 'center',
      color: '#FFF',
      fontFamily: 'Roboto_500Medium',
      fontSize: 16,
    }
  });

  const pickerSelectStyles = StyleSheet.create({  
    inputAndroid: {
      fontSize: 16,
      paddingHorizontal: 10,
      paddingVertical: 8,
      borderWidth: 0.5,
      borderColor: 'purple',
      borderRadius: 8,
      color: 'black',
      paddingRight: 30, // to ensure the text is never behind the icon
    },
  }); 

export default Home; 