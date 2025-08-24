import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Button, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function App() {

  const [task,setTask] = useState();
  const [tasks,setTasks] = useState([]);


  useEffect(()=>{
    loadTasks();
  },[]);

 


  const saveTasks = async (newTasks) => {
    try {

      await AsyncStorage.setItem('TASKS',JSON.stringify(newTasks))
      
    } catch (error) {
      console.log('Kaydetme hatası : ',error);
    }
  }


  const loadTasks = async () =>{
    try {
      const savedTasks = await AsyncStorage.getItem('TASKS');
      if(savedTasks) setTasks(JSON.parse(savedTasks));
      
    } catch (error) {
       console.log('Yükleme hatası : ',error);
    }
  }


  const addTask = ()=>{
    if(!task.trim()) return;
    const newTask = {id:Date.now().toString(),title:task,compoleted:false}
    const updateTasks = [...tasks,newTask];
    setTasks(updateTasks);
    saveTasks(updateTasks);
    setTask('');
  }


  const deleteTask = (id) =>{
      const filteredTasks = tasks.filter(t => t.id !==id);
      setTasks(filteredTasks);
      saveTasks(filteredTasks);

  }


  const toogleTask = (id) => {
    const updatedTasks = tasks.map(t =>
      t.id == id ? {...t,compoleted:!t.compoleted} : t
    );
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Görev Takip Uygulaması</Text>
      <TextInput 
      style={styles.input}
      placeholder='Yeni Görev Girin ....'
      value={task}
      onChangeText={setTask}
      />
      <Button title='Ekle' style={styles.btnAdd} onPress={addTask} />    
       <FlatList 
       data={tasks}
       keyExtractor={(item) => item.id}
       renderItem={({item}) => (
        <View style={styles.taskContainer}>
       
        <TouchableOpacity onPress={()=> toogleTask(item.id)} style={styles.containerTitle}>
          <Text style={styles.timeText}>{new Date(Number(item.id)).toLocaleDateString('tr-TR')}</Text>
          <Text style={[styles.task, item.compoleted && styles.compoletedTask]}>{item.title}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteButton} onPress={() => deleteTask(item.id)}>
          <Text  style={styles.deleteButtonText} >Sil</Text>
        </TouchableOpacity>
        </View>
       )}
       ListEmptyComponent={<Text>Henüz Görev Eklenmedi !</Text>}
       />
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding:20,
  },
  heading:{
    fontSize:24,
    fontWeight:'bold',
    marginBottom:10,
    marginTop:20
  },
  input:{
    borderWidth:1,
    padding:10,
    marginBottom:10
  },
  task:{
    padding:10,
    fontSize:18,
  
  },
  taskContainer:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between',
    paddingVertical:8,
    borderBottomWidth:1,
    borderColor:'#ccc'
  },
  deleteButton:{
    backgroundColor:'#ff4d4d',
    paddingVertical:4,
    paddingHorizontal:12,
    borderRadius:5,
    marginLeft:10,
    
  },
  deleteButtonText:{
    color:'#fff',
    fontWeight:'bold',
  },
  compoletedTask:{
    textDecorationLine:'line-through',
    color:'gray',
  },
  containerTitle:{
    flexDirection:'column',
    justifyContent:'center'  
  },
  timeText:{
    marginTop:10,
    marginLeft:13
  }
});
