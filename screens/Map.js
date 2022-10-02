import { useCallback, useState, useLayoutEffect } from 'react'
import { Alert, StyleSheet } from 'react-native'
import MapView, { Marker } from 'react-native-maps'
import IconButton from '../components/UI/IconButton'

function Map({ navigation, route }) {
  const readOnly = !!route.params
  const initialLocation = route.params && {
    latitude: route.params.initialLatitude,
    longitude: route.params.initialLongitude,
  }

  const [selectedLocation, setSelectedLocation] = useState(initialLocation)
  const region = {
    latitude: initialLocation ? initialLocation.latitude : 37.78,
    longitude: initialLocation ? initialLocation.longitude : -122.43,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  }

  function selectLocationHandler(event) {
    if (readOnly) {
      return
    }
    const lat = event.nativeEvent.coordinate.latitude
    const lng = event.nativeEvent.coordinate.longitude
    setSelectedLocation({ latitude: lat, longitude: lng })
  }

  const savePickedLocationHandler = useCallback(() => {
    if (!selectedLocation) {
      Alert.alert('No location picked!', 'Pick a location')
      return
    }
    navigation.navigate('AddPlace', { pickedLocation: selectedLocation })
  }, [navigation, selectedLocation])

  useLayoutEffect(() => {
    if (initialLocation) {
      return
    }
    navigation.setOptions({
      headerRight: ({ tintColor }) => (
        <IconButton
          icon="save"
          size={24}
          color={tintColor}
          onPress={savePickedLocationHandler}
        />
      ),
    })
  }, [navigation, savePickedLocationHandler, initialLocation])

  return (
    <MapView
      initialRegion={region}
      style={styles.map}
      onPress={selectLocationHandler}
    >
      {selectedLocation && (
        <Marker
          title="Picked Location"
          coordinate={{
            latitude: selectedLocation.latitude,
            longitude: selectedLocation.longitude,
          }}
        />
      )}
    </MapView>
  )
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
})

export default Map
