import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useRef, useState } from 'react';
import { Button, Text, TouchableOpacity, View, Image } from 'react-native';

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
        <Text className="text-xl font-bold text-white">Retake Picture</Text>
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
          <View className="flex-1 flex-row bg-transparent mb-20">
            <TouchableOpacity className="flex-1 self-end items-center" onPress={toggleCameraFacing}>
              <Text className="text-xl font-bold text-white">Flip Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 self-end items-center" onPress={takePicture}>
              <Text className="text-xl font-bold text-white">Take Picture</Text>
            </TouchableOpacity>
          </View>
        </CameraView>
      )}
    </View>
  );
}
