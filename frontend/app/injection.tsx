import { TextInput, StyleSheet, Pressable, View } from "react-native";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';


 export const Injection = (props: { unitInsuline: number; decreaseUnit: () => void; increaseUnit: () => void }) => {

    return (
        <View style={styles.container}>
            <Pressable onPress={props.decreaseUnit}>
                <FontAwesome6 name="square-minus" size={36} color="black" />
            </Pressable>
            <TextInput
                style={styles.inputText}
                value={props.unitInsuline.toString()}
            />
            <Pressable onPress={props.increaseUnit}>
                <FontAwesome6 name="square-plus" size={36} color="black" />
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center"
    },
    inputText: {
        textAlign: "center",
        borderWidth: 2,
        marginHorizontal: 4,
        borderRadius: 10,
        lineHeight: 24,
    }
})

 
