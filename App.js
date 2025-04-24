import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet } from 'react-native';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io('http://YOUR_LOCAL_IP:3000'); // Replace with your local IP

export default function App() {
  const [username, setUsername] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const login = async () => {
    try {
      await axios.post('http://YOUR_LOCAL_IP:3000/login', { username });
      setIsLoggedIn(true);
    } catch (err) {
      console.error(err);
    }
  };

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit('sendMessage', { user: username, text: message });
      setMessage('');
    }
  };

  useEffect(() => {
    socket.on('receiveMessage', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
    return () => socket.off('receiveMessage');
  }, []);

  if (!isLoggedIn) {
    return (
      <View style={styles.container}>
        <TextInput placeholder="Username" value={username} onChangeText={setUsername} style={styles.input} />
        <Button title="Login" onPress={login} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={({ item }) => <Text><Text style={styles.bold}>{item.user}:</Text> {item.text}</Text>}
        keyExtractor={(_, i) => i.toString()}
      />
      <TextInput placeholder="Type a message" value={message} onChangeText={setMessage} style={styles.input} />
      <Button title="Send" onPress={sendMessage} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, marginTop: 50 },
  input: { borderWidth: 1, padding: 10, marginVertical: 10, borderRadius: 5 },
  bold: { fontWeight: 'bold' }
});
