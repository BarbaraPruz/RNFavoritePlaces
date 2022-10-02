import { useState } from 'react'
import { Alert, Image, StyleSheet, Text, View } from 'react-native'
import {
  launchCameraAsync,
  useCameraPermissions,
  PermissionStatus,
} from 'expo-image-picker'
import { Colors } from '../../constants/colors'
import OutlinedButton from '../UI/OutlinedButton'

function ImagePicker({ onTakeImage }) {
  const [pickedImage, setPickedImage] = useState()

  const [
    cameraPermissionInformation,
    requestPermission,
  ] = useCameraPermissions()

  async function verifyPermissions() {
    if (cameraPermissionInformation.status === PermissionStatus.UNDETERMINED) {
      const permissionResponse = await requestPermission()
      return permissionResponse.granted
    }
    if (cameraPermissionInformation.status === PermissionStatus.DENIED) {
      Alert(
        'Insufficient Permission',
        'To use app, grant app camera permissions',
      )
      return false
    }
    return true
  }

  async function takeImageHandler() {
    const hasPermission = await verifyPermissions()
    if (!hasPermission) {
      return
    }
    const image = await launchCameraAsync({
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.5,
    })
    setPickedImage(image.uri)
    onTakeImage(image.uri)
  }

  let imagePreview = <Text>No image taken yet</Text>

  if (pickedImage) {
    imagePreview = <Image source={{ uri: pickedImage }} style={styles.image} />
  }
  return (
    <View>
      <View style={styles.imagePreview}>{imagePreview}</View>
      <OutlinedButton onPress={takeImageHandler} icon="camera">
        Take Image
      </OutlinedButton>
    </View>
  )
}

const styles = StyleSheet.create({
  imagePreview: {
    width: '100%',
    height: 200,
    marginVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary100,
    borderRadius: 4,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
})

export default ImagePicker
