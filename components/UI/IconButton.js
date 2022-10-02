import { Pressable, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

function IconButton({ icon, size, color, onPress }) {
  return (
    <Pressable
      style={(pressed) => [styles.button, pressed && styles.pressed]}
      onPress={onPress}
    >
      <Ionicons name={icon} size={size} color={color} />
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
    padding: 8,
    justifyContent: 'center',
    alignContent: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
})

export default IconButton
