import { useEffect, useState } from 'react'
import { useNavigation, useRoute, useIsFocused } from '@react-navigation/native'
import { Alert, Image, Text, View, StyleSheet } from 'react-native'
import {
  getCurrentPositionAsync,
  useForegroundPermissions,
  PermissionStatus,
} from 'expo-location'

import OutlinedButton from '../UI/OutlinedButton'
import { getAddress, getMapPreview } from '../../util/location'
import { Colors } from '../../constants/colors'

function LocationPicker({ onPickLocation }) {
  const navigation = useNavigation()
  const route = useRoute()
  const isFocused = useIsFocused()

  const [pickedLocation, setPickedLocation] = useState()
  const [
    locationPermissionInformation,
    requestPermission,
  ] = useForegroundPermissions()

  useEffect(() => {
    if (isFocused && route.params) {
      const mapPickedLocation = route.params.pickedLocation
      setPickedLocation(mapPickedLocation)
    }
  }, [route, isFocused])

  useEffect(() => {
    async function handleLocation() {
      if (pickedLocation) {
        const address = await getAddress(
          pickedLocation.latitude,
          pickedLocation.longitude,
        )
        onPickLocation({ ...pickedLocation, address })
      }
    }
    handleLocation()
  }, [pickedLocation, onPickLocation])

  async function verifyPermissions() {
    if (
      locationPermissionInformation.status === PermissionStatus.UNDETERMINED
    ) {
      const permissionResponse = await requestPermission()
      return permissionResponse.granted
    }
    if (locationPermissionInformation.status === PermissionStatus.DENIED) {
      Alert(
        'Insufficient Permission',
        'To use current location, grant app location permissions',
      )
      return false
    }
    return true
  }

  async function getLocationHandler() {
    const hasPermission = await verifyPermissions()
    if (!hasPermission) {
      return
    }
    const location = await getCurrentPositionAsync()
    setPickedLocation({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    })
  }

  function pickOnMapHandler() {
    navigation.navigate('Map')
  }

  let locationPreview = <Text>No location picked yet</Text>
  if (pickedLocation) {
    locationPreview = (
      <Image
        style={styles.image}
        source={{
          uri: getMapPreview(pickedLocation.latitude, pickedLocation.longitude),
        }}
      />
    )
  }

  return (
    <View>
      <View style={styles.mapPreview}>{locationPreview}</View>
      <View style={styles.actions}>
        <OutlinedButton icon="location" onPress={getLocationHandler}>
          Locate User
        </OutlinedButton>
        <OutlinedButton icon="map" onPress={pickOnMapHandler}>
          Pick on map
        </OutlinedButton>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  mapPreview: {
    width: '100%',
    height: 200,
    marginVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary100,
    borderRadius: 4,
    overflow: 'hidden',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
})

export default LocationPicker
