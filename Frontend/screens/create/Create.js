import { Alert, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { event as EventRespository } from '../../repositories'
import icons from '../../constants/icons'
import colors from '../../constants/colors'

export default function Create(props) {
    const navigation = useNavigation()

    const handleSubmit = async () => {
        const {infor, questionList, departmentList, userId} = props.route.params

        const formData = new FormData()
        formData.append('name', infor.name)
        formData.append('slogan', infor.slogan)
        formData.append('location', infor.location)
        formData.append('date_start', infor.date_start)
        formData.append('date_end', infor.date_end)
        formData.append('description', infor.description)
        formData.append('type_name', infor.type_name)
        if(infor.image)
        {
            formData.append('image', {
                uri: infor.image,
                type: 'image/jpeg',
                name: 'event.jpg'
            })
        }
        formData.append('createdBy', userId)
        formData.append('status', 1)
        formData.append('departments', JSON.stringify(departmentList))
        formData.append('questions', JSON.stringify(questionList))
        
        await EventRespository.createEvent(formData)
        .then(res => {
            navigation.navigate('MyEventDetail', {eventId: res.result.id})
        })
        .catch(err => {
            Alert.alert('Something went wrong!')
        })
    }
    return (
        <View style={styles.container}>
            <Image source={icons.check}  style={styles.icon}/>
            <TouchableOpacity onPress={handleSubmit} style={styles.btn}>
                <Text style={styles.textBtn}>Create</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        backgroundColor: colors.primary
    },
    icon: {
        tintColor: colors.white,
        height: 200,
        width: 200,
    },
    btn: {
        backgroundColor: colors.white,
        width: '80%',
        marginTop: 20,
        borderRadius: 100,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textBtn: {
        color: colors.accent,
        textTransform: 'uppercase',
        fontWeight: '600',
        fontSize: 18
    }
})