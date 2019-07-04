import React from 'react';
import { ScrollView, StyleSheet, View, Text, TextInput, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'
import { map } from 'lodash';
import firebase from '../services/firebase';
import { TouchableOpacity } from 'react-native-gesture-handler';
import FAB from 'react-native-fab'

class LinksScreen extends React.PureComponent {
  state = {
    didFetchRemedies: false
  }
  componentDidMount() {
    firebase.database().ref('/remedies').on('value', (remediesSnapshot) => {
      this.setState({
        remedies: remediesSnapshot.val(),
        didFetchRemedies: true,
        creatingRemedy: false,
        newRemedyName: ''
      })
    })
  }

  componentWillUnmount() {
    firebase.database().ref('/remedies').off()
  }

  render() {
    const { didFetchRemedies, remedies, creatingRemedy, newRemedyName } = this.state;
    if(!didFetchRemedies) {
      return (
        <View style={{ flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{fontSize: 22, fontWeight: 'bold'}}>Carregando lista de remédios...</Text>
        </View>
      )
    }
    if(creatingRemedy) {
      return (
        <View style={{ flex: 1, width: '100%', padding: 20, justifyContent: 'space-between' }}>
          <View style={{flexDirection: 'row-reverse'}}>
            <TouchableOpacity onPress={() => this.setState({creatingRemedy: false})}>
              <Text>X</Text>
            </TouchableOpacity>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={{fontWeight: 'bold', marginRight: 10}}>Nome</Text>
            <TextInput style={{borderBottomColor: 'black', borderBottomWidth: 1, width: '50%'}} value={newRemedyName} onChangeText={(val) => this.setState({newRemedyName: val})} />
          </View>
          <TouchableOpacity style={{width: '80%', height: 30, justifyContent: 'center', alignItems: 'center', borderRadius: 4, backgroundColor: '#32A890', alignSelf: 'center'}} onPress={this._createRemedy}>
            <Text style={{color: 'white'}}>Salvar</Text>
          </TouchableOpacity>
        </View>
      )
    }
    if(!remedies) {
      return (
        <View style={{ flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{fontSize: 22, fontWeight: 'bold'}}>Nenhum remédio cadastrado</Text>
          <FAB buttonColor="red" iconTextColor="#FFFFFF" onClickAction={() => this.setState({creatingRemedy: true})} visible={true} />
        </View>
      )
    }
    return (
      <View style={{flex: 1, width: '100%'}}>
        <ScrollView style={styles.container}>
          {
            map(remedies, (remedy, remedyId) => (
              <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10, justifyContent: 'space-between'}}>
                <Text style={{fontSize: 16}}>{remedy.name}</Text>
                <View style={{flexDirection: 'row'}}>
                  {/* <MaterialIcons name="edit" size={24} style={{marginRight: 3}} /> */}
                  <TouchableOpacity onPress={this._deleteRemedy(remedyId)}>
                    <MaterialIcons name="delete" size={24} color="red" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          }
        </ScrollView>
        <FAB buttonColor="red" iconTextColor="#FFFFFF" onClickAction={() => this.setState({creatingRemedy: true})} visible={true} />
      </View>
    );
  }

  _createRemedy = () => {
    const { newRemedyName } = this.state;
    if(newRemedyName!== '') {
      firebase.database().ref('/remedies').push({
        name: newRemedyName,
      })
    }
  }

  _deleteRemedy = (remedyId) => () => {
    firebase.database().ref(`/remedies/${remedyId}`).remove((err) => {
      if(err) {
        Alert.alert(JSON.stringify(err))
      } else {
        this.setState({
          creatingRemedy: false
        })
      }
    });
  }
}

LinksScreen.navigationOptions = {
  title: 'Remédios cadastrados',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
    paddingHorizontal: 20
  },
});

export default LinksScreen