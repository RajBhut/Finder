import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  Button,
  Dimensions,
} from 'react-native';
import {usePhotoContext} from '../componants/FileContex';
import {useNavigation} from '@react-navigation/native';

export default function Test() {
  const {photos} = usePhotoContext();
  const navigation = useNavigation();
  const screenWidth = Dimensions.get('window').width;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Captured Photos</Text>
      {photos.length === 0 ? (
        <Text>No photos taken yet</Text>
      ) : (
        photos.map((photo, index) => (
          <Image
            key={index}
            style={[
              styles.photo,
              {width: screenWidth, height: screenWidth * 0.75},
            ]}
            source={{uri: photo.uri}}
            resizeMode="contain" // Ensures the image scales to fit within the screen
          />
        ))
      )}
      <Button
        title="Take a photo"
        onPress={() => navigation.navigate('Home')}
      />
      <Button title="Test" onPress={() => navigation.navigate('Test')} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  header: {
    fontSize: 24,
    marginBottom: 10,
    textAlign: 'center',
  },
  photo: {
    marginBottom: 10,
    borderRadius: 8,
  },
});
// import React, {useEffect, useState} from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   Image,
//   StyleSheet,
//   Button,
//   Dimensions,
// } from 'react-native';
// import {usePhotoContext} from '../componants/FileContex';
// import {useNavigation} from '@react-navigation/native';
// import RNFS from 'react-native-fs';
// import {Tflite} from 'react-native-tflite-classification';

// const tflite = new Tflite();

// export default function Test() {
//   const {photos} = usePhotoContext();
//   const navigation = useNavigation();
//   const screenWidth = Dimensions.get('window').width;
//   const [predictions, setPredictions] = useState([]);

//   useEffect(() => {
//     console.log('Loading model...');
//     tflite.loadModel(
//       {
//         modelPath: '/Model/graph.lite',
//         labelsPath: '/Model/labels.txt',
//       },
//       (err, res) => {
//         if (err) console.log('Model load error:', err);
//         else console.log('Model loaded:', res);
//       },
//     );

//     return () => {
//       tflite.close();
//     };
//   }, []);

//   const runModelOnImage = (photoPath, index) => {
//     tflite.runModelOnImage(
//       {
//         path: 'file://' + photoPath,
//         numResults: 10,
//         threshold: 0.5,
//       },
//       (err, res) => {
//         if (err) console.log('Prediction error:', err);
//         else {
//           // Update predictions state with new prediction for the photo
//           setPredictions(prev => {
//             const newPredictions = [...prev];
//             newPredictions[index] = res;
//             return newPredictions;
//           });
//         }
//       },
//     );
//   };

//   return (
//     <ScrollView style={styles.container}>
//       <Text style={styles.header}>Captured Photos with Predictions</Text>
//       {photos.length === 0 ? (
//         <Text>No photos taken yet</Text>
//       ) : (
//         photos.map((photo, index) => (
//           <View key={index} style={styles.photoContainer}>
//             <Image
//               style={[
//                 styles.photo,
//                 {width: screenWidth, height: screenWidth * 0.75},
//               ]}
//               source={{uri: photo.uri}}
//               resizeMode="contain"
//             />
//             <Button
//               title="Run Model"
//               onPress={() => runModelOnImage(photo.path, index)}
//             />
//             {predictions[index] && (
//               <View style={styles.predictionContainer}>
//                 {predictions[index].map((pred, i) => (
//                   <Text key={i} style={styles.predictionText}>
//                     {pred.label}: {Math.round(pred.confidence * 100)}%
//                   </Text>
//                 ))}
//               </View>
//             )}
//           </View>
//         ))
//       )}
//       <Button
//         title="Take a photo"
//         onPress={() => navigation.navigate('Home')}
//       />
//       <Button title="Test" onPress={() => navigation.navigate('Test')} />
//       <Button title="Test2" onPress={() => navigation.navigate('Test2')} />
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     padding: 10,
//   },
//   header: {
//     fontSize: 24,
//     marginBottom: 10,
//     textAlign: 'center',
//   },
//   photoContainer: {
//     marginBottom: 10,
//     alignItems: 'center',
//   },
//   photo: {
//     borderRadius: 8,
//   },
//   predictionContainer: {
//     marginTop: 5,
//   },
//   predictionText: {
//     fontSize: 16,
//     color: '#333',
//   },
// });
//---------------------------------------------
// import React, {useEffect, useState} from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   Image,
//   StyleSheet,
//   Button,
//   Dimensions,
// } from 'react-native';
// import {usePhotoContext} from '../componants/FileContex';
// import {useNavigation} from '@react-navigation/native';
// import RNFS from 'react-native-fs';
// import {Tflite} from 'react-native-tflite-classification';

