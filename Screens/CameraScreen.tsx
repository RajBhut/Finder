import React, {useEffect, useRef, useState} from 'react';
import {View, Text, Button, Image, ScrollView, Alert} from 'react-native';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import RNFS from 'react-native-fs';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useMicrophonePermission,
} from 'react-native-vision-camera';
import {usePhotoContext} from '../componants/FileContex';
import {useNavigation} from '@react-navigation/native';

export default function CameraScreen() {
  const cameraRef = useRef(null);
  const [photoUri, setPhotoUri] = useState(null);
  const [active, setActive] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const device = useCameraDevice('back');
  const [mode, setMode] = useState('camera');
  const {addPhoto} = usePhotoContext();
  const navigation = useNavigation();

  // Camera and microphone permissions
  const cameraPermission = useCameraPermission();
  const microphonePermission = useMicrophonePermission();

  useEffect(() => {
    // Request permissions when component mounts
    (async () => {
      if (cameraPermission.hasPermission !== true) {
        console.log(cameraPermission.hasPermission);
        await cameraPermission.requestPermission();
      }
      if (microphonePermission.hasPermission !== true) {
        await microphonePermission.requestPermission();
      }
    })();
  }, [cameraPermission, microphonePermission]);

  // Render loading or permission error messages
  if (!device) {
    return (
      <View>
        <Text>Loading camera...</Text>
      </View>
    );
  }

  if (
    cameraPermission.hasPermission !== true ||
    microphonePermission.hasPermission !== true
  ) {
    return (
      <View>
        <Text>
          Camera and microphone permissions are required to use this feature.
        </Text>
        <Button
          title="Grant Permissions"
          onPress={() => {
            cameraPermission.requestPermission();
            microphonePermission.requestPermission();
          }}
        />
      </View>
    );
  }

  const takePhoto = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePhoto();
      const filepath = `${RNFS.DocumentDirectoryPath}/photo_${Date.now()}.jpg`;

      try {
        await CameraRoll.save(`file://${photo.path}`, {type: 'photo'});
        await RNFS.moveFile(photo.path, filepath);
        setPhotoUri(`file://${filepath}`);
        addPhoto({uri: `file://${filepath}`, path: filepath});
      } catch (error) {
        console.error('Error saving photo', error);
      }
    }
  };

  const startRecording = async () => {
    if (mode !== 'video') return;

    if (cameraRef.current) {
      setIsRecording(true);
      cameraRef.current.startRecording({
        onRecordingFinished: async video => {
          const path = video.path;
          await CameraRoll.save(`file://${path}`, {type: 'video'});
        },
        onRecordingError: error => console.error('Recording error:', error),
      });
    }
  };

  const stopRecording = () => {
    if (mode === 'video' && cameraRef.current) {
      setIsRecording(false);
      cameraRef.current.stopRecording();
    }
  };

  const toggleMode = () => {
    setMode(prevMode => (prevMode === 'camera' ? 'video' : 'camera'));
  };

  return (
    <ScrollView>
      <View style={{height: 1000}}>
        <Camera
          ref={cameraRef}
          style={{flex: 2, minHeight: 600}}
          device={device}
          isActive={active}
          photo={mode === 'camera'}
          video={mode === 'video'}
        />
        <Button
          title={active ? 'Stop' : 'Start'}
          onPress={() => setActive(prev => !prev)}
        />
        <Button
          title="Gallery"
          onPress={() => navigation.navigate('Gallery')}
        />
        <Button
          title={mode === 'camera' ? 'Switch to Video' : 'Switch to Camera'}
          onPress={toggleMode}
        />
        {mode === 'camera' ? (
          <Button title="Capture Photo" onPress={takePhoto} />
        ) : null}
        {!isRecording ? (
          <Button title="Start Recording" onPress={startRecording} />
        ) : (
          <Button title="Stop Recording" onPress={stopRecording} />
        )}
        {photoUri && (
          <Image style={{flex: 2, minHeight: 500}} source={{uri: photoUri}} />
        )}
      </View>
    </ScrollView>
  );
}
