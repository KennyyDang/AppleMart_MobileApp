// import React, { useState } from 'react';
// import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
// import { StackNavigationProp } from '@react-navigation/stack';
// import { RouteProp } from '@react-navigation/native';
// import { Ionicons } from '@expo/vector-icons';
// import { registerUser } from '../services/authService';

// type RootStackParamList = {
//   Login: undefined;
//   Register: undefined;
// };

// type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Register'>;
// type RegisterScreenRouteProp = RouteProp<RootStackParamList, 'Register'>;

// interface RegisterScreenProps {
//   navigation: RegisterScreenNavigationProp;
//   route: RegisterScreenRouteProp;
// }

// const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [name, setName] = useState('');
//   const [secureTextEntry, setSecureTextEntry] = useState(true);

//   const handleRegister = async () => {
//     try {
//       await registerUser({ email, password, name });
//       Alert.alert('Thành công', 'Tạo tài khoản thành công!');
//       navigation.replace('Login');
//     } catch (error) {
//       Alert.alert('Lỗi', error.message || 'Đăng ký thất bại. Vui lòng thử lại!');
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Image source={require('../../assets/Apple.png')} style={styles.logo} />

//       <TextInput
//         style={styles.input}
//         placeholder="Name"
//         placeholderTextColor="#7F7F7F"
//         value={name}
//         onChangeText={setName}
//       />

//       <TextInput
//         style={styles.input}
//         placeholder="Email"
//         placeholderTextColor="#7F7F7F"
//         value={email}
//         onChangeText={setEmail}
//         keyboardType="email-address"
//         autoCapitalize="none"
//       />

//       <View style={styles.passwordContainer}>
//         <TextInput
//           style={styles.passwordInput}
//           placeholder="Password"
//           placeholderTextColor="#7F7F7F"
//           value={password}
//           onChangeText={setPassword}
//           secureTextEntry={secureTextEntry}
//         />
//         <TouchableOpacity onPress={() => setSecureTextEntry(!secureTextEntry)}>
//           <Ionicons name={secureTextEntry ? 'eye-off' : 'eye'} size={24} color="#7F7F7F" />
//         </TouchableOpacity>
//       </View>

//       <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
//         <Text style={styles.registerText}>Register</Text>
//       </TouchableOpacity>

//       <TouchableOpacity onPress={() => navigation.navigate('Login')}>
//         <Text style={styles.loginRedirectText}>
//           Already have an account? <Text style={{ fontWeight: 'bold' }}>Login</Text>
//         </Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// export default RegisterScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#fff',
//   },
//   logo: {
//     width: '50%',
//     height: undefined,
//     aspectRatio: 1,
//     marginBottom: 40,
//     resizeMode: 'contain',
//   },
//   input: {
//     width: '80%',
//     height: 50,
//     backgroundColor: '#F0EAFB',
//     borderRadius: 25,
//     paddingHorizontal: 15,
//     fontSize: 16,
//     color: '#333',
//     marginBottom: 15,
//   },
//   passwordContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     width: '80%',
//     height: 50,
//     backgroundColor: '#F0EAFB',
//     borderRadius: 25,
//     paddingHorizontal: 15,
//     marginBottom: 15,
//   },
//   passwordInput: {
//     flex: 1,
//     height: 50,
//   },
//   registerButton: {
//     width: '80%',
//     height: 50,
//     backgroundColor: '#28A745',
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: 25,
//     marginBottom: 20,
//   },
//   registerText: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   loginRedirectText: {
//     color: '#333',
//     fontSize: 14,
//   },
// });
