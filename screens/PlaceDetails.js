import { useEffect, useState } from 'react'
import { Image, ScrollView, Text, View, StyleSheet } from 'react-native'

import OutlinedButton from '../components/UI/OutlinedButton'
import { Colors } from '../constants/colors'
import { fetchPlaceDetails } from '../util/database'

function PlaceDetails({ route, navigation }) {
  const selectedPlaceId = route.params.placeId
  const [fetchedPlace, setFetchedPlace] = useState()

  useEffect(() => {
    async function loadPlaceData() {
      const place = await fetchPlaceDetails(selectedPlaceId)
      setFetchedPlace(place)
      navigation.setOptions({
        title: place.title,
      })
    }
    loadPlaceData()
  }, [selectedPlaceId])

  function showOnMapHandler() {
    navigation.navigate('Map', {
      initialLatitude: fetchedPlace.location.latitude,
      initialLongitude: fetchedPlace.location.longitude,
    })
  }

  if (!fetchedPlace) {
    return (
      <View style={styles.fallback}>
        <Text>Loading place data...</Text>
      </View>
    )
  }
  return (
    <ScrollView>
      <Image style={styles.image} source={{ uri: fetchedPlace.imageUri }} />
      <View style={styles.locationContainer}>
        <View style={styles.addressContainer}>
          <Text style={styles.address}>{fetchedPlace.address}</Text>
        </View>
        <OutlinedButton icon="map" onPress={showOnMapHandler}>
          View on Map
        </OutlinedButton>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  fallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    minHeight: 300,
    height: '35%',
    width: '100%',
  },
  locationContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  addressContainer: {
    padding: 20,
  },
  address: {
    color: Colors.primary500,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
})
export default PlaceDetails
