import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Picker,
  TextInput
} from 'react-native';
import { map } from 'lodash';
import DatePicker from 'react-native-datepicker'

import firebase from '../services/firebase';
import moment from 'moment';


class HomeScreen extends React.PureComponent {
  state = {
    weekDay: 'mon',
    selectedSlot: 1,
    editingSlot: false,
    fetchingSlots: true,
    remedyAmount: '',
    selectedRemedy: ''
  }

  componentDidMount() {
    firebase.database().ref('/slots').on('value', (slotsSnapshot) => {
      this.setState({
        slots: slotsSnapshot.val(),
        fetchingSlots: false,
      })
    })

    firebase.database().ref('/remedies').on('value', (remediesSnapshot) => {
      this.setState({
        remedies: remediesSnapshot.val()
      })
    })
  }
  render() {
    const { slots, remedyAmount, remedies, editingSlot, fetchingSlots, selectedSlot } = this.state;
    console.log('SLOTs: ', slots)
    if(!remedies || fetchingSlots) { 
      return (
        <View style={{ flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{fontSize: 22, fontWeight: 'bold'}}>Carregando dispenser...</Text>
        </View>
      )
    } 
    if(editingSlot) {
      return (
        <View style={{flex: 1, width: '100%', padding: 20}}>

          <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10, justifyContent: 'space-between'}}>
            <Text style={{fontSize: 16, fontWeight: 'bold', marginRight: 10}}>Quantidade</Text>
            <TextInput style={{ paddingHorizontal: 15, padding: 1, width: 200, height: 40, borderRadius: 4, borderWidth: 1, borderColor: 'black'}} value={remedyAmount} onChangeText={(val) => this.setState({remedyAmount: val})} />
          </View>
          
          <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
            <Text style={{fontSize: 16, fontWeight: 'bold', marginRight: 10, marginBottom: 10}}>Remédio</Text>
            <View style={{}}>
              <Picker
                selectedValue={this.state.selectedRemedy}
                style={{height: 40, width: 200, marginBottom: 10 }}
                onValueChange={(itemValue, itemIndex) =>
                  this.setState({selectedRemedy: itemValue})
                }>
                  <Picker.Item label={'Selecione um'} value={''} />
                  {
                    map(remedies, (singleRemedy, singleRemedyId) => {
                      return <Picker.Item label={singleRemedy.name} value={singleRemedyId} />
                    })
                  }
              </Picker>
            </View>
          </View>

            <DatePicker
              style={{width: 200, marginBottom: 10}}
              date={this.state.date}
              mode="datetime"
              placeholder="select date"
              confirmBtnText="Confirmar"
              cancelBtnText="Cancelar"
              customStyles={{
                dateIcon: {
                  position: 'absolute',
                  left: 0,
                  top: 4,
                  marginLeft: 0
                },
                dateInput: {
                  marginLeft: 36
                }
                // ... You can check the source to find the other keys.
              }}
              onDateChange={(date) => {this.setState({date})}}
            />
            
          <TouchableOpacity style={{width: '80%', height: 30, justifyContent: 'center', alignItems: 'center', borderRadius: 4, backgroundColor: (this.state.remedyAmount !== '' && this.state.selectedRemedy !== '') ? '#32A890' : 'gray', alignSelf: 'center'}} onPress={this._updateSlot}>
            <Text style={{color: 'white'}}>Salvar</Text>
          </TouchableOpacity>
        </View>
      )
    }
    return (
      <View style={styles.container}>

        <Picker
          selectedValue={this.state.weekDay}
          style={{height: 50, width: 200, alignSelf: 'flex-end'}}
          onValueChange={(itemValue, itemIndex) =>
            this.setState({weekDay: itemValue})
        }>
          <Picker.Item label="Segunda" value={'mon'} />
          <Picker.Item label="Terça" value={'tue'} />
          <Picker.Item label="Quarta" value={'wed'} />
          <Picker.Item label="Quinta" value={'thu'} />
          <Picker.Item label="Sexta" value={'fri'} />
          <Picker.Item label="Sábado" value={'sat'} />
          <Picker.Item label="Domingo" value={'sun'} />
        </Picker>

        <View style={{width: '100%', paddingHorizontal: 20, marginTop: 20, flex: 1, marginBottom: 20, flexDirection: 'row'}}>
          
          <View style={{maxWidth: 70, borderColor: 'black', borderWidth: 1, flex: 1, borderBottomWidth: 0}}>
            <TouchableOpacity onPress={this._selectSlot(1)} style={{width: '100%', borderBottomWidth: 1, borderBottomColor: selectedSlot === 1 ? 'white' : 'black', backgroundColor: selectedSlot === 1 ? 'black' : 'white', height: '14.285%', justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{fontWeight: 'bold', fontSize: 16}}>1</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={this._selectSlot(2)} style={{width: '100%', borderBottomWidth: 1, borderBottomColor: selectedSlot === 2 ? 'white' : 'black', backgroundColor: selectedSlot === 2 ? 'black' : 'white', height: '14.285%', justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{fontWeight: 'bold', fontSize: 16}}>2</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={this._selectSlot(3)} style={{width: '100%', borderBottomWidth: 1, borderBottomColor: selectedSlot === 3 ? 'white' : 'black', backgroundColor: selectedSlot === 3 ? 'black' : 'white', height: '14.285%', justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{fontWeight: 'bold', fontSize: 16}}>3</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={this._selectSlot(4)} style={{width: '100%', borderBottomWidth: 1, borderBottomColor: selectedSlot === 4 ? 'white' : 'black', backgroundColor: selectedSlot === 4 ? 'black' : 'white', height: '14.285%', justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{fontWeight: 'bold', fontSize: 16}}>4</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={this._selectSlot(5)} style={{width: '100%', borderBottomWidth: 1, borderBottomColor: selectedSlot === 5 ? 'white' : 'black', backgroundColor: selectedSlot === 5 ? 'black' : 'white', height: '14.285%', justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{fontWeight: 'bold', fontSize: 16}}>5</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={this._selectSlot(6)} style={{width: '100%', borderBottomWidth: 1, borderBottomColor: selectedSlot === 6 ? 'white' : 'black', backgroundColor: selectedSlot === 6 ? 'black' : 'white', height: '14.285%', justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{fontWeight: 'bold', fontSize: 16}}>6</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={this._selectSlot(7)} style={{width: '100%', borderBottomWidth: 1, borderBottomColor: selectedSlot === 7 ? 'white' : 'black', backgroundColor: selectedSlot === 7 ? 'black' : 'white', height: '14.285%', justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{fontWeight: 'bold', fontSize: 16}}>7</Text>
            </TouchableOpacity>
          </View>

          <View style={{flex: 1, height: '100%', paddingLeft: 10 }}>
            {
              !(slots && slots[this.state.weekDay] && slots[this.state.weekDay][this.state.selectedSlot])
              ? <TouchableOpacity onPress={() => this.setState({editingSlot: true})}><Text style={{color: '#00278E', textDecorationLine: 'underline'}}>Adicionar remédio</Text></TouchableOpacity>
              : <>
                  <Text>Remédio: {slots[this.state.weekDay][this.state.selectedSlot].name}</Text>
                  <Text>Quantidade: {slots[this.state.weekDay][this.state.selectedSlot].amount}</Text>
                  <Text>Horário: {/*moment(moment.utc(slots[this.state.weekDay][this.state.selectedSlot].time).toDate()).local().format('HH:MM')*/moment.unix(slots[this.state.weekDay][this.state.selectedSlot].time).format("HH:mm")}</Text>
                  <Text>Foi tomado: {slots[this.state.weekDay][this.state.selectedSlot].taken ? 'Sim' : 'Não'}</Text>
                  <TouchableOpacity onPress={() => this.setState({editingSlot: true})}><Text style={{color: '#00278E', textDecorationLine: 'underline'}}>Editar slot</Text></TouchableOpacity>
                </>
            }
          </View>
        </View>
      </View>
    );
  }

  _selectSlot = (slot) => () => this.setState({selectedSlot: slot})

  _updateSlot = async () => {
    const { selectedSlot, weekDay, remedyAmount, remedies, selectedRemedy, date } = this.state;
    if(selectedRemedy && selectedRemedy !== '' && date) {
      const weekDayNumber = this._weekDayToNumber(weekDay);
      await firebase.database().ref(`dados/d${weekDayNumber}/h${selectedSlot}`).set(moment(date).unix());
      await firebase.database().ref(`slots/${weekDay}/${selectedSlot}`).set({
        name: remedies[selectedRemedy].name,
        time: moment(date).unix(),
        amount: remedyAmount,
        taken: false
      })
      this.setState({
        editingSlot: false
      })
    }
  }

  _weekDayToNumber = (weekDay) => {
    switch(weekDay) {
      case 'mon':
        return 2
      case 'tue':
        return 3
      case 'wed':
        return 4
      case 'thu':
        return 5
      case 'fri':
        return 6
      case 'sat':
        return 7
      case 'sun':
        return 1
    }
  }
}

HomeScreen.navigationOptions = {
  title: 'Dispenser'
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 20
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});


export default HomeScreen;