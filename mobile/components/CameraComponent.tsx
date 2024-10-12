import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useRef, useState } from 'react';
import { Button, Text, TouchableOpacity, View, Image } from 'react-native';

import * as icons from '@/constants/icons';

export default function App() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState<string | null>(null); // To store the picture URI
  const [cameraReady, setCameraReady] = useState<boolean>(false);
  let camera: CameraView | null = null;

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View className="flex-1 justify-center">
        <Text className="text-center pb-2">We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  async function takePicture() {
    if (camera) {
      const photo = await camera.takePictureAsync({
        quality: 1,
        base64: true,
      });
      if (!photo) {
        console.error('No photo taken');
        return;
      }
      setPhoto(photo.uri);
      console.log(photo.uri);
  }
}

const retakePicture = () => {
  setPhoto(null);
}

  return (
    <View className="flex-1 justify-center">
      {photo ? (
        <>
        <Image source={{ uri: photo }} className="flex-1" /> 
        <TouchableOpacity className="absolute top-20 left-5 items-center" onPress={retakePicture}>
          <View className="rounded-full p-2 z-0 w-12 h-12 bg-black opacity-50" />
        <Image source={icons.close} className="h-8 w-8 z-10 absolute top-2" tintColor="white" />
      </TouchableOpacity>
      </>
      ) : (
        <CameraView
          className="flex-1"
          facing={facing}
          ref={(r) => {
            camera = r
            }}
          onCameraReady={() => setCameraReady(true)}
        >
          <View className="flex-1 flex-row gap-x-5 items-end justify-center bg-transparent mb-20">
            <TouchableOpacity className="items-center" onPress={toggleCameraFacing}>
              <Image source={icons.flipCamera} className="h-8 w-8 mb-3" tintColor="white" />
            </TouchableOpacity>
            <TouchableOpacity className="items-center" onPress={takePicture}>
              <View className="bg-white rounded-full p-2 mr-10">
                <View className="bg-primary-0 rounded-full w-12 h-12" />
              </View>
            </TouchableOpacity>
          </View>
        </CameraView>
      )}
    </View>
  );
}