// const tflite = new Tflite();

// export default function Test() {
//   const {photos} = usePhotoContext();
//   const navigation = useNavigation();
//   const screenWidth = Dimensions.get('window').width;
//   const [predictions, setPredictions] = useState([]);

//   useEffect(() => {
//     // Load the TensorFlow Lite model when the component mounts
//     tflite.loadModel(
//       {
//         modelPath: '/Model/graph.lite',
//         labelsPath: '/Model/labels.txt',
//       },
//       (err, res) => {
//         if (err) console.log('Model load error:', err);
//         else console.log('Model loaded:', res);
//       },
//     );

//     // Unload the model when component unmounts
//     return () => {
//       tflite.close();
//     };
//   }, []);

//   const runModelOnImage = (photoPath, index) => {
//     const fullPath = `file://${photoPath}`; // Verify the path format

//     // Check if file exists before attempting to use it
//     RNFS.exists(photoPath)
//       .then(exists => {
//         if (!exists) {
//           console.log(`File not found at path: ${photoPath}`);
//           return;
//         }

//         tflite.runModelOnImage(
//           {
//             path: fullPath,
//             numResults: 10,
//             threshold: 0.5,
//           },
//           (err, res) => {
//             if (err) {
//               console.log('Prediction error:', err);
//             } else {
//               setPredictions(prev => {
//                 const newPredictions = [...prev];
//                 newPredictions[index] = res;
//                 return newPredictions;
//               });
//             }
//           },
//         );
//       })
//       .catch(error => console.log('Error checking file existence:', error));
//   };

//   return (
//     <ScrollView style={styles.container}>
//       <Text style={styles.header}>Captured Photos with Predictions</Text>
//       {photos.length === 0 ? (
//         <Text>No photos taken yet</Text>
//       ) : (
//         photos.map((photo, index) => (
//           <View key={index} style={styles.photoContainer}>
//             <Image
//               style={[
//                 styles.photo,
//                 {width: screenWidth, height: screenWidth * 0.75},
//               ]}
//               source={{uri: photo.uri}}
//               resizeMode="contain"
//             />
//             <Button
//               title="Run Model"
//               onPress={() => runModelOnImage(photo.path, index)}
//             />
//             {predictions[index] && (
//               <View style={styles.predictionContainer}>
//                 {predictions[index].map((pred, i) => (
//                   <Text key={i} style={styles.predictionText}>
//                     {pred.label}: {Math.round(pred.confidence * 100)}%
//                   </Text>
//                 ))}
//               </View>
//             )}
//           </View>
//         ))
//       )}
//       <Button
//         title="Take a photo"
//         onPress={() => navigation.navigate('Home')}
//       />
//       <Button title="Test" onPress={() => navigation.navigate('Test')} />
//       <Button title="Test2" onPress={() => navigation.navigate('Test2')} />
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     padding: 10,
//   },
//   header: {
//     fontSize: 24,
//     marginBottom: 10,
//     textAlign: 'center',
//   },
//   photoContainer: {
//     marginBottom: 10,
//     alignItems: 'center',
//   },
//   photo: {
//     borderRadius: 8,
//   },
//   predictionContainer: {
//     marginTop: 5,
//   },
//   predictionText: {
//     fontSize: 16,
//     color: '#333',
//   },
// });
